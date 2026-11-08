# Phase 19 — Release verification and hosting

**Dependencies:** Selected product phases, applicable 18 operations controls and a declared release scope.

**Objective:** Verify a truthful release and prepare deployment to the correct demo or production target.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 19. All master requirements and common deliverables apply.

Audit the actual implementation against the selected scope and acceptance criteria. A large number of screens or passing compilation alone does not establish release readiness.

## A. End-to-end verification

1. Rebuild from a clean checkout and replay all migrations into a fresh database with synthetic seeds. Regenerate types and verify no drift.
2. Run authorization tests for anonymous, customer, staff, receptionist, manager, owner, finance and platform operator, including users in multiple businesses/locations.
3. Run concurrent booking/reschedule/blocked-time/stock/wallet tests, idempotent checkout/refund tests and provider duplicate/out-of-order event tests where implemented.
4. Demonstrate business setup → service/staff/shift → client/walk-in booking → appointment lifecycle → checkout → receipt → report reconciliation.
5. For public booking, verify ownership, lead-time/cancellation rules, verification delivery and reminder cancellation after reschedule.
6. Review mobile, keyboard, RTL, Arabic text, three-decimal OMR, business-local dates and printable receipts.
7. Verify loading/empty/error/forbidden/offline/retry states. Remove fake-success actions, seeded production demo values and unimplemented enabled routes.
8. Test private files, exports, logs, direct report/RPC access, Realtime teardown and cache clearing during tenant switches.
9. Use representative data volumes and documented performance targets; test actual query plans/indexes rather than claiming arbitrary scale.

## B. GitHub Pages demonstration target

Build the separate synthetic demo with hash routing, correct repository base href, a clear fictional-data notice and no live auth/backend/provider configuration. Use official Pages workflow artifacts and least-privilege permissions.

Verify direct demo hash URLs, refresh, nested asset paths, lazy chunks, Arabic switching and unsupported-route behavior. Validate the generated artifact contains no secrets or personal data. Do not collect user information or process real transactions on the Pages deployment.

## C. Real application target

Before deployment, require an explicitly selected host suitable for commercial SaaS. Configure SPA route fallback, assets/base path, exact Supabase auth callback URLs, HTTPS and required security headers. Do not pretend Pages becomes suitable because the backend is Supabase or the site has a custom domain.

Use separate staging/production Supabase projects. Verify project references and schema diff before migration, apply reviewed backend changes in a controlled workflow, deploy compatible frontend assets and smoke-test actual hosted auth/booking. Verify server-only secrets, webhook endpoints and job schedules without real charges/messages unless separately authorized.

## Completion

Produce release notes, a feature matrix marked implemented/tested/configuration-dependent/deferred, setup and deployment runbooks, recovery instructions and test evidence. Report every check not run and every configuration gate.

Preparing workflows is authorized implementation work; actual public deployment, remote migrations, live provider connections and billing activation require the user's applicable authorization. If production hosting is undecided, finish the demo/release artifacts and mark only production deployment blocked.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

