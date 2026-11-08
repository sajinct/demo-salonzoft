# Phase 07 — Calendar and appointment workflow

**Dependencies:** 05, 06.

**Objective:** Build the reception calendar and appointment lifecycle over the tested scheduling engine.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 07. All master requirements and common deliverables apply.

Use the Phase 06 RPCs for every booking mutation; do not duplicate their authority in Angular.

## Screens and interactions

1. Implement staff-column day view, date navigation, Today, location/team filters and accessible appointment cards.
2. Add week view if included in the approved pilot scope. If deferred, hide its control and document the decision.
3. Show working hours, breaks, blocked time, time off and closed periods distinctly. Use business-local display times and a clear current-time marker.
4. Create the appointment drawer: existing client or walk-in, multiple services, staff selection, date/time, duration, notes, snapshot price, totals and validation.
5. Implement create, inspect, edit/reschedule, cancellation reason and status transitions: booked, confirmed, arrived, started, completed, canceled and no-show, constrained by the backend state machine.
6. Add a consistent read-only history/activity view and permission-aware actions.
7. If drag/reschedule is implemented, show the proposed change and use an atomic RPC with a keyboard-equivalent form. Roll back visual optimism on backend conflict.
8. Subscribe only to authorized scoped updates and refetch authoritative state. Tear down subscriptions on logout/business/location switches. Handle disconnection and stale data without silently overwriting another user's work.
9. Preserve unsaved local form work appropriately; leaving the drawer must not silently save or complete an appointment.
10. Track pending mutations and make retry behavior explicit. A double click must not bypass server idempotency.

## Acceptance and browser tests

- A receptionist books a client and a walk-in with the right staff, service and time.
- An owner changes a staff shift; availability updates accordingly.
- Two browser sessions try the same slot: one gets a clear conflict and can choose another slot.
- A stale edit never overwrites a newer change without a conflict path.
- Completing an appointment does not automatically fabricate a paid sale.
- Canceling or marking no-show follows the documented lifecycle and audit policy.
- Cross-business and unauthorized-location appointments never appear through filters or live updates.
- Phone, desktop, keyboard-only and RTL workflows are usable.
- Refreshing/deep-linking to an appointment works in the configured app host; synthetic demo routes remain isolated.

Deliver the working calendar, appointment forms/history, scoped live-update handling, scenario tests and a reception walkthrough. Do not proceed to collecting or recording payments in this phase.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

