# Phase 17 — Messaging and advanced integrations

**Dependencies:** 16; individual adapters can be deferred without blocking core release.

**Objective:** Add a shared customer inbox and selected externally integrated capabilities through explicit feature slices.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 17. All master requirements and common deliverables apply.

Split this phase into A shared inbox, B accounting/export connector, C booking-channel/website capabilities and D optional AI. Select only approved extensions; do not claim all advertised Fresha integrations are implemented.

## A. Messaging

1. Add business-scoped conversations, participants, messages, attachments, assignment and open/closed states.
2. Enforce participant/role access in queries, Storage and Realtime channels. An appointment/client identifier alone cannot join a conversation.
3. Add unread counts, search, quick replies, retry/idempotent send, attachment validation and delivery states.
4. Keep provider-mediated email/SMS/WhatsApp threads separate where threading or availability differs. Incoming provider messages require verified webhooks and safe identity matching.
5. Build inbox, conversation detail, assignment/history and customer self-service messaging. No cross-business search leakage.

## B. Accounting and data integration

Create scoped connection records and encrypted backend-only credentials for an approved integration such as Xero/QuickBooks only when access is available.

Map customers, sales, taxes, payments, refunds and liabilities to the selected accounting contract. Use idempotent external references, sync checkpoints, retries and reconciliation; never mark an export synchronized merely because a job was queued. Offer a controlled data export connector if direct API access is unavailable.

## C. Distribution and websites

Implement direct links/QR codes already supported by public booking. Google/social partner booking integrations require actual eligibility and APIs; ordinary links are not native platform integration.

A business mini-site may use the existing public booking frontend. A full website builder and marketplace discovery are separate optional slices with their own requirements, publication permissions and suitable production hosting.

## D. Optional AI assistance

Keep provider keys server-side, minimize data sent, enforce tenant-scoped retrieval and add usage/cost limits. Generated descriptions/replies are drafts. Booking changes, external messages, financial actions and publication require explicit user confirmation in the product. Do not let model-generated identifiers bypass authorization.

## Acceptance

Test inbox access/Realtime isolation, duplicate sends, attachment leakage, unverified incoming webhooks, accounting resync and revoked integration credentials.

Ship honest disabled/unconfigured states. Never present a plain booking link as a completed Google integration or a local stub as a live accounting connection. Document each extension's actual readiness separately.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

