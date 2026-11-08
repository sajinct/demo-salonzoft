# ADR 001 — Application and data-access boundaries

**Date:** 3 November 2026  
**Status:** Adopted for implementation; not yet implemented.

## Decision

Use an Angular client-side application and a Supabase-backed modular monolith. There is no separate always-running Node API server in the initial design.

Angular uses strict TypeScript, standalone components, lazy routes, reactive forms, signals for page/derived state and RxJS for appropriate streams. Angular Material/CDK is the single initial component system, themed for Miznora. Phase 01 verifies and pins a supported complete toolchain; the locally observed Node version is not an approval of its compatibility.

## Proposed source structure

```text
frontend/src/app/
  core/          auth, context, api, config, money, time, i18n, errors
  shared/        accessible reusable presentation controls
  features/
    auth/ shell/ dashboard/ settings/ services/ team/ clients/
    calendar/ checkout/ reports/ booking/ inventory/ benefits/
    workforce/ marketing/ messaging/ platform/
supabase/
  migrations/    schema, grants, RLS, functions, triggers, extensions
  functions/     provider boundaries, webhooks, public gateways, workers
  tests/         authorization, invariants, concurrency
  seed.sql       synthetic data only
docs/architecture/
docs/runbooks/
.github/workflows/
```

Create feature folders only as implemented; the list is not an instruction to ship placeholder modules.

Each feature owns its pages, form models, facade/state and typed data adapter. Shared code owns infrastructure primitives, not a catch-all business service. Components call adapters/facades instead of directly importing an elevated client or sequencing related database writes.

## Operation placement

| Operation | Boundary |
|---|---|
| Authorized directory search and ordinary safe CRUD | Feature adapter → Supabase Data API, restricted columns, grants and RLS |
| Booking, reschedule, cancellation, sale posting, payment recording, refund, redemption, stock transfer | One Postgres command function/transaction |
| Membership/role/ownership changes | Controlled trusted command with explicit current authorization |
| Sending email, creating provider orders, exchanging integration credentials | Edge/provider adapter; persisted intents and outcomes |
| Provider callback | Signature-verified Edge endpoint → idempotent database command |
| Reports/exports | Scoped views/RPCs; large work through jobs; no unrestricted elevated dump |
| Files | Storage API plus object-level policies and attachment metadata |
| Live updates | Authorized subscriptions trigger reconciliation/refetch; not source of transaction truth |

Security-invoker functions are the default. Use carefully reviewed security-definer functions only for a bounded invariant that cannot be safely expressed otherwise. Restrict execution and use qualified objects/fixed search paths. [Supabase database functions](https://supabase.com/docs/guides/database/functions)

## Data and presentation state

Generated database types are the storage model, not automatically the public API. Money-bearing RPCs return explicit decimal strings. A feature DTO controls which fields cross a trust boundary.

Keep selected business/location in context for navigation, but reauthorize requests server-side. On context changes cancel in-flight work, clear scoped state and dispose subscriptions. A cache key includes principal, business, location and relevant permission/version context; do not reuse private cached exports after logout.

## Consequences and alternatives

Direct browser CRUD is useful for small independent records. It is rejected for multi-record financial/scheduling changes because partial completion would violate business invariants. Edge Functions remain useful at external boundaries, but several Edge-to-REST calls do not become one atomic database transaction.

No broad global state framework, microservices, SSR server, offline mutation queue or public marketplace is needed for the first operational MVP. Add such complexity only through a later explicit decision. Every mutation screen must expose real persistence, errors and pending state.

