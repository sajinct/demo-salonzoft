# Phase 08 — Checkout, payments ledger and registers

**Dependencies:** 07.

**Objective:** Implement auditable manual-payment checkout, refunds, receipts and cash-register operations.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 08. All master requirements and common deliverables apply.

This phase records manual payments. Real card/payment-provider collection belongs to Phase 16.

## Database and business rules

1. Add sales, sale lines, adjustments, posted tax snapshots, payment allocations, refunds/reversals, receipt sequences and register sessions/movements.
2. Define draft, posted, unpaid/partially paid/paid and reversed states without conflating them with appointment status.
3. Implement atomic RPCs for draft checkout, posting, manual payment recording, bounded refund, receipt allocation, register opening/cash adjustment/closing.
4. Snapshot services and exact prices. Authoritatively calculate discounts, tax-inclusive/exclusive totals, tips, payment allocation and outstanding balance.
5. Specify rounding and discount allocation with deterministic minor-unit remainder handling. No browser total is trusted.
6. Posted entries are immutable. Refunds and corrections reference their originals, cannot exceed remaining eligible amounts, and reverse relevant tax/payment allocations.
7. Prevent duplicate checkout of the same appointment under concurrent requests. Enforce scoped idempotency and request fingerprints.
8. Generate unique server-side receipt numbers per configured sequence/location. Do not promise gapless numbering without an explicit requirement/design.
9. Keep register opening float, petty-cash movements, expected closing balance, actual count and variance distinct from sales revenue.
10. Add hooks/contracts for later product stock, benefit redemption and commission effects. Integrate all required effects inside posting transactions as those modules arrive.

## Angular

Build new sale/from-appointment checkout, line adjustments with reason/permission, cash/other manual tender, tips, partial-payment display, receipts, sale detail/history, controlled refund and register screens.

Use immutable sale data for printable/PDF receipt views. Show a clear manual-recording label; recording an external card payment must never pretend a gateway charged it.

## Acceptance and tests

Test OMR 0.001 precision, zero totals, inclusive/exclusive tax, discounts across lines, refunds after partial payment, caps on repeated refunds, tips excluded from revenue, register variance and receipt uniqueness.

Prove a failing line/tax/payment operation leaves no partly posted sale; concurrent checkout cannot duplicate posting; retries cannot double-record cash; staff without finance permission cannot refund or close a register.

Demonstrate book → serve → checkout → receipt → refund/reconciliation locally. Provider buttons remain absent/unavailable until Phase 16, not mocked as successful.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

