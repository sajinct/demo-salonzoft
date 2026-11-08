# Money, time and historical-data contract

**Status:** Proposed normative implementation rules, 3 November 2026. Examples use illustrative tax rates, not a legal tax determination.

## Monetary representation

| Concept | Stored / transported representation |
|---|---|
| Posted money | Postgres bigint integer minor units plus currency |
| OMR quantum | 0.001 OMR = 1 baisa; 1 OMR = 1000 baisa |
| RPC money DTO | base-10 integer string, e.g. "12345" means OMR 12.345 |
| Frontend domain money | currency plus BigInt minor; never JSON-serialize raw BigInt |
| Quantity | exact decimal string; database numeric(18,3) initially, positive, bounded per operation |
| Tax/rate fraction | integer parts per million, rate_ppm; 50000 means 5% |
| Duration | positive integer minutes for catalogue; explicit instants for actual reservations |
| Currency metadata | controlled ISO code/scale; business currency fixed for posted history |

Application absolute monetary cap initially 999999999999999 minor units per supported aggregate; reject overflow, noncanonical input and totals beyond the cap before posting. Rates are bounded 0..1000000 in the initial product; compound/multi-tax rules require a later decision.

Never rely on a bigint field being safely decoded as a JavaScript Number. Money-bearing RPCs explicitly return text fields. Tests must cover direct query/projection paths so a generated type cannot quietly bypass the transport rule.

## Input and display

Accept validated localized decimal input through one parser, normalize Arabic/Western digits as supported, and reject mixed/ambiguous grouping, exponent notation, NaN, Infinity, negative ordinary prices and excess fractional precision. For OMR: "1.234" → "1234"; "0.001" → "1"; "1.2345" fails rather than silently rounding the entered price.

Display always respects currency scale and locale. Formatting must not convert an arbitrary BigInt to an unsafe Number. Document supported formatter strategy and test upper-bound amounts. Backend computes all authoritative totals.

## Deterministic calculation order

1. Validate currency, quantities, price snapshot, sale-line eligibility and permissions.
2. Compute line extended amount using exact arithmetic; round to minor units half-up for nonnegative values.
3. Apply eligible discounts in defined precedence. MVP permits an authorized fixed or percentage discount with a reason; promotion stacking arrives later.
4. Allocate sale-wide fixed discounts proportionally by eligible base amount. Floor allocations, distribute remaining minor units by largest fractional remainder, then stable sale-line identifier for ties. Sum allocations exactly to the permitted discount.
5. Calculate tax from the discounted base using the snapshotted mode and rate.
6. Compute merchandise/service receivable, taxes, optional tips and final amount due. Tips are separate payable facts and not service revenue.
7. Allocate actual recorded payments and compute outstanding. Never accept a browser's declared final balance.
8. Persist immutable snapshots, journal and related effects in one posting transaction.

For tax-exclusive prices, tax = round(net_minor × rate_ppm / 1000000). For tax-inclusive prices, tax = round(gross_minor × rate_ppm / (1000000 + rate_ppm)); net = gross - tax. Rounding is per line in MVP; document separately any future invoice-level method.

## Arithmetic acceptance examples

| Input | Expected result |
|---|---|
| Unit price 1001 minor × quantity 1.500 | extended amount 1502 minor |
| Exclusive 1000 minor, illustrative 5% | net 1000, tax 50, receivable 1050 |
| Inclusive 1000 minor, illustrative 5% | tax 48, net 952, receivable 1000 |
| Three equal eligible 100-minor lines, total discount 100 | allocation 34 / 33 / 33 in stable tie order |
| Posted total 1050, manual collection 400 | outstanding 650; status partially paid |
| Tip 100 added to sale receivable 1050 | amount due 1150; tip payable 100, not extra net service revenue |
| Identical post/payment/refund retry | same persisted result, no additional journal entry |

On refunds use original line allocations. For partial refunds, calculate cumulative refundable tax from the original tax and cumulative refunded gross, then subtract previously reversed tax. Final eligible reversal consumes any remaining original minor-unit residual. Never exceed original line/payment eligibility or rerun today's tax/promotion rules.

## Minimal operational journal

Each journal transaction is tenant/currency scoped, linked to its immutable source event and balanced: SUM(debit_minor) = SUM(credit_minor). Each line has one nonzero side, positive bounded amounts and a valid account in the same business/currency.

Illustrative accounts: receivable, cash/other clearing, net sales, tax payable, tips payable, stored-value liability and opening/adjustment accounts. This is operational reconciliation, not a full statutory chart of accounts.

- Post a tax-exclusive service sale 1000 + tax 50: debit receivable 1050; credit net sales 1000 and tax payable 50.
- Collect 400: debit cash/clearing 400; credit receivable 400.
- Issue stored value later: credit the appropriate liability, not immediate service revenue.
- Redeem against a sale later: reduce liability and receivable once, while service recognition remains on the sale.
- Refund/correction: append a capped linked reversal, with physical stock return separately decided.

Register opening float and petty cash are cash movements, not booked service sales. Reconciliation must make payment collections, journal and register movements agree without double-counting.

## Snapshot and quote policies

- Catalogue version changes apply to future quotes.
- Appointment quotes retain agreed price/duration/tax data when rescheduled unless an authorized explicit reprice is accepted.
- Before checkout, compare the accepted appointment quote with requested changes and record any authorized adjustment. Snapshot the final sale independently.
- Posted receipts, journal, tax, stock and commission facts are immutable; later policy edits cannot rewrite them.
- Store currency, tax mode/rate, rounding method version, local business date and zone snapshot on posted financial facts.
- Archiving a service/client/staff profile preserves foreign-key references and allowed historical presentation; erasure uses a separate controlled workflow.

## Time representation

| Concept | Rule |
|---|---|
| Appointment/reservation instant | timestamptz, strict ISO instant at API boundary |
| Business/location zone | IANA name, default Asia/Muscat |
| Birthday | date, never shifted through UTC |
| Recurring opening/shift rule | weekday + local wall times + zone/effective range |
| One-off shift/time off | explicit instants or resolved local date/rule with provenance |
| Booking/report day | location-local date boundaries converted to instants |
| Reservation overlap | [start,end); adjacent end/start instants do not overlap |
| Posted business date | computed backend at posting from the location zone; retained with zone snapshot |

For Asia/Muscat, local 2026-11-03 00:00 corresponds to 2026-11-02T20:00:00Z. A day's query uses its next local midnight, not “start + 24 hours” in zones with DST.

Reject nonexistent local times in DST transitions; ambiguous local times require an explicit offset/choice. Verify the chosen date library/polyfill in Phase 01/06; do not hand-roll zone conversion with the browser's current offset.

Initial recurring overnight rules are split into dated intervals by a shared resolver. A future closure/time-off change must acquire the scheduling locks before validating existing bookings and either reject the conflict or use an explicit audited override policy—not silently invalidate bookings.

Multi-location date reports either compute each location's selected local day and label that fact, or use an explicitly selected reporting zone. Never silently mix these definitions in one time-series axis. The initial daily operations report is selected-location local-day based.

Zone changes are controlled settings edits with explicit effective behavior. They do not shift stored appointment instants or reinterpret posted receipt dates. Future booking rules use the new setting only after conflict/availability review.

## Distinct metrics

Booked appointment value comes from valid quoted booking states, not payments. Net sales comes from posted sales/reversals excluding taxes/tips/stored-value issuance. Collected funds comes from settled/recorded payments net of appropriate refunds. Outstanding equals posted receivables minus valid allocations/reversals. Definitions and included statuses are documented per report in Phase 09.

Do not claim legal tax, invoice, payroll or retention compliance from these implementation rules.

