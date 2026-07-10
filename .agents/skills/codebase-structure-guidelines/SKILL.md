---
name: codebase-structure-guidelines
description: Guidelines and architectural context for codebase structure, code quality, readability, scalability, and backend best practices within the CBS Marketplace project.
---

# Codebase Structure & Backend Guidelines

This skill provides guidelines and architectural context for maintaining clean, scalable, readable, and highly secure code in the CBS Marketplace codebase.

---

## 1. Architectural Layers & Responsibilities

To ensure scalability and separation of concerns, the backend is organized into four distinct layers:

### A. Controller Layer (`*.controller.ts`)
- **Responsibility**: HTTP interface handling.
- **Rules**:
  - Parse and validate incoming payloads using Zod schemas.
  - Return early by throwing a `BadRequestError` if validation fails.
  - Delegate execution directly to the Service layer.
  - Capture any thrown errors and pass them to the global Express handler using `next(error)`.
  - Handle cookie configurations and security headers (e.g., HTTP-only secure refresh token cookies).

### B. Service Layer (`*.service.ts`)
- **Responsibility**: Pure business logic and transaction coordination.
- **Rules**:
  - Should not have any HTTP context (no `req` or `res` objects).
  - Interact with repositories for data persistence and cache wrappers for performance.
  - Throw specific `AppError` subclasses (e.g., `ConflictError`, `ForbiddenError`) to represent business failures.
  - Handle external service triggers (like email dispatching via `mailService`).

### C. Repository Layer (`*.repository.ts`)
- **Responsibility**: Database access using Prisma client.
- **Rules**:
  - Abstract SQL/Prisma operations from the service layer.
  - Map undefined parameters to `null` to satisfy TypeScript `exactOptionalPropertyTypes: true` compiler rules.
  - Use exact select payloads to restrict returning sensitive columns (e.g., password hashes or tokens).

### D. Cache Layer (`*.cache.ts`)
- **Responsibility**: Redis performance optimization.
- **Rules**:
  - Create specialized module-level cache wrappers (e.g., `UserCache`) around the core `CacheService` to encapsulate key-building logic.
  - Enforce version-based cache keys (e.g., `user:list:v1:page:1`) for list endpoints. This prevents expensive Redis wildcard scans by incrementing the version key on write operations to invalidate lists.

---

## 2. Error Handling Best Practices

- **Base Class**: Every custom operational error must inherit from `AppError` (extends `Error`).
- **Operational Flag**: Set `isOperational = true` on client-facing errors to distinguish them from unhandled system crashes.
- **Specific Errors**: Use specific semantic subclasses for API responses:
  - `BadRequestError` (400)
  - `UnauthorizedError` (401) - Use generic messages for login failures to prevent email enumeration.
  - `ForbiddenError` (403)
  - `NotFoundError` (404)
  - `ConflictError` (409)
  - `TooManyRequestsError` (429)
  - `InternalServerError` (500)

---

## 3. Caching & Security Best Practices

### A. Rate Limiting
- Apply the Redis sorted-set sliding window `rateLimiter` middleware on all entry-level or write endpoints.
- Configure rate limiters by IP (for registration/general routes) or by parsed request body email keys (to prevent targeted brute-forcing/account lockout spam).

### B. Decoupled Fields
- Decouple functional verification flags from business status states. For example, use a boolean `emailVerified` flag for email status checks, separate from the account state `status` (`ACTIVE`, `UNVERIFIED`, `SUSPENDED`).

### C. Import Formatting (ESM)
- The backend operates on ECMAScript Modules (ESM). All relative file imports MUST terminate with the `.js` extension (e.g., `import { userCache } from "./user.cache.js"`), even when referencing TypeScript source files.
