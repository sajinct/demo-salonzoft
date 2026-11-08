# Phase 06 — Availability and reservation engine

**Dependencies:** 04, 05.

**Objective:** Implement the authoritative, concurrency-safe scheduling backend before building calendar interactions.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 06. All master requirements and common deliverables apply.

Prioritize correct database behavior over UI completeness.

## Model and operations

1. Add shifts, breaks, time off, blocked-time types/entries, appointments, appointment service lines, status history and a common reservation model.
2. Represent staff and room/equipment resource units with comparable reservation identities. Use half-open timestamptz ranges and exclusion constraints or a rigorously tested equivalent supported by the actual Postgres deployment.
3. All busy reservations, including blocked time, must participate in conflict prevention. Separate tables with independent overlap checks are not sufficient.
4. Implement atomic RPCs for available slots, booking creation, rescheduling, status transition and cancellation. Validate current tenant/role/location, service/staff eligibility, business state and booking policies.
5. Recompute authoritative price/duration/tax snapshots and all required service/resource intervals. Ignore browser-supplied totals.
6. Lock shared resources in deterministic order. Changes to shifts, closures and time off must coordinate with booking writes so two transactions cannot simultaneously create an out-of-hours booking.
7. Rescheduling must reserve the new arrangement and release old intervals atomically. Failed moves preserve the original booking.
8. Use idempotency keys scoped by business/actor/operation, with request fingerprints. An identical retry returns the same result; reusing a key with different input is rejected.
9. Use optimistic versions to prevent stale edits and record all status transitions server-side.
10. Define cancellation/no-show rules, reservation release behavior, booking lead time/horizon, buffers and allowed increments. Initial policy keeps staff occupied for the full service plus buffer; advanced processing-time release is explicitly deferred unless implemented and tested.
11. Provide bounded internal slot queries. Public slot access and anti-abuse controls arrive in Phase 10.
12. Emit durable domain/outbox events within the same transaction, even before external message delivery exists.

## Acceptance and tests

- Two parallel requests for the same staff/resource interval yield one success, one conflict.
- Adjacent half-open bookings succeed; overlapping buffers fail.
- Multi-service/multi-staff reservation failure rolls back the entire appointment.
- Blocked time and bookings cannot race past one another.
- Parallel schedule edits cannot invalidate a just-created booking silently.
- Failed reschedule retains the original time; stale versions fail with a meaningful conflict.
- Duplicate requests do not create duplicate appointments or outbox events.
- Test Muscat, another zone with daylight-saving transitions, cross-midnight intervals, closed days, time off and business-day boundaries.
- Anonymous/non-member users cannot invoke internal mutation functions.

Deliver migrations, RPC contracts, database/concurrency tests, fixtures and a small development inspector for slots. Do not implement frontend-only conflict prevention or simulate successful writes.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

