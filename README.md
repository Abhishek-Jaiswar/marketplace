# shadcn/ui monorepo template

This is a Next.js monorepo template with shadcn/ui.

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```

## Local services

Start Redis for local API development:

```bash
pnpm redis:up
```

The API defaults to `REDIS_URL=redis://localhost:6379`. Override it in the root
`.env` file for hosted Redis providers.

Useful API envs:

```env
LOG_LEVEL=info
REDIS_URL=redis://localhost:6379
REDIS_CONNECT_TIMEOUT_MS=5000
```
