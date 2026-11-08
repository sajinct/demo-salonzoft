# Phase 18 — Platform administration and operations

**Dependencies:** 17 for full scope; core operational subset required before any production pilot.

**Objective:** Build the operator controls, tenant lifecycle and recovery processes needed to run Miznora safely.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 18. All master requirements and common deliverables apply.

This phase is not permission to deploy or mutate production. Prepare and test the operational capabilities in local/staging environments.

## Platform control plane

1. Build a separately authorized platform-operator surface for business onboarding/status, entitlements, support, job failures and operational health.
2. Platform operator identity must come from a backend-controlled allowlist/role and verified strong authentication, not ordinary tenant ownership or editable profile fields.
3. Keep elevated keys in Edge/server runtime. The browser never receives a universal database secret.
4. Default support access to metadata/read-only. Any tenant-data access needs explicit scope, purpose, expiry and immutable audit. Do not add silent unaudited impersonation.
5. Implement business activation, suspension, archival and restore semantics. Define allowed exports/read access during suspension and preserve historical financial records.
6. Provide secure client/business data export and retention/redaction workflows, with background jobs, access checks and deliberate approval for destructive effects. Do not invent legal retention periods.

## Operations and recovery

7. Add structured redacted logs, correlation IDs, error tracking, queue/dead-letter metrics, provider webhook health, migration history and documented alert thresholds.
8. Define backup and recovery objectives. Verify what the chosen Supabase plan actually backs up; include Storage objects and external provider configuration in the recovery plan.
9. Perform a staging restore drill, proving record counts, tenant policies, private-file access, booking conflict constraints and ledger reconciliation after recovery.
10. Document secrets rotation, integration revocation, user/session revocation and incident containment.
11. Add controlled data migration/import tools with preview, source mapping, deduplication and reconciliation of opening balances. Do not import private Fresha records from screenshots.
12. Document database expansion/backfill/contraction migrations, compatibility between frontend/backend versions and forward-fix/rollback limits.
13. Add capacity/usage metrics and bounded request/job quotas; do not depend on an unlimited free tier or unbounded Edge execution.

## Acceptance

A tenant owner cannot invoke platform operator APIs. Suspension/revocation takes effect through direct API calls. Logs omit credentials and sensitive message/consultation content. Restore reproduces functional authorization and balanced ledgers.

Deliver an operator walkthrough, environment ownership map, incident/restore runbooks, RPO/RTO assumptions, actual staging-drill evidence and release-blocking gaps.

For a smaller Phase 11 pilot, implement this core subset before launch even if growth/integration features remain deferred.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

