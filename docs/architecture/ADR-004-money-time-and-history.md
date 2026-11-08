# ADR 004 — Exact values and historical truth

**Date:** 3 November 2026  
**Status:** Adopted design; product/tax defaults are explicit assumptions.

## Decision

Money uses Postgres bigint integer minor units and decimal-string DTO serialization. OMR uses scale three. Frontend domain calculations use BigInt through one money module; raw bigint fields are not read through an unverified JSON-number conversion path.

Rates/quantities use exact documented fixed-scale formats. Financial authority remains in transactional database commands. UI previews may calculate the same rules for display but never determine posted totals.

Store UTC instants as timestamptz, retain IANA location time zones, and use local date/time rules for recurring availability. Preserve posted business-date/time-zone snapshots for financial reports.

## Historical data

Appointments copy service name/version, duration, price and relevant tax/rule data when the quote is accepted. Sale lines independently snapshot the final agreed checkout facts. An appointment reschedule retains its quote unless an explicit authorized repricing action is confirmed.

Posted sales, payment effects, journal entries, benefit/stock/commission movements and receipt facts are immutable. Append a linked reversal/correction rather than modifying the original.

Changes to tax rates, location zone, catalogue price or commission rules are effective-dated and cannot rewrite posted history. Archival preserves referenced objects.

## Metric separation

Define booked value, posted sales net of tax, total sale receivable, collected payments, outstanding balances, tax, tips and stored-value liabilities independently. An appointment completion does not imply collection; gift-card issuance does not immediately equal service revenue.

A minimal balanced operational journal supports reconciliation. This is an internal product accounting design, not a claim of statutory accounting certification.

## Defaults and open decisions

- Default OMR / Asia/Muscat / English and Arabic.
- Store one currency per business initially; retain currency in every financial fact. No foreign-exchange conversion in MVP.
- Suggested default week start Saturday and slot increment 15 minutes, both configurable and not legal or universal defaults.
- Tax rates start unconfigured. An owner chooses pricing mode and rate after business requirements are established; zero/unconfigured must not be presented as verified tax compliance.
- Refunds use original allocations/rates, not today's catalogue/rules.
- Legal invoice requirements, tax configuration and retention durations require business verification before production.

The arithmetic examples, constraints and date policies in [Money and time](MONEY_AND_TIME.md) are the normative implementation contract.

