# Decisions, assumptions and missing inputs

**Date:** 3 November 2026. All entries describe this task's local evidence or explicit proposed defaults.

## Adopted design baseline

| ID | Decision | Rationale / where to revisit |
|---|---|---|
| D01 | Angular SPA + Supabase modular monolith | selected stack; frontend and transactional DB boundaries, ADR 001 |
| D02 | One business is one tenant; locations subordinate | portable multi-business scope; ADR 002 |
| D03 | Workspace membership, staff profile, client identity and purchased membership are distinct | prevents accidental privilege/data coupling |
| D04 | Strict typed adapters; SQL RPC for invariant-changing commands | avoids partially completed booking/financial writes |
| D05 | Pages synthetic demo and real-app target are separate | hosting/auth boundary; ADR 003 |
| D06 | OMR bigint minor units, decimal-string API | precision and historical truth; ADR 004 |
| D07 | IANA location zones and local-day reports | timezone-safe operations; money/time contract |
| D08 | Shared busy-unit reservations with atomic state transitions | blocks booking/blocked-time/cross-branch staff races |
| D09 | Outbox + leased durable backend jobs | provider retry/reconciliation; no browser-dependent timers |
| D10 | Manual payments first, real provider integration later | operational MVP independent of undecided merchant provider |
| D11 | Backend-controlled pilot entitlements | no dependency on invented billing provider or customer metadata |
| D12 | Supported toolchain pinned in Phase 01 | do not certify observed Node v20.10.0 or outdated prompt version assumptions |

## Reversible working assumptions

| ID | Assumption | Impact / validation owner |
|---|---|---|
| A01 | First pilot is a staffed single-location salon | narrower MVP walkthrough; user/operator can select another segment |
| A02 | Data model and fixtures include multiple locations/businesses from start | protects future expansion and security tests |
| A03 | English/Arabic, OMR, Asia/Muscat | based on requested market; validate actual translations and pilot preferences |
| A04 | Suggested Saturday week start and 15-minute slots, configurable | product default, not a required rule |
| A05 | Manager/reception/professional/finance defaults follow PERMISSIONS | owner can request explicit narrow changes later |
| A06 | Staff occupies continuous service + buffer in MVP | processing-time release and overbooking deferred |
| A07 | No FX or cross-business wallet use | single-currency business with currency retained in facts |
| A08 | Basic manual tender, not integrated card collection | explicit label; no pretend gateway success |
| A09 | Basic forms/import preview fit CRM phase | signing/medical workflow/large async processing deferred until specified |
| A10 | Demo is a noncollecting fictional-data prototype | no login/password/payment/customer submissions to real systems |
| A11 | Retain agreed quote on reschedule unless explicit reprice | confirm with pilot before Phase 06/08 completion |
| A12 | All reports initially use declared local-day/metric definitions | define comparisons/freshness in Phase 09 |

These are design defaults, not claims that the user has approved a vendor, paid resource or legally compliant policy.

## Exact unresolved infrastructure and credentials

| Gate | Missing input / observation | First affected work | Blocks Phase 00? |
|---|---|---|---|
| G01 | No .git or GitHub remote in workspace; owner/repo/branch unspecified | source/CI publication in 01/19; local scaffold can proceed independently | No |
| G02 | Resolved locally in Phase 01: Node 24.22.1 / npm 12.2.1 pinned; bundled runtime used without changing system Node | clean lockfile install and Angular checks verified; see Phase 01 validation | No |
| G03 | Phase 02 retains CLI 3.0.0; Docker/Podman unavailable and 127.0.0.1:54322 refuses connection. Embedded PostgreSQL SQL tests pass separately; no Supabase engine started | actual Supabase reset/CLI types/Auth/REST/Storage acceptance remains blocked until a compatible runtime is installed and started | No |
| G04 | Supabase project reference, URL, publishable key, region and hosted project ownership not supplied | remote Auth/staging integration in 02; local design/scaffold independent | No |
| G05 | Backend/CI deployment credentials and approved remote project targets absent | remote migrations/functions/secrets setup only | No |
| G06 | Production/staging frontend host, app origins, domain and callback URLs undecided | hosted real Auth in 02 and production release in 19 | No |
| G07 | Merchant provider/account, OMR support, webhook and settlement credentials not chosen | real card/recurring billing in 16; manual MVP unaffected | No |
| G08 | Sender provider, verified sender/domain, channel eligibility and sandbox/live credentials absent | real notification delivery in 11; local mail sink independent | No |
| G09 | Accounting/social/analytics/AI APIs, credentials and partner eligibility undecided | individual integrations in 17; not assumed available | No |
| G10 | Supabase plan, backup/Storage recovery capabilities and operational budget undecided | production backup/restore/SLO gates in 18/19 | No |

Absence on PATH is not proof a tool is absent everywhere. No remote account inventory or credential search was performed, and no secret value is needed in these documents.

## Business decisions before the relevant implementation/release

| ID | Decision needed | Timing |
|---|---|---|
| B01 | Pilot salon/operators, staff count, location scope and import sources | before final MVP UX acceptance |
| B02 | Price/tax mode, rate, line/invoice rounding and legally required receipt content | before production financial use |
| B03 | Booking/cancellation/no-show cutoffs and fee/refund policies | before external booking/payment rollout |
| B04 | Commission, timesheet, tips, bonus/fee and payroll approval rules | before 14 |
| B05 | Packages/member validity, renewal, refunds, gift-card liability/expiry policy | before 13/16 activation |
| B06 | Clinical forms, access, retention/redaction and customer identity-claim policy | before real sensitive records |
| B07 | Data region, privacy terms, retention, incident ownership, RPO/RTO | before production release |
| B08 | Miznora prices, trial/grace/limits, subscription model and support service | before paid platform launch |
| B09 | Brand/domain ownership and final native-Arabic copy validation | before public brand launch |
| B10 | Which optional growth/AI/website/marketplace integrations are required | before corresponding 15–17 slices |

Do not invent statutory rates, merchant availability or retention requirements to fill a decision. Validate current requirements with appropriate sources/owners at the phase where needed.

## Required release gates

- **R01:** actual selected feature scope, truthful UI and no fake production success.
- **R02:** tenant/role/location/customer/operator denial tests through direct APIs.
- **R03:** concurrency, money, reversal and idempotency proof for implemented modules.
- **R04:** approved host/URL/region/environment configuration with staging parity.
- **R05:** real Auth callback and private Storage/export/Realtime checks.
- **R06:** notification/payment sandbox proof and reconciliations if those channels are enabled.
- **R07:** operational subset of Phase 18, including recovery drill and redacted observability.
- **R08:** Phase 19 clean build/migrations/RTL/mobile/accessibility/scope verification.
- **R09:** applicable user authorization for actual publication, remote migrations, provider connection and live charges/messages.

All Phase 00 work can complete without these later decisions. Next work may prepare safe local artifacts while naming the precise affected gate; never request credentials before they are needed.

