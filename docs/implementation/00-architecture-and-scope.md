# Phase 00 — Architecture and scope

**Dependencies:** Existing brand brief and Fresha analysis.

**Objective:** Produce the implementation blueprint and decision records for the Angular/Supabase app before scaffolding it.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 00. All master requirements and common deliverables apply.

Read the master prompt, brand brief and Fresha feature analysis. Inventory the repository and preserve existing assets. This phase creates the engineering plan and acceptance map; do not implement the application yet.

## Work

1. Create architecture decisions covering frontend feature boundaries, Supabase data-access boundaries, tenancy, authentication, money/time representation, environments, routing and hosting.
2. Explicitly document two targets: a fictional-data GitHub Pages demo and the real Supabase-backed app on a suitable production host. Explain the commercial hosting constraint and retain a production-host decision gate.
3. Create the core ER diagram and initial entity dictionary. Use `business_members` for workspace access and reserve `client_memberships` for salon customers' benefit plans.
4. Define relationships for businesses, locations, staff without logins, Auth identities, customers, services, availability, appointments, sales, payments, receipts, audits and notifications.
5. Draft a permission matrix for owner, manager, receptionist, service professional, finance/read-only roles, customer, anonymous visitor and platform operator. Explain which access can vary by location and which sensitive columns need separate tables/projections.
6. Define route groups: auth, authenticated operations, public booking/customer self-service, and separately authorized platform administration. Specify deep-link and callback behavior for each target.
7. Define business invariants and status state machines, including independent appointment and payment lifecycles.
8. Create a feature coverage map from every reference area and the 59 report names to a phase or explicit deferred scope. Distinguish observed Fresha behavior from proposed Miznora requirements.
9. Create the implementation log with all phases pending, dependencies, completion evidence fields and infrastructure decisions.
10. Define provider-neutral interfaces for payments, notifications, storage attachments, imports/exports and accounting. Real provider selection remains pending; do not assume Stripe or WhatsApp availability.

## Deliverables

Create `docs/architecture/` decisions, an ER diagram, permission matrix, route map, money/time contract and API-boundary contract. Create `FEATURE_COVERAGE.md`, `IMPLEMENTATION_LOG.md` and a concrete MVP acceptance checklist.

## Acceptance

- The operational MVP is bounded to Phases 01–09, public-booking pilot to 10–11, with required release/operations gates identified.
- Cross-business data links, privilege escalation, booking races and ledger consistency have explicit prevention strategies.
- Missing external decisions are listed with impact; non-blocking assumptions are recorded and do not delay these planning artifacts.
- Each phase has an independently demonstrable outcome. Stop after these documents.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

