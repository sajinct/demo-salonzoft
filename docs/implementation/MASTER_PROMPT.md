# Master implementation prompt — Miznora

Use this instruction with one numbered phase prompt at a time.

## Product objective

Build Miznora, a salon and spa management SaaS for Oman with a path to other GCC markets. Use the existing brand brief, SVG assets and Fresha feature analysis as references. Build an original Miznora interface. Capabilities beyond the inspected Fresha workflows are proposed requirements, not claims of verified Fresha behavior.

Deliver a functioning product through small, reviewable phases. Do not replace backend functionality with static screens or mark partially implemented features complete.

## Stack and deployment boundary

- Frontend: a currently supported stable Angular release, strict TypeScript, standalone components, lazy routes, reactive forms, signals for local/derived state and RxJS where it is useful. Pin a compatible Node/TypeScript/RxJS toolchain and lockfile at implementation time.
- UI: Angular Material/CDK with a deliberate Miznora theme, or the equivalent existing project standard if one is already established. Avoid adding multiple competing component frameworks.
- Backend: Supabase Postgres, Auth, Storage and selectively Realtime; Postgres functions/RPCs for transactional domain operations; Edge Functions for trusted integrations, jobs and provider webhooks.
- CI and source control: GitHub. Do not invent a repository owner, branch, Supabase project, secret or domain.
- Hosting: GitHub Pages can publish a separate fictional-data demo. The real commercial app must use a host whose current terms and capabilities support it. Do not disguise the commercial app as a Pages demo.
- No Angular SSR server, Node backend, webhook handler, payment secret or scheduled worker runs on GitHub Pages.
- Demo mode uses isolated synthetic data and an in-memory adapter, no real authentication and no production Supabase connection. Production mode must fail clearly when its required configuration is absent; it must never silently fall back to demo data.

## Read before changing anything

Read repository instructions, the phase prompt, `docs/implementation/IMPLEMENTATION_LOG.md` and `FEATURE_COVERAGE.md` if present. Inspect the existing implementation before scaffolding or replacing files. Preserve the user's assets and work.

For Phase 00 create the planning documents. For other phases implement the selected scope, not another broad plan. Do not begin later phases automatically.

## Architecture rules

1. Use a modular monolith in Postgres and a feature-organized Angular app. Feature folders should own pages, components, facades/state and data adapters. Keep the Supabase client, session context, money, time and localization utilities centralized.
2. UI components do not directly orchestrate multi-table business mutations. Simple authorized CRUD may use Supabase through a data adapter; bookings, checkout, refunds, redemptions and other invariants require one database transaction.
3. An Edge Function making several REST calls is not an atomic database transaction. Put the transaction in one database function and call it.
4. Maintain typed request/response contracts and generated database types. Validate untrusted input at the trusted backend boundary. Do not use `any` to silence model mismatches.
5. Use migrations for schema, policies, grants, functions, triggers and supported extensions. Changes must reproduce on a clean local database. Never edit an already applied shared migration; append a new one.
6. Use synthetic seed data for at least two businesses, multiple roles, multiple locations, Arabic/English names and representative workflow states. Never copy the inspected Fresha account's records.
7. Keep deployment configuration separate from domain logic. Store source assets in version control and user uploads in Storage with explicit access rules.

## Tenant security and authorization

- Each tenant-owned record carries `business_id`; include location scope when relevant. Global identity/catalogue data must be intentionally classified.
- Scope reads/writes with database grants and RLS from the beginning. Both `USING` and `WITH CHECK` behavior matter. Frontend filters and route guards improve UX but are not security boundaries.
- Verify membership, role, location access and business status for each privileged operation. Caller-supplied business IDs select context; they do not prove authorization.
- Do not derive authority from editable user metadata, arbitrary JWT payloads or local storage. Use controlled membership/permission data, with a documented strategy for revocation.
- Separate a staff scheduling profile from an Auth login. A staff member can exist without app access.
- Use composite foreign keys/unique keys or equivalent constraints so child rows cannot link to another business's records. Users must not be able to mutate ownership columns or grant themselves membership.
- Keep salary, medical/consultation notes, credentials and other sensitive fields in separately protected tables/projections where row-level rules alone would expose too much.
- The browser gets only the Supabase URL and publishable key. Secret/elevated keys, provider credentials and deployment tokens stay in trusted runtime/CI secrets.
- Read-only reports, views, Storage policies and Realtime subscriptions must obey the same tenant/role boundaries. Public projections must contain only intentionally public fields.
- Prefer security-invoker functions. If security-definer is required, fix the search path, qualify objects, restrict execution grants, and perform explicit authorization. Test direct RPC invocation.
- Audit important changes with server-generated actor, business, event, time and object identifiers. Do not trust a client-supplied actor ID or allow users to rewrite audit entries.

## Money, time and business invariants

- Default currency is OMR, with three minor-unit decimals: **1 OMR = 1,000 baisa**. Store posted amounts as integer minor units, never binary floating-point major amounts.
- Define transport and bounds explicitly. Prefer Postgres bigint with decimal-string RPC serialization and a centralized frontend BigInt/decimal implementation. Never silently lose precision through JSON numbers or implicit Supabase int8 conversion.
- Parse user-entered amounts from validated decimal strings. Keep quantities/rates in explicitly defined exact formats. Perform authoritative rounding, discount allocation, inclusive/exclusive tax, refunds and totals on the backend.
- Keep price/duration/tax/rule snapshots on historical records. Posted sales, ledger entries and benefit redemptions are immutable; correct them through controlled reversals.
- Distinguish appointments, recognized sales, payments collected, outstanding balances, tips, taxes and stored-value liabilities.
- Persist appointment instants as timestamptz and business/location IANA zones, default `Asia/Muscat`. Store birthdays as dates and recurring working hours as local-time rules.
- Translate date boundaries using the chosen location time zone. Do not use the browser's zone or UTC midnight as a business-day substitute.
- Use half-open reservation intervals and database-enforced conflict protection. Retry/idempotency keys, optimistic versions, locking order and transaction failures must be designed, not left to button disabling.
- Never trust a browser-submitted total, commission, wallet balance, provider status or entitlement.

## Frontend quality and localization

Use emerald, champagne gold, ivory and charcoal from the brand direction; maintain readable contrast and avoid ornate operational screens. Reuse the existing SVG logo and app icon.

Every implemented screen needs loading, empty, error, success and permission-denied states; accessible labels, keyboard interaction, responsive layout and translated English/Arabic strings. Test RTL in calendars, tables, dialogs, amount fields and receipts, not just the sidebar. Keep phone numbers, codes and amounts readable in mixed-direction content.

Never show an enabled action that only displays a success toast without persisting the promised operation. Feature flags and entitlement decisions must also be enforced on the backend.

## Auth, browser routing and providers

- Separate app authentication from customer record ownership and from provider credentials.
- Configure exact allowed auth redirects for local/staging/production. Reject untrusted return URLs.
- For the real app, use a tested static-host-compatible callback route with SPA fallback configured on the approved host. Use one deliberate Supabase auth-code/session handling strategy, not duplicate automatic and manual exchanges.
- GitHub Pages demo uses Angular hash routing and a correct project base path; it does not process real auth callbacks.
- Protect user-invoked Edge Functions with supported JWT verification and database authorization. A publishable key alone does not identify a user.
- Provider webhook endpoints use verified signatures/replay protection and durable event idempotency, not browser redirects or unsigned JSON.
- Choose payment/messaging providers only after current Oman availability, business requirements and credentials are known. Implement interfaces and test doubles locally; production actions must clearly remain unavailable until configured.
- Use durable backend queues/outbox processing and scheduled jobs. Never rely on an open browser tab or a long-running Edge Function for reminders, subscription renewal or stock reconciliation.

## Verification and completion

Run checks appropriate to the phase: Angular lint/type/build, business-rule unit tests, database migrations and RLS tests, Edge Function tests, selected browser tests and visual/RTL checks.

Required evolving fixtures include two tenants, owner/manager/receptionist/staff roles, a non-member and an anonymous caller. Assert denied reads, denied writes and data leakage through relationships/RPCs/reports/Storage; do not test only valid happy paths.

Do not write redundant tests for decorative changes, but do test tenant authorization, concurrency, money arithmetic, payment idempotency and historical integrity. An unrun check is not a passing check.

At the end of each phase:
1. Update implementation log: scope, status, migrations, screens, commands/results, known gaps and next dependencies.
2. Update feature coverage with real implementation status.
3. Describe the working behavior and how to verify it, including demo versus Supabase-backed behavior.
4. Identify missing credentials or remote infrastructure precisely; continue unaffected local work.
5. Report external mutations/deployments separately. Preparing a workflow does not mean it was deployed.

Never run production resets, overwrite remote data, publish services, create paid subscriptions or connect external accounts merely because a phase prompt describes them. These prompts authorize implementation preparation and local tests; actual external actions need the user's applicable authorization.

## Common per-phase deliverables

- Working Angular UI and relevant backend migrations/functions, or the planning artifacts explicitly required by Phase 00.
- RPC/API contracts and generated types when schema changes.
- Tenant/role protection and targeted tests.
- Synthetic fixtures and repeatable manual verification steps.
- Documentation and implementation-log updates.
- No concealed unfinished work, fake production adapters or leaked secrets.

