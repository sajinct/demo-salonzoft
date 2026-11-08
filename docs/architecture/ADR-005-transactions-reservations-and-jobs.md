# ADR 005 — Transactions, reservations and durable effects

**Date:** 3 November 2026  
**Status:** Adopted design; exact SQL/extension compatibility verified in Phase 06.

## Booking integrity

All staff busy time and room/equipment use share a reservation layer. A staff unit is unique within a business across locations, preventing overlapping bookings in two branches. Initial room/equipment capacity is represented by distinct units, not a client-supplied capacity counter.

Reservations use half-open ranges `[start,end)`. The intended database guarantee is a GiST exclusion on business, unit and overlapping range for rows that block time. Confirm the required extension/operator support in the selected Supabase database.

Every calendar writer—booking, blocked time, shift/time-off/closure edit and reschedule—takes the same deterministic business/unit locks before validating and mutating. Grant no direct mutation path that can bypass these guards. A reschedule replaces reservations atomically; failure keeps the old arrangement.

Availability searches are advisory. Only a successful database command confirms a booking. Lock eligible units when resolving any-staff requests; revalidate eligibility and timing inside the command.

## Idempotency and stale edits

Commands have a unique operation-scoped idempotency key and canonical request fingerprint. Concurrent identical retries return one persisted result; key reuse with different input fails. Domain effect uniqueness remains enforced beyond the operational idempotency-record retention period.

Mutations to editable aggregates include expected_version. Stale versions return a conflict; do not overwrite a newer change. Lock resources/stock/wallet accounts in documented sorted order to reduce deadlocks, and return retryable errors only when safe.

## Financial transactions

Sale posting writes immutable snapshots, balanced journal effects, receipt allocation and required stock/benefit/commission movements in one transaction as each module becomes available. Failed effects roll back the whole command. Provider HTTP calls never occur while holding a financial database transaction open.

## External effects

Persist domain events/outbox messages inside the same database transaction as the business change. Bounded workers lease durable work, call providers outside the transaction, and record outcomes idempotently. Cron wakes workers/expiry processing; it does not rely on an open browser.

Provider delivery is at-least-once/ambiguous unless the provider supports stronger deduplication. A timeout can mean an operation succeeded remotely. Reconcile unknown outcomes before unsafe retries. No blanket exactly-once external-side-effect promise.

Booking holds use explicit active state and expires_at; atomic commands and workers release expired holds. Do not use a time-dependent database index predicate to make expired reservations disappear.

## Required failure proofs

- Concurrent same-slot writes: one winner.
- Shared staff in separate branches: overlap rejected.
- Blocked-time/shift edit races: serialized with booking validation.
- Multi-line reservation failure: no partial appointment.
- Double checkout/refund/redemption: one valid effect.
- Worker crash and duplicate/out-of-order webhook: recoverable without duplicate posting.
- Suspended business: user mutations denied; verified financial reconciliation can still complete through its narrowly authorized system path.

Detailed state transitions and invariants: [Workflows](WORKFLOWS_AND_INVARIANTS.md).

