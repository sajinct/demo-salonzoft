# Phase 05 — Clients, records and imports

**Dependencies:** 04.

**Objective:** Implement CRM, protected client records, consent, basic form templates and staged client imports.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 05. All master requirements and common deliverables apply.

Build the tenant-scoped customer foundation without exposing the Fresha account's data or sending messages.

## Backend and model

1. Add clients, contact channels, addresses, birthdays, preferences, source/tags and consent records. Use dates for birthdays and normalize phone formats without assuming every client is Omani.
2. Separate sensitive notes/consultation answers from ordinary directory fields, with explicit role/location policies.
3. Support client identity links for future self-service, but require a verified linking flow. A supplied email, phone or client UUID is not proof of ownership.
4. Define duplicate detection within a business. Warn on possible matches; do not silently merge or require globally unique family-shared contact details.
5. Add versioned basic form templates and immutable submitted answers linked to the template version. Support plain text, single/multiple choice, date, checkbox consent and controlled file attachment if within pilot scope.
6. Add staged import jobs/rows with validation, preview, duplicate decisions, error reports and idempotent commit. Defer the bulk-job execution mechanism to Phase 11 if needed; cap synchronous imports honestly.
7. Define archival/retention semantics separately from legal erasure. Do not cascade-delete financial or appointment history.

## Angular screens

Create the client directory with server-side search/filter/sort/pagination, add/edit form, profile overview, notes and attachments, form template list/editor, and import preview.

Profile tabs for later appointments, sales and wallet must either show their implemented read models or remain absent until their phase. Record marketing opt-in independently from operational notifications.

## Acceptance and tests

- A receptionist cannot retrieve restricted notes via direct API even when the directory row is readable.
- Another business cannot discover a client by guessed email, UUID, import job or Storage path.
- Import preview makes no live changes; importing the same committed job twice creates no duplicate clients.
- Invalid file types/sizes and unsupported encodings fail clearly. Displayed text/notes cannot execute HTML.
- Imports and downloaded error CSVs neutralize spreadsheet formula injection.
- Creating an Auth identity never automatically grants access to every existing client row sharing its email.
- Arabic names, international phone numbers, birthdays and mixed-direction fields survive create/edit/import round trips.

Deliver the CRM, basic forms/records, storage rules, import contract and targeted tests. No production client import, outreach, identity linking by guesswork or sensitive-data demo seeds.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

