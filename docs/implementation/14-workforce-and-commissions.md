# Phase 14 — Workforce and commissions

**Dependencies:** 13.

**Objective:** Implement staff timekeeping, compensation rules, commission accounting and pay-run preparation.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 14. All master requirements and common deliverables apply.

Build configurable workforce calculations. Do not assume Oman/GCC statutory payroll rules or implement bank disbursement without requirements.

## Backend

1. Extend staff with effective-dated compensation settings, timesheets, clock events, breaks, time-off requests and approval records.
2. Prevent overlapping clock sessions and unauthorized edits; retain original entries, adjustments, reasons and approvals.
3. Define commission eligibility by service/product/plan and staff attribution. Version rules with effective dates and snapshot the applicable rule on the earning event.
4. Derive commission entries from qualified posted-sale/payment events according to the approved policy. Separate taxes, discounts, tips, payment fees and refunds explicitly.
5. Add immutable earning/reversal entries. A refunded sale reverses the relevant earning once; later rule edits do not change past earnings.
6. Aggregate wages, commissions, tips, fees, bonuses and approved adjustments into draft pay runs with review, approval and manual-paid recording states.
7. Freeze approved pay-run calculations, prevent duplicate inclusion of earnings, and provide correction/reversal paths.
8. Restrict compensation/pay information to authorized roles. Staff can see their own approved details only when policy allows; ordinary staff directory queries must not expose salaries.
9. Coordinate approved time off with availability and conflicts using the scheduling engine.
10. Keep timesheet/pay periods and business-day cutoffs timezone-correct.

## Angular

Build weekly shifts refinement, time-off workflow, timesheet review, staff earnings view, rule configuration, pay-run preview/approval and controlled earning-report export. Cash advances are optional and must be absent unless fully modeled.

Provide a manual-payment label rather than implying money has been transferred. Any future bank/provider payout belongs to a separately approved integration.

## Acceptance and tests

A seeded pay period reconciles worked time, wage calculation, commission, tips, bonus and refund reversal. Reprocessing the same sale or timesheet cannot double-pay. An approved run cannot be silently edited, and the same earning cannot enter two runs.

Test midnight/DST shifts, unpaid breaks, retroactive adjustments, role restrictions, time-off conflicts and negative net adjustments under a defined policy.

Deliver attendance, hours, time-off, wages, tips, commission and pay-summary reports based on actual implemented data, plus a compensation policy document.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

