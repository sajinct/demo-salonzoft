# Phase 09 — Dashboard and essential reports

**Dependencies:** 08.

**Objective:** Complete the internal operations MVP with trustworthy metrics, essential reports and exports.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 09. All master requirements and common deliverables apply.

Build reports from the implemented transactional models, not hardcoded dashboard values.

## Work

1. Define a versioned metric dictionary for booked appointment value, recognized sales, cash collected, outstanding balances, refunds, tips, taxes, stored-value liabilities and occupancy.
2. Implement dashboard cards/charts for recent sales, appointments, upcoming bookings, today's queue, top services, top staff and activity.
3. Provide essential reports: daily sales, sales list/summary, payments by method, appointments list/status/cancellations/no-shows, staff/service performance and register reconciliation.
4. Use database views/RPCs that preserve tenant, location and role protections; explicitly review execution semantics for views and aggregate functions.
5. Add date range, location, staff/service and status filtering with server pagination for detailed rows. Business-day boundaries use location time zones.
6. Build real CSV exports and small printable/PDF reports from the same authorized queries. Document dataset limits and defer large async exports until background jobs exist.
7. Neutralize spreadsheet formulas, preserve Arabic text/encoding and prevent hidden PII fields from entering exports.
8. Include data freshness/as-of labels where aggregation is delayed. Ensure drill-down totals reconcile with the summary.
9. Add overview/profile read models for implemented client and staff histories.
10. Map the remaining Fresha report names to actual later phases or deferred work in FEATURE_COVERAGE. Do not create 59 empty report cards to imply parity.

## Acceptance and tests

- A seeded day with bookings, posted sales, partial payments, tips and refunds produces mathematically reconciled dashboard/report totals.
- Booked value is not counted as collected revenue; unposted drafts do not increase sales.
- Filters and exports respect role/location access, including direct report RPC calls.
- Date-boundary and DST fixtures produce the documented local-day totals.
- A user cannot obtain another business's totals by changing query parameters.
- English/Arabic tables, charts, exports and print layouts remain usable.
- The internal MVP walkthrough succeeds from business setup to booking, manual checkout, receipt and daily reconciliation.

Deliver a pilot walkthrough, exact tested feature scope and remaining gaps. Internal MVP completion is not a production-launch claim: apply the operational and hosting/release gates before using real customer data.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

