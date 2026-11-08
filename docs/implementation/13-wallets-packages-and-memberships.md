# Phase 13 — Wallets, packages and memberships

**Dependencies:** 12.

**Objective:** Implement customer stored value and prepaid benefits with auditable balances and redemptions.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 13. All master requirements and common deliverables apply.

Keep customer benefit plans separate from workspace access and Miznora business subscriptions.

## Model and operations

1. Add gift cards, wallet accounts/entries, prepayments, package definitions/versions, sold packages, client membership definitions/instances, benefit entitlements and redemptions.
2. Store balances and benefit usage as append-only ledger entries, with backend-computed balance projections and explicit reversal references.
3. Define service/product eligibility, location applicability, currency, validity, limits and expiry. Snapshot the sold plan version so later edits do not change purchased benefits.
4. Gift-card codes are sensitive bearer credentials. Use high-entropy issuance, hashed lookup, rate-limited redemption, controlled reveal and redacted logs. Do not expose a public directory of codes/balances.
5. Implement atomic purchase/issuance, eligible checkout redemption, partial wallet payment and controlled reversal/refund. Lock accounts/benefits consistently.
6. Prevent negative balances, benefit overconsumption, duplicate redemptions and cross-business/currency spending. Issuance and redemption follow explicit owner/manager permissions.
7. Distinguish cash collected, gift-card liability, package deferred value and recognized benefit consumption in accounting/reporting.
8. Define expiry and cancellation behavior as configurable product policies, without claiming statutory compliance.
9. Membership recurring collection is not enabled until the provider phase. Manual prepaid periods may work now; missing provider integration must not appear as an active automatic renewal.
10. Scope customer self-service to verified client identity. Household transfers or shared benefits require an explicit policy, not email-based implicit sharing.

## Angular

Build plan catalogue/editing, sell/issue flows, customer wallet and benefit details, redemption selection during checkout, usage history and owner adjustment/reversal screens.

Display exact expiry, remaining sessions/value, price and terms in English/Arabic. Hide unavailable automatic-renewal controls.

## Acceptance and tests

Two parallel redemptions cannot overspend the final balance/session. An identical retry returns the existing result. Refund/reversal cannot be repeated past the original entitlement. Archived/edited definitions preserve prior purchases.

Reconcile sale, payment, liability and consumption reports for a package purchase, partial redemption, return and expiry. Verify no direct client mutation of balance totals or benefit ledgers is allowed.

Deliver gift-card/package/membership lists and consumption summaries, updated transactional checkout and documented renewal/refund boundaries.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

