# Phase 10 — Public booking and waitlist

**Dependencies:** 09.

**Objective:** Add a controlled public booking surface and customer self-service without exposing private salon data.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 10. All master requirements and common deliverables apply.

Run this functionality locally or on an approved app host. The Pages target remains a fictional-data demonstration with no real customer collection.

## Backend and trust boundaries

1. Add published business/location/service/staff projections with a strict field allowlist and explicit publication state. Never expose CRM tables or raw calendar events anonymously.
2. Implement bounded public availability endpoints, backend input validation, request quotas, rate limiting and an anti-abuse challenge where needed. CORS or an unguessable UUID is not authentication.
3. Public booking uses the same authoritative reservation/price engine as internal booking. A browser cannot select unpublished services or bypass lead times, closures, capacity or prices.
4. Separate temporary booking requests/holds from confirmed appointments. If using holds, implement TTL, atomic claim/release and idempotent expiry; do not use time-dependent index predicates such as now() to pretend expired reservations vanish automatically.
5. Require verified contact/customer identity before sensitive self-service. Test verification with a local mail sink or sandbox; do not silently skip it in production if delivery is not configured.
6. Link an authenticated customer to a business's client record through an explicit verified flow; matching a supplied email/phone is insufficient.
7. Create rate-limited customer appointment lookup/reschedule/cancel endpoints. Use authenticated ownership or narrowly scoped, hashed, expiring management tokens. Prevent token leakage through logs/referrers and validate permitted lifecycle transitions.
8. Add waitlist entries with requested services, staff flexibility, date/time windows, expiry and contact consent. Offers must have a documented ordering/expiry policy and atomically claim a real slot.
9. Keep anonymous/public endpoint privileges narrower than internal user RPCs. An Edge Function using an elevated client must independently validate business publication, status and allowed operation.

## Frontend

Build a public business page, service selection, eligible staff or any-staff choice, local-date slots, client details/verification, confirmation and customer manage-booking screens. Add a customer wallet/benefit area only when its backend exists. Include a book-again flow and waitlist request/status screens.

## Acceptance

Two customers cannot confirm the same slot; an expired offer cannot be redeemed; duplicate submit creates one booking. Public responses reveal neither another client's identity nor staff private contact data. Guessing a client/appointment UUID does not grant access. Customer and staff login contexts cannot be confused.

Test Arabic/RTL, mobile booking, abandoned/expired holds, price changes during selection, cancellation cutoff and unavailable message delivery. Document self-service limitations until Phase 11 delivery is ready.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

