# Phase 04 — Business, staff and services

**Dependencies:** 03.

**Objective:** Implement tenant-scoped business configuration, location settings, staff scheduling profiles and the service catalogue.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 04. All master requirements and common deliverables apply.

Build the operator configuration needed before booking can work.

## Backend

1. Add locations, business preferences, locale/time-zone/currency settings, opening-hour rules and closed periods.
2. Add staff profiles independent from Auth users, location assignments and staff/service eligibility. Reuse membership/permission infrastructure; do not let service editors grant app access.
3. Add service categories, services, variants, durations, integer-minor-unit prices, price-type metadata, buffers and active/archived states.
4. Define tax-rate versions and business tax-inclusive/exclusive preferences. Do not hardcode an assumed statutory rate.
5. Add typed validation and tenant-safe relationships. Index the actual tenant/location/search access paths.
6. Create intentionally public service/staff projections with publication flags; private contacts, salaries and notes must not leak through them.
7. Add resource-unit configuration for rooms/equipment if required by the chosen pilot. Define capacity as explicit bookable units for the initial engine.
8. Make catalogue archival preserve historical references. Restrict destructive deletion of records referenced by appointments/sales.

## Angular screens

Build business settings, location list/details, opening hours, staff list/profile and service/category management. Provide searchable/filterable service lists, category ordering, service forms, price/duration validation and assignment controls.

Provide English/Arabic names where appropriate, optional descriptions, images through authorized Storage and clear archived-item handling. Editing a service must not rewrite any existing appointment or sale snapshot.

## Rules and acceptance

- The same staff/service identifiers cannot be linked to a different business or inaccessible location.
- Staff with no login can still be configured for scheduling.
- Invalid durations, currencies, amounts, tax formats and operating-hour intervals are rejected server-side.
- An Arabic service name displays, searches and appears correctly in forms.
- Category ordering is deterministic under concurrent edits and respects permission checks.
- Service price changes preserve the old value on any historical snapshot once later phases introduce bookings/sales.
- Unit tests exercise decimal-string price parsing and formatting, including OMR 0.001 and large supported values.

Deliver migrations, configuration/catalogue screens, fixtures, typed contracts, authorization tests and schema documentation. Portfolio galleries, service upselling and complex processing-time release rules can be deferred explicitly; do not add nonfunctional controls for them.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

