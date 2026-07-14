# Seller Registration and Onboarding Linear Plan

## Project

**Name**: Seller Registration and Onboarding MVP

**Goal**: Allow a marketplace customer or a standalone applicant to become a verified seller through a resumable onboarding workflow, ending in manual admin approval.

**Outcome**: A seller can complete business, store, address, bank, and document steps, submit for review, and become approved to sell after admin verification.

**Primary Apps**:

- `apps/api`: Seller onboarding API, validation, persistence, review workflow.
- `apps/web`: Customer-facing entry points and standalone seller application flow.
- `apps/seller-central`: Seller onboarding workspace and post-approval seller shell.
- `apps/admin-central`: Admin review queue and approval/rejection tools.
- `packages/db`: Seller, store, address, bank, and document schema changes.
- `packages/store`: Shared RTK Query API endpoints and auth-aware client state.

## Seller Entry Models

### Flow A: Existing Customer Becomes Seller

An authenticated customer clicks **Become a Seller** from the storefront or account area.

Expected behavior:

- Reuse the existing `User`.
- Create a `Seller` record early with `status = DRAFT`.
- Add the `SELLER` role only after approval, or keep selling privileges gated strictly by `Seller.status = APPROVED`.
- Resume onboarding from the last completed step.

### Flow B: Standalone Seller Registration

A visitor starts from a public seller landing/application route, similar to Flipkart-style onboarding.

Expected behavior:

- If unauthenticated, collect account credentials first.
- Create the `User` as an unverified or newly verified account.
- Continue into the same seller onboarding state machine after authentication.
- Avoid a separate seller identity model in V1; seller ownership still maps to one `User`.

## State Machine

Seller status transitions:

```text
DRAFT
  -> DOCUMENTS_PENDING
  -> UNDER_REVIEW
  -> APPROVED
  -> REJECTED
  -> SUSPENDED
```

V1 transition rules:

- `DRAFT`: Seller record exists, onboarding is incomplete or in progress.
- `DOCUMENTS_PENDING`: Business and store basics exist, but required documents or bank data are missing.
- `UNDER_REVIEW`: Seller submitted completed onboarding for admin review.
- `APPROVED`: Admin approved seller. Seller can access selling features.
- `REJECTED`: Admin rejected submission. Seller can edit rejected sections and resubmit.
- `SUSPENDED`: Admin blocked a previously approved seller.

## Linear Setup

### Teams

- Backend
- Web
- Seller Central
- Admin Central
- Platform
- QA

### Labels

- `seller-onboarding`
- `api`
- `web`
- `seller-central`
- `admin-central`
- `db`
- `auth`
- `kyc`
- `security`
- `mvp`
- `qa`

### Milestones

1. Discovery and Contracts
2. Data Model and Backend Foundation
3. Customer and Standalone Entry
4. Seller Onboarding UI
5. Admin Review Workflow
6. End-to-End QA and Release

## Milestone 1: Discovery and Contracts

### Issue 1.1: Define seller onboarding business workflow

**Team**: Product / Backend

**Description**: Finalize the onboarding lifecycle, entry points, required data, and rules for V1.

**Acceptance Criteria**:

- Existing customer and standalone seller entry flows are documented.
- Required onboarding steps are confirmed.
- Required documents per `BusinessType` are defined.
- Seller approval remains manual for MVP.
- One user can own only one seller account in V1.

### Issue 1.2: Define API contracts for seller onboarding

**Team**: Backend

**Description**: Specify incremental endpoints that allow saving and resuming onboarding progress.

**Target Endpoints**:

```http
POST   /api/seller
GET    /api/seller/onboarding
PUT    /api/seller/business
PUT    /api/seller/store
PUT    /api/seller/address
POST   /api/seller/bank-accounts
PUT    /api/seller/bank-accounts/:id
DELETE /api/seller/bank-accounts/:id
POST   /api/seller/documents
DELETE /api/seller/documents/:id
POST   /api/seller/submit
```

**Acceptance Criteria**:

- Request and response shapes are documented.
- Validation errors are mapped to existing `AppError` subclasses.
- Auth requirements are defined for every endpoint.
- Role/status authorization rules are documented.

### Issue 1.3: Define admin review API contracts

**Team**: Backend / Admin Central

**Target Endpoints**:

```http
GET  /api/admin/sellers?status=UNDER_REVIEW
GET  /api/admin/sellers/:sellerId
POST /api/admin/sellers/:sellerId/approve
POST /api/admin/sellers/:sellerId/reject
POST /api/admin/sellers/:sellerId/suspend
```

**Acceptance Criteria**:

- Admin-only access is required.
- Rejection supports remarks and section/document-level reasons.
- Approval sets `Seller.status = APPROVED` and `approvedAt = now()`.
- Rejection sets `Seller.status = REJECTED`.

## Milestone 2: Data Model and Backend Foundation

### Issue 2.1: Audit current seller Prisma schema

**Team**: Backend / Platform

**Description**: Compare current `Seller`, `Store`, `BankAccount`, `SellerVerification`, and `SellerDocument` models against onboarding needs.

**Acceptance Criteria**:

- Gaps are listed before schema changes.
- Shared `Address` relationship is confirmed.
- Unique ownership constraint `Seller.ownerUserId` is preserved.
- Migration plan is documented.

### Issue 2.2: Add seller onboarding repository layer

**Team**: Backend

**Files**:

- `apps/api/src/modules/seller/seller.repository.ts`

**Acceptance Criteria**:

- Repository uses Prisma only.
- Sensitive data is not selected unnecessarily.
- Optional values map `undefined` to `null` where needed.
- Common reads include seller, store, address, bank accounts, verification, and documents.

### Issue 2.3: Add seller onboarding schemas and types

**Team**: Backend

**Files**:

- `apps/api/src/modules/seller/seller.schema.ts`
- `apps/api/src/modules/seller/seller.types.ts`

**Acceptance Criteria**:

- Zod validates all onboarding step payloads.
- Store slug format is validated.
- Bank account payload is validated.
- Required document types can be derived from business type.

### Issue 2.4: Add seller onboarding service layer

**Team**: Backend

**Files**:

- `apps/api/src/modules/seller/seller.service.ts`

**Acceptance Criteria**:

- Service contains business rules and state transitions.
- Existing users cannot create more than one seller.
- Submission validates required fields, primary bank account, and required documents.
- Rejected sellers can edit and resubmit.
- Approved sellers cannot restart onboarding.

### Issue 2.5: Add seller onboarding controller and routes

**Team**: Backend

**Files**:

- `apps/api/src/modules/seller/seller.controller.ts`
- `apps/api/src/modules/seller/seller.routes.ts`
- `apps/api/src/modules/api.routes.ts`

**Acceptance Criteria**:

- Controllers parse payloads with Zod.
- Controllers delegate to service layer only.
- Routes use `requireAuth`.
- Write routes use rate limiting where appropriate.
- Relative ESM imports include `.js`.

## Milestone 3: Customer and Standalone Entry

### Issue 3.1: Add storefront Become a Seller entry point

**Team**: Web

**Acceptance Criteria**:

- Authenticated customers can start onboarding.
- Unauthenticated users are redirected to login/register with return intent.
- Existing draft sellers continue their current onboarding step.

### Issue 3.2: Add standalone seller application entry

**Team**: Web

**Acceptance Criteria**:

- Public route introduces seller application without requiring prior customer navigation.
- New users can register and continue into onboarding.
- Existing users can sign in and continue into onboarding.
- Both flows converge into the same backend seller record model.

### Issue 3.3: Add shared seller onboarding RTK Query API

**Team**: Web / Platform

**Files**:

- `packages/store/src/api/seller/seller-api.ts`
- `packages/store/src/api/seller/seller-api.types.ts`

**Acceptance Criteria**:

- Endpoints cover onboarding read/write operations.
- Uses existing `baseApi` reauth behavior.
- Tags invalidate onboarding state after each step save.

## Milestone 4: Seller Onboarding UI

### Issue 4.1: Build onboarding shell in Seller Central

**Team**: Seller Central

**Acceptance Criteria**:

- Step navigation shows progress.
- Users can leave and resume later.
- Current step is derived from backend onboarding state.
- Submitted/approved/rejected states render distinct views.

### Issue 4.2: Build business information step

**Team**: Seller Central

**Acceptance Criteria**:

- Captures business name, business type, contact email, and contact phone.
- Saves without requiring later steps.
- Shows backend validation errors.

### Issue 4.3: Build store setup step

**Team**: Seller Central

**Acceptance Criteria**:

- Captures display name, slug, description, logo, and banner.
- Slug availability or uniqueness errors are handled.
- Media upload can be mocked if full media service is not ready.

### Issue 4.4: Build business address step

**Team**: Seller Central

**Acceptance Criteria**:

- Captures address fields using shared address model.
- Supports editing before submission.
- Required address fields are validated client and server side.

### Issue 4.5: Build bank account step

**Team**: Seller Central

**Acceptance Criteria**:

- Seller can add at least one bank account.
- Seller can mark exactly one account as primary.
- Submission is blocked without a primary account.

### Issue 4.6: Build document upload step

**Team**: Seller Central

**Acceptance Criteria**:

- Required document list changes by business type.
- Uploaded documents show status `PENDING`.
- Seller can replace documents before submission.

### Issue 4.7: Build review and submit step

**Team**: Seller Central

**Acceptance Criteria**:

- Summary shows business, store, address, bank, and documents.
- Missing requirements are clearly shown.
- Submit changes status to `UNDER_REVIEW`.
- Post-submit screen explains manual review status.

## Milestone 5: Admin Review Workflow

### Issue 5.1: Build admin seller review queue

**Team**: Admin Central

**Acceptance Criteria**:

- Admin can filter sellers by status.
- `UNDER_REVIEW` sellers are visible in a queue.
- Queue shows business name, owner, submitted date, and status.

### Issue 5.2: Build admin seller detail review page

**Team**: Admin Central

**Acceptance Criteria**:

- Admin can review business details, store details, address, bank, and documents.
- Documents are visible or downloadable.
- Existing status and rejection reasons are visible.

### Issue 5.3: Build approve seller action

**Team**: Backend / Admin Central

**Acceptance Criteria**:

- Only admins can approve.
- Approval sets status to `APPROVED`.
- Approval sets `approvedAt`.
- Seller gains access to seller features after approval.

### Issue 5.4: Build reject seller action

**Team**: Backend / Admin Central

**Acceptance Criteria**:

- Only admins can reject.
- Rejection requires a reason.
- Seller can view rejection reason.
- Seller can edit and resubmit.

## Milestone 6: End-to-End QA and Release

### Issue 6.1: Add backend tests for seller onboarding service

**Team**: QA / Backend

**Acceptance Criteria**:

- Tests cover draft creation.
- Tests cover duplicate seller prevention.
- Tests cover submit validation failures.
- Tests cover approval and rejection transitions.
- Tests cover rejected seller resubmission.

### Issue 6.2: Add frontend flow QA checklist

**Team**: QA / Web / Seller Central / Admin Central

**Acceptance Criteria**:

- Existing customer can become seller.
- Standalone applicant can become seller.
- Draft progress persists after refresh/logout.
- Missing required fields block submission.
- Admin approval unlocks seller access.
- Admin rejection allows resubmission.

### Issue 6.3: Release readiness review

**Team**: Product / Engineering

**Acceptance Criteria**:

- Environment variables are documented.
- Database migrations are reviewed.
- Manual test evidence is attached.
- Known limitations are documented.
- MVP is approved for development branch merge.

## Dependencies

- Auth module must remain stable.
- Prisma schema must support seller/store/address/bank/document relationships.
- File/media upload strategy must be decided before final document upload work.
- Admin role enforcement must work reliably.
- Seller Central app needs a real onboarding shell beyond the starter page.

## MVP Non-Goals

- Automated KYC provider integration.
- Automated bank verification.
- Multi-seller ownership per user.
- Multi-admin review assignment workflow.
- Seller product listing creation.
- Payment settlement integration.
- Advanced document OCR or fraud checks.

## Definition of Done

- Both seller entry flows converge into one onboarding workflow.
- Onboarding is resumable at every step.
- Backend state transitions are enforced server side.
- Admin can approve or reject submissions.
- Approved sellers are the only sellers allowed into selling capabilities.
- Tests cover core state transitions and validation.
- Linear issues include owner, estimate, label, priority, and milestone.

