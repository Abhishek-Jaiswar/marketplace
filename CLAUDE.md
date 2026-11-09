# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Multi-vendor marketplace in a pnpm + Turborepo monorepo.

| Workspace | Purpose | Dev port |
| --- | --- | --- |
| `apps/web` | Customer storefront (Next.js) | 3000 |
| `apps/seller-central` | Seller onboarding and dashboard (Next.js) | 3001 |
| `apps/admin-central` | Admin console (Next.js) | 3002 |
| `apps/api` | REST API (Express 5, ESM), mounted at `/api` | 4000 |
| `packages/contracts` (`@workspace/contracts`) | Zod schemas and API types shared by the API and clients | |
| `packages/db` (`@workspace/db`) | Prisma 8 schema, migrations, client | |
| `packages/store` (`@workspace/store`) | Redux store and RTK Query API layer | |
| `packages/ui` (`@workspace/ui`) | shadcn/ui components on `@base-ui/react`, Tailwind 4 | |
| `packages/logger` (`@workspace/logger`) | Shared logger | |

## Next.js version

The apps run Next.js 16 and React 19, which have breaking changes from older versions: APIs, conventions, and file structure may differ from your training data. Before writing Next.js code, read the relevant guide in `apps/<app>/node_modules/next/dist/docs/` (it is not in the root `node_modules`) and heed deprecation notices.

## Commands

Run from the repo root.

```bash
pnpm dev                 # emit Prisma contract, then run all apps
pnpm build               # emit Prisma contract, then build everything
pnpm lint
pnpm typecheck
pnpm format              # or format:check, as CI runs it
pnpm test                # API unit and HTTP tests (no services needed)
pnpm test:integration    # API repository tests against real Postgres
pnpm redis:up            # start local Redis (docker compose)

# One workspace
pnpm --filter api dev
pnpm --filter seller-central typecheck
pnpm --filter @workspace/db build

# One test file, or one test by name (run from the repo root)
pnpm --filter api exec vitest run src/modules/inventory/inventory.routes.test.ts
pnpm --filter api exec vitest run -t "pins a seller"

# Add a shadcn component (lands in packages/ui/src/components)
pnpm dlx shadcn@latest add button -c apps/web
```

CI (`.github/workflows/ci.yml`, Node 22) runs `db:generate`, `format:check`, `lint`, `typecheck`, both test suites, then `build`. To exercise the API by hand, use the Postman collection in `postman/`; `postman/README.md` lists the seeded admin and seller logins.

### Tests

Vitest, in `apps/api` only so far. `*.test.ts` runs the real Express app through supertest with repositories mocked. `*.integration.test.ts` exercises repositories against Postgres, which is the only way to cover tenant scoping, row locks, and Prisma's query budgets.

Integration tests use `TEST_DATABASE_URL`, or `DATABASE_URL` with `_test` appended, and refuse any database whose name does not end in `_test`. Setup creates the database and runs `prisma db update`. Tests isolate themselves with unique fixtures rather than cleaning up.

`no-explicit-any` and two `react-hooks` rules are warnings only as a temporary measure; remove uses as code is migrated.

### Database

```bash
pnpm db:generate         # re-emit contract.json / contract.d.ts after schema changes
pnpm migration:plan      # create a migration in packages/db/migrations
pnpm db:migrate          # apply planned migrations
pnpm db:update           # update database state directly, without a migration
pnpm db:verify
pnpm db:seed
pnpm db:reset            # DESTRUCTIVE: see below
```

`migration:plan` starts from the `db` ref in `packages/db/migrations/app/refs/db.json`, not from the newest migration. If the ref is behind, pass `--from <hash>`; `prisma migration status` shows where the database actually is.

`db:reset` runs `DROP SCHEMA public CASCADE` against whatever `DATABASE_URL` points at, then re-initializes and seeds. It requires `psql` on the PATH.

## Local setup

- Configuration lives in the root `.env`. `apps/api` validates its environment with Zod at startup (`apps/api/src/config/env.config.ts`) and refuses to start if required values such as `DATABASE_URL`, `CLOUDINARY_*`, or `MAIL_*` are missing.
- The API checks both Postgres and Redis on boot. `compose.yaml` only provides Redis; Postgres (15+) must be supplied separately.
- `packages/db/README.md` states Node 24+ for Prisma; CI uses 22.

## Architecture

### Package resolution

`@workspace/db`, `@workspace/logger`, and `@workspace/contracts` are consumed from compiled `dist/`. Turbo builds them before `dev`, `typecheck`, and `test`, but not while `dev` is running, so after changing one mid-session (or a Prisma schema), run `pnpm --filter <package> build`. `@workspace/store` and `@workspace/ui` are consumed as TypeScript source and need no build.

### Database (Prisma 8 RC)

This is Prisma 8 (`@prisma/orm-postgres`), not Prisma 7 or earlier. There is no `schema.prisma` or `@prisma/client`, and query syntax differs:

```ts
await db.orm.public.InventoryLocation.include("address").first({ id })
await db.transaction(async (tx) => { await tx.orm.public.Address.create({ ... }) })
```

- Models live in `packages/db/src/prisma/schema/*.prisma`, split by domain. `prisma.config.ts` discovers every file in that directory and overrides the `contract.prisma` path it declares, so that file does not exist despite what `packages/db/README.md` says. ADRs that cite `packages/db/prisma/schema/` are also out of date.
- `contract.json` and `contract.d.ts` are generated but committed; regenerate them rather than editing by hand.
- Model and enum types are re-exported by hand from `packages/db/src/index.ts`. Add new ones there.
- The client (`packages/db/src/prisma/db.ts`) uses lint middleware that turns `DELETE`/`UPDATE` without `WHERE` into errors, and budgets that **throw on any SELECT without a LIMIT**. Bound unpaginated `.all()` calls with `MAX_UNPAGED_ROWS` (`apps/api/src/utils/query-limits.ts`).
- Read-then-write inside a transaction needs a row lock (`.forUpdate()`, or `.forNoKeyUpdate()` on rows other tables reference).
- Prisma 8 reference: `packages/db/prisma-8.md`.

### API modules (`apps/api/src/modules/<domain>/`)

Each domain has `*.routes`, `*.controller`, `*.service`, `*.repository`, `*.cache`, and either contracts in `packages/contracts` or legacy `*.schema`/`*.types` files. Register new routers in `modules/api.routes.ts`. Full conventions are in `.agents/skills/codebase-structure-guidelines/SKILL.md`, but `inventory` is the reference module for the target pattern, and it supersedes that file where they differ. Other modules are still being migrated to it. The essentials:

- **Controller**: uses `parse(schema, value)` and `getAuthUser(req)` from `utils/http/request`, delegates to the service, and responds with `sendOk`/`sendCreated`/`sendPaginated`. No `try/catch`: Express 5 forwards rejected promises to the error handler.
- **Response shape**: `{ data, message? }`, or `{ data: [], meta }` for lists (`packages/contracts/src/common.ts`).
- **Modules** reach each other through the other module's `index.ts`.
- **Service**: business logic with no `req`/`res`. Signals failures by throwing `AppError` subclasses from `utils/errors`, which the global handler renders as `{ error: { message, statusCode, details? } }`.
- **Repository**: the only layer that touches `db`. Uses explicit selects to avoid leaking sensitive columns, and maps `undefined` to `null` because the API compiles with `exactOptionalPropertyTypes`.
- **Cache**: per-module wrapper around `cacheService` that owns key building. List endpoints use version-based keys (`user:list:v1:page:1`), bumping the version on writes instead of scanning for wildcards.
- **Route guards** are composed in order: `requireAuth`, `requireRole([...])`, then `rateLimiter({...})`, then the controller. Apply rate limiting to write and entry-level endpoints.
- Relative imports must end in `.js`, even for `.ts` sources (ESM).

### Domain model (see `docs/adrs/`)

- User identity is separate from `Credential`, `Session`, and `VerificationToken` (ADR 0001).
- `Seller` is split into `Store`, `BankAccount`, and verification/KYC tables (ADR 0002).
- `Address` is a shared table; orders are meant to snapshot it as JSON (ADR 0004).
- Catalog is two-tier: admin-moderated `Product` (SPU) and `ProductVariant` (SKU), with sellers attaching `SellerListing` offers rather than duplicating products (ADR 0005).
- Commerce runs checkout to payout (ADR 0006): an `Order` splits into one `SellerOrder` per seller, order rows snapshot price and tax, and sellers are paid from the append-only `SellerLedgerEntry`. New money columns are integer paise and rates are basis points. Most of these tables have no API yet; ADR 0006 gives the build order.
- Inventory is multi-location: `InventoryItem` per location, every stock change recorded in `InventoryLedger`, and checkout flowing through reserve, commit, and release on `InventoryReservation` (ADR 0005). Do not model stock as a single column on a product.

### Frontend data flow

- All API access goes through RTK Query. Each domain in `packages/store/src/api/<domain>/` calls `baseApi.injectEndpoints`. New endpoints need their hooks and types exported from `packages/store/src/index.ts`, and any new cache tags added to `tagTypes` in `baseApi.ts`.
- Auth: the access token is held in the Redux `auth` slice and sent as a Bearer header; the refresh token is an HTTP-only cookie. `baseQueryWithReauth` handles a 401 by calling `/users/refresh` behind a mutex and retrying.
- The API base URL comes from `NEXT_PUBLIC_API_URL`, falling back to `http://localhost:4000/api` in development.
- All apps use `makeStore` from `@workspace/store`; add new reducers in `packages/store/src/store.ts`.
- Shared components are imported as `@workspace/ui/components/<name>`.
