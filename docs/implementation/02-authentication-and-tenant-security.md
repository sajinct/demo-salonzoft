# Phase 02 — Authentication and tenant security

**Dependencies:** 01.

**Objective:** Build the real Supabase authentication, tenant model, database authorization and cross-tenant test foundation.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 02. All master requirements and common deliverables apply.

Implement this phase only for local/staging app mode. The Pages demo retains synthetic identity and never sends credentials.

## Database and trusted operations

1. Add migrations for profiles, businesses, business_members, role/permission definitions, member location scopes, staff identity links, invitations and append-only audit events.
2. Use controlled backend operations for business bootstrap, membership changes, invitations, acceptance, revocation and ownership transfer. Enforce last-owner protection and idempotent first-business creation.
3. Require authenticated/verified identity where appropriate; do not allow a new user to attach themselves to an existing business by supplying its UUID or changing user metadata.
4. Separate business, staff and customer identities. A staff profile need not have a login. Owner access must not depend on being assigned appointments.
5. Establish tenant-safe primary/composite foreign keys, indexes, ownership immutability, RLS, execution grants and secure helper functions. Prevent recursive membership-policy loops.
6. Avoid broad grants that allow direct changes to role, business status, ownership or audit actor fields. Handle permission revocation from controlled membership data rather than indefinitely trusting stale client claims.
7. Define the common authorization layer for user Edge Functions and RPCs. Elevated helpers require explicit membership/role/location checks and fixed search paths.
8. Configure private Storage buckets and policies for future client files; define separate intentionally public marketing assets. Path prefixes are organization aids, not the entire authorization check.
9. Produce generated TypeScript database types and typed auth/business context adapters.

## Angular flows

Build sign-in, sign-out, signup/confirmation where enabled, password recovery, session restoration, expired-session handling, invitation acceptance and business selection. Prevent protected-page flashes during session loading. Preserve only validated local return routes.

Use a real callback route on local/staging/approved production hosting. Configure exact Supabase redirect allowlists. Choose one PKCE/session exchange strategy and test refresh, expiry, recovery and same-browser restrictions. Do not invent OAuth providers or store secret keys in Angular.

## Acceptance and security tests

Use two businesses, multiple roles, a user in both businesses, a non-member and anonymous caller. Test direct REST and RPC access, not only UI guards.

Prove isolation for SELECT/INSERT/UPDATE/DELETE; denied cross-business foreign keys; denied membership self-escalation; denied business reassignment; role/location revocation; last-owner protection; private-file access; and audit immutability. Test that a publishable key without a user session cannot invoke authenticated operations.

Deliver migrations, auth screens, permission tests, invitation tests, configuration instructions and a repeatable two-business fixture. Do not send real invitations or provision production users during this phase.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

