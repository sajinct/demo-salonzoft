# Phase 16 — Provider payments and SaaS billing

**Dependencies:** 15; may be advanced earlier after 11 if integrated payments are required for the pilot.

**Objective:** Integrate approved payment providers and separate salon customer payments from Miznora subscription billing.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 16. All master requirements and common deliverables apply.

First read current provider documentation and verify Oman merchant eligibility, supported OMR precision, settlement model, refunds, webhook security and required credentials. Do not assume Stripe, a marketplace/split-settlement model or any bank is available.

If no provider is selected, implement provider-neutral contracts and sandbox tests, clearly disable live actions, and finish unaffected work. Do not simulate production payment success.

## Customer payments

1. Use provider-hosted/tokenized payment collection. No raw card data or secret keys in Angular, logs or the database.
2. Create payment intents/orders server-side from authoritative sale amounts and currency; enforce role/customer ownership, idempotency and allowed callbacks.
3. Model pending, authorized, captured, failed, cancelled, refunded and disputed states as applicable to the real provider.
4. Verify webhook signatures using the required raw payload, timestamp/replay controls and durable unique event IDs.
5. Apply state transitions and payment/ledger allocations atomically. Duplicate or out-of-order events cannot double-pay, over-refund or reopen a completed operation.
6. Browser return URLs show pending until the backend confirms status; a successful redirect is not proof of payment.
7. Implement refund requests, deposit/prepayment application and cancellation/no-show collection only if provider capabilities and business policies support them.
8. Add reconciliation jobs for ambiguous timeouts, missing webhooks and settlement differences. Preserve traceable provider references.
9. Enable recurring client memberships only after tested provider integration, with renewal, failed-payment and cancellation policies.

## Miznora business subscriptions

Create separate platform plans, business subscriptions, entitlements, usage limits and billing events. Keep their ledger/provider customer IDs separate from salon customers and client_memberships.

Enforce feature access and limits on the backend. Define trial expiry, grace, payment failure, downgrade and cancellation without destroying customer records or silently cancelling existing salon appointments. Plan changes and billing events are idempotent/audited.

## Acceptance

Use sandbox payment success/failure, 3DS/redirect where relevant, duplicate and out-of-order webhook events, timeout reconciliation, partial refund and renewal failure.

Assert cross-business payment/refund denial, exact OMR amounts, secret-free frontend artifacts and no over-collection under retries. Test subscription entitlements through direct API calls, not only hidden buttons.

Prepare integration/runbook and webhook deployment instructions. Do not connect a live merchant, charge a real card or activate paid subscriptions in order to prove the code works.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

