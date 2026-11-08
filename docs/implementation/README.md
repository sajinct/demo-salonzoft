# Miznora implementation prompt pack

Prepared: **2 November 2026**. Stack: **Angular + Supabase**, source control and CI in **GitHub**, and **GitHub Pages for a fictional-data demonstration only**.

## Hosting decision to read first

GitHub Pages' published usage limits exclude sites primarily providing commercial SaaS and discourage sensitive transactions. A Supabase backend or a custom domain does not remove that restriction. This pack preserves the requested Angular/Supabase stack and supplies a Pages demo build, but requires a suitable production frontend host before real users, credentials, bookings or payments are introduced. No production host has been selected on the user's behalf.

Source: [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits).

## How to use these prompts

1. Give the coding agent [MASTER_PROMPT.md](MASTER_PROMPT.md) once.
2. Give it the next numbered phase file, beginning with Phase 00.
3. Ask it to implement **only that phase**, finish the relevant checks, and update the implementation log.
4. Review the phase's working screens, migrations, tests and known limitations before proceeding.
5. For a new chat, paste the master prompt and current phase prompt again; have the agent read the implementation log first.
6. Subphases may be necessary. A large phase must be split into working vertical slices rather than completed with placeholder screens.
7. These documents are implementation instructions. This task has not scaffolded the app, provisioned Supabase, created a repository or deployed anything.

Copy-ready instruction for each run:

> Read docs/implementation/MASTER_PROMPT.md, docs/implementation/IMPLEMENTATION_LOG.md if present, and the selected phase file. Implement only that phase in the existing Miznora repository. Follow its dependencies and acceptance criteria. Complete safe local work autonomously; identify exact missing infrastructure or credentials without inventing them. Update the implementation log and report the actual checks run, the deliverables, and anything still blocked.

Do not paste all twenty phases into a single request to implement everything at once.

## Phase map

| Phase | Prompt | Depends on | Milestone |
|---|---|---|---|
| 00 | [Architecture and scope](00-architecture-and-scope.md) | Existing briefs | Decisions and acceptance map |
| 01 | [Repository and delivery foundation](01-repository-and-delivery-foundation.md) | 00 | Runnable Angular app and fictional-data Pages demo build |
| 02 | [Authentication and tenant security](02-authentication-and-tenant-security.md) | 01 | Secure multi-business foundation |
| 03 | [App shell and localization](03-app-shell-and-localization.md) | 02 | Branded, responsive English/Arabic interface |
| 04 | [Business, staff and services](04-business-staff-and-services.md) | 03 | Operator configuration |
| 05 | [Clients, records and imports](05-clients-records-and-imports.md) | 04 | CRM foundation |
| 06 | [Availability and reservation engine](06-availability-and-reservation-engine.md) | 04, 05 | Concurrency-safe booking backend |
| 07 | [Calendar and appointment workflow](07-calendar-and-appointment-workflow.md) | 05, 06 | Reception workflow |
| 08 | [Checkout, payments ledger and registers](08-checkout-ledger-and-registers.md) | 07 | Manual-payment operational checkout |
| 09 | [Dashboard and essential reports](09-dashboard-and-essential-reports.md) | 08 | Internal operations MVP |
| 10 | [Public booking and waitlist](10-public-booking-and-waitlist.md) | 09 | Customer self-service |
| 11 | [Notifications and background jobs](11-notifications-and-background-jobs.md) | 10 | Customer-booking pilot, subject to release gates |
| 12 | [Inventory and suppliers](12-inventory-and-suppliers.md) | 08, 11 | Retail operations |
| 13 | [Wallets, packages and memberships](13-wallets-packages-and-memberships.md) | 12 | Stored value and benefit accounting |
| 14 | [Workforce and commissions](14-workforce-and-commissions.md) | 13 | Staff earnings and pay-run preparation |
| 15 | [Marketing, loyalty and reputation](15-marketing-loyalty-and-reputation.md) | 11, 13, 14 | Retention and promotions |
| 16 | [Provider payments and SaaS billing](16-provider-payments-and-saas-billing.md) | 15 | Real provider integration and business subscriptions |
| 17 | [Messaging and advanced integrations](17-messaging-and-advanced-integrations.md) | 16 | Shared inbox and selected extensions |
| 18 | [Platform administration and operations](18-platform-administration-and-operations.md) | 17 | Support, lifecycle and recovery |
| 19 | [Release verification and hosting](19-release-verification-and-hosting.md) | Required product phases | Demo publication or production release |

Phases 12–18 can be deferred for a smaller first release. A production pilot after Phase 11 still requires the applicable **Phase 18 operational controls** and **Phase 19 release checks**; it must use manual payments unless Phase 16 is complete. If only a subset is selected, record that scope and hide unimplemented features.

Phase ordering is a default delivery sequence, not a claim that every later feature is needed before an operator can try the core app.

## Artifacts expected during implementation

- `frontend/`: Angular application.
- `supabase/migrations/`, `supabase/functions/`, `supabase/tests/`, synthetic seeds.
- `.github/workflows/`: checks, demo build/publication and separately controlled backend release.
- `docs/architecture/`: decisions, domain model, API contracts, permission matrix.
- `docs/runbooks/`: setup, migration, deployment, recovery and provider operations.
- `docs/implementation/IMPLEMENTATION_LOG.md`: phase status and evidence, created by Phase 00.
- `docs/implementation/FEATURE_COVERAGE.md`: reference feature → phase → status mapping, created by Phase 00.

## Reference material

- [Fresha review](../Fresha_Feature_Analysis.md): observed features and explicit verification limits.
- [Miznora brand brief](../../Miznora_Brand_Overview.md).
- Existing `logo.svg`, `logo-transparent.svg` and `app-icon.svg` at the project root.
- [Technical source notes](TECHNICAL_SOURCES.md): official documentation checked while preparing this pack.

