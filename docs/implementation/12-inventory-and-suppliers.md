# Phase 12 — Inventory and suppliers

**Dependencies:** 08, 11.

**Objective:** Add product retail, stock ledgers, stocktakes and supplier ordering with atomic checkout integration.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 12. All master requirements and common deliverables apply.

Extend checkout with real stock accounting, not a mutable quantity field alone.

## Database and services

1. Add products/variants, brands/categories, barcodes/SKUs, location stock accounts, suppliers, purchase orders, order lines, receipts, stocktakes and immutable stock movements.
2. Support stock opening balances, purchase receipts, sales, customer returns, transfers and controlled adjustments with reasons. Define whether negative stock is ever allowed; default to preventing overselling.
3. Add exact cost/price/currency handling and tax snapshots. Define a costing method only if valuation reporting is in approved scope; do not label unimplemented valuation as accurate.
4. Integrate product sale reservation/deduction into the checkout transaction. A failed stock check must roll back sale posting and manual payment entries.
5. Lock stock rows in deterministic order and enforce idempotent sale/refund/receiving effects.
6. Process purchase receiving against remaining quantities. Repeated delivery submissions cannot double-receive stock.
7. Stock transfers must debit and credit authorized locations atomically. No transfer to a different business's stock account.
8. Implement low-stock rules/notifications through the background system, with deduplication.
9. Stocktakes support draft/pause/resume/count/review/post states. Define a cutoff/movement reconciliation strategy so sales during counting do not corrupt adjustment totals.
10. Customer refund and physical return are separate decisions. Do not automatically restock damaged/unreturned items.

## Angular

Build product directory/details, import preview, stock by location, movement history, supplier directory, purchase-order editor/receiving, transfer/adjustment forms and stocktake screens. Barcode input may support keyboard-wedge scanners; document hardware verification separately.

Add products to POS only after backend integration passes. Archived products remain in historical sales.

## Acceptance

Parallel checkouts for the last item produce one valid deduction and no negative balance. Failed payment/posting/stock operations leave consistent records. Duplicate receiving/refund callbacks do not create extra stock. Cross-location transfer permissions are enforced directly in the database.

Test a stocktake spanning a sale, partial receiving, returns with/without restock, cancelled orders, product archival and Arabic product imports.

Deliver working stock-on-hand/movement/ordered-stock reports, exact reconciliation fixtures, transactional integration tests and an inventory operations runbook.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

