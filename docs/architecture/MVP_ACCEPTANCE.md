# MVP acceptance and phase verification plan

**Date:** 3 November 2026  
**Current application status:** Not implemented. Checkboxes below are future acceptance targets unless explicitly in the Phase 00 evidence section.

## Phase 00 design acceptance

- [x] Repository and assets inventoried; no application scaffolding introduced.
- [x] Six architecture decisions define boundaries, tenancy, auth/routing, exact values, transactions/jobs and integrations.
- [x] Core ER diagrams and phased entity dictionary define staff-without-login and client/workspace membership separation.
- [x] Permission matrix covers owner, manager, receptionist, professional, finance viewer, customer, anonymous and platform operator.
- [x] API/provider-neutral contracts and workflow state machines define authority and failure outcomes.
- [x] Feature map covers all 17 review areas, all 12 detailed reference sections and all 59 listed reports.
- [x] Implementation log records Phase 00 evidence and later phases pending.
- [x] Missing infrastructure/business inputs have impact/timing, with no invented credentials or remote resources.
- [x] Operational MVP, customer pilot and production gates are separately bounded.

Verification details: [Phase 00 validation](PHASE00_VALIDATION.md). These checks certify document completeness/preservation, not application security or working functionality.

## Synthetic fixture plan

| Fixture | Required representation |
|---|---|
| Business A | synthetic salon, two locations A1/A2, OMR, Asia/Muscat |
| Business B | independent synthetic business/location B1, separate clients and balances |
| Identities | A owner, A1 manager, A2 receptionist, A1 professional, A1 finance viewer, B owner, user with different A/B roles, non-member, verified customer and independent operator |
| Staff | one staff profile with Auth access, one without login, one eligible in both A1/A2 |
| Catalogue | English/Arabic services, archived service, different durations/buffers and exact prices |
| CRM | fictional Arabic/English clients, shared-contact warning case, protected note, client not linked to all locations |
| Calendar | adjacent/overlap/cross-midnight bookings, breaks, closure, time off, cancelled/no-show history |
| Financial | draft, posted unpaid/partial/paid sale, illustrative tax, discount, tip, partial refund, register variance |
| External | sandbox/fake adapter accepted/rejected/unknown events and duplicate/out-of-order callbacks |

Use reserved example.test/example.invalid addresses or local mail sink addresses, never inspected account contacts. A second IANA zone with DST is a test fixture only, not a change to the Oman launch target.

## Per-phase independently demonstrable outcomes

| Phase | Outcome and evidence required before marking complete |
|---|---|
| 00 | This design baseline; structural/coverage/preservation checks |
| 01 | Clean install and runnable Angular shell; app/demo builds; non-root demo paths; CI prepared; local backend runtime status truthful |
| 02 | Real local Auth flow and tenant model; direct API/RLS/Storage isolation/last-owner/role-revocation tests |
| 03 | Branded responsive shell, runtime EN/AR, accessible components and context-cache teardown |
| 04 | Authorized location/staff/service setup with exact price input and historical-safe archival |
| 05 | Working CRM/forms/import preview and protected-record/duplicate/idempotent commit proof |
| 06 | Atomic booking RPCs with parallel same-slot/blocked-time/shift-change/cross-branch tests |
| 07 | Reception calendar lifecycle and failed-reschedule preservation in browser tests |
| 08 | Manual checkout, receipt, balanced ledger, bounded refund and register reconciliation |
| 09 | Dashboard/essential reports reconcile to fixtures; scoped exports and metrics; internal MVP walkthrough |
| 10 | Verified public/customer ownership, bounded availability, hold/waitlist claim races and booking limits |
| 11 | Durable background work, superseded reminder/consent/provider-unknown recovery and mail-sink/sandbox proof |
| 12 | Stock ledger/receiving/transfer/stocktake and last-item concurrent checkout |
| 13 | Wallet/benefit purchase/redemption/reversal and last-session overspend proof |
| 14 | Timesheets/commissions/pay-run correctness, protected pay data and duplicate-earning prevention |
| 15 | Segments/deals/consent-aware campaign/reward/referral/review vertical slices actually implemented |
| 16 | Selected provider sandbox and signed/idempotent reconciliation; separate backend platform entitlements |
| 17 | Each selected messaging/accounting/distribution/AI adapter independently tested/configuration labeled |
| 18 | Operator denial/support expiry, lifecycle, redacted logs and actual staging DB/file recovery drill |
| 19 | Clean release verification, scoped feature matrix and correct approved deployment target |

A phase may need subphases; record partial outcomes instead of marking a screen-only implementation complete.

## Internal operations MVP — Phases 01–09

All future checks currently unrun:

- [ ] M01 Owner creates/selects Business A; cannot join Business B by UUID/metadata.
- [ ] M02 Owner creates A1/A2; location-limited users cannot operate in another branch.
- [ ] M03 Staff without a login is schedulable but has no app authority.
- [ ] M04 English/Arabic service/category, price 0.001 OMR and supported upper bound round-trip exactly.
- [ ] M05 Archived catalogue/person records remain valid in history.
- [ ] M06 Receptionist creates client and walk-in bookings with multiple eligible services.
- [ ] M07 Two parallel writers for one staff interval yield one winner and no orphan reservations.
- [ ] M08 Adjacent [start,end) bookings succeed; overlapping buffer/blocked time fails.
- [ ] M09 Cross-branch staff overlap and concurrent shift-change races are rejected/serialized.
- [ ] M10 Failed reschedule preserves original slot; stale version cannot overwrite another edit.
- [ ] M11 Lifecycle transitions and audit are allowed only for the correct role; completed does not imply paid.
- [ ] M12 Two concurrent checkout submissions produce one posted sale, receipt and balanced journal.
- [ ] M13 Money examples in MONEY_AND_TIME pass; discount/tax allocations sum exactly.
- [ ] M14 Partial cash collection updates outstanding without duplicating revenue.
- [ ] M15 Refund cannot exceed remaining original eligibility; repeated retry does not refund twice.
- [ ] M16 Register float/petty cash/count/variance reconcile without inflating sales.
- [ ] M17 Dashboard totals match filtered details, receipts and manual payments net of valid reversals.
- [ ] M18 Direct report/CSV/PDF access cannot leak another business, location, salary or consultation content.
- [ ] M19 Logout/tenant switch clears caches, exports and subscriptions; in-flight stale results are suppressed.
- [ ] M20 Keyboard/mobile/Arabic RTL calendar, forms, tables, errors and receipts are usable.
- [ ] M21 Production/app mode has no synthetic fallback; Pages demo has no real login, PII or backend configuration.

Evidence must identify environment, migration version, command, fixture and actual result. Build-only success cannot satisfy transactional/security checks.

## Customer-booking pilot — add Phases 10–11

- [ ] C01 Only intentionally published services/staff/location fields appear anonymously.
- [ ] C02 Verified customer cannot view another client's past records through a shared email/phone.
- [ ] C03 Concurrent hold/offer claim confirms one appointment; expired claims fail.
- [ ] C04 Booking horizon, lead time, local dates and cancellation window apply at the backend.
- [ ] C05 Browser closure does not stop reminders; a rescheduled/cancelled booking does not receive the old reminder.
- [ ] C06 Delivery failures, duplicated callbacks, unknown outcomes and worker crashes recover honestly.
- [ ] C07 Guest/customer management tokens are scoped, expiring and not leaked into logs/analytics.
- [ ] C08 Actual host callback, exact origins, support/export and operational recovery gates pass.

This pilot uses manual payments unless Phase 16 is separately complete.

## Production gate checks (regardless of release size)

- [ ] P01 Declare supported features and deferred/credential-dependent scope; remove fake working controls.
- [ ] P02 Validate supported toolchain and clean migrations/types/tests, plus actual hosting artifact.
- [ ] P03 Direct tenant/role/location/customer/operator denial suite passes.
- [ ] P04 Restore staging DB and private files; prove policies, reservations and ledger reconciliation afterward.
- [ ] P05 Choose/validate data region, business tax/receipt/retention rules, RPO/RTO and incident ownership.
- [ ] P06 Approve a suitable commercial frontend host, backend targets, sender/merchant integrations if enabled.
- [ ] P07 Configure auth callbacks, secrets and webhook/job identities without frontend exposure.
- [ ] P08 Verify response/error/timeout handling and representative query performance with declared fixture sizes and environment.
- [ ] P09 Confirm applicable authorization before real deployment, remote mutation or live provider activation.
- [ ] P10 Publish release/runbooks with actual tests and explicit unrun checks.

No application, database, Auth, browser, provider, performance or restore test has been performed in Phase 00.

