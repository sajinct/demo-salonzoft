# Phase 11 — Notifications and background jobs

**Dependencies:** 10.

**Objective:** Implement reliable backend-driven notifications, waitlist offers and bounded background work.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 11. All master requirements and common deliverables apply.

Build a durable event pipeline; do not use browser timers or fire-and-forget network calls for essential work.

## Backend

1. Consume the transactional outbox established in earlier phases with Supabase Queues or a documented equivalent. Add job state, visibility/lease handling, attempts, retry backoff, dead-letter state and operational inspection.
2. Use Supabase Cron to enqueue/dispatch bounded jobs and recover interrupted workers. Keep Edge invocations short and resumable.
3. Implement notification templates, language variants, schedules, delivery attempts, provider IDs and message history.
4. Cover booking creation/reschedule/cancel/no-show, upcoming reminders, post-visit thank-you, rebooking and waitlist offers. Build required triggers first; birthday/marketing expansion belongs to Phase 15.
5. Deduplicate jobs using event/version/template/recipient keys. Before sending, recheck the current appointment version/status, notification preferences and recipient scope. A rescheduled appointment must not receive its old reminder.
6. Define channel/provider adapters for email and optionally SMS/WhatsApp. Verify actual provider support and configure secrets only in trusted runtime. Local development uses an explicit mail sink/test adapter.
7. Distinguish transactional notifications from marketing consent and suppress prohibited outreach. Document necessary operational-email behavior instead of treating all messages as marketing.
8. Verify delivery-webhook signatures, process duplicate/out-of-order statuses safely and avoid trusting a provider ID supplied by a browser.
9. Provider timeouts are ambiguous. Use provider idempotency when available, reconcile unknown outcomes, and do not claim universal exactly-once external delivery.
10. Add bounded bulk-import/export workers and secure, expiring export downloads if earlier phases deferred large jobs.
11. Redact tokens/contact content from routine logs, restrict job/message visibility by role, and throttle jobs per business.

## Angular

Provide automation settings, template previews, language selection, notification delivery history with actionable failure states, and owner-only job retry controls. Retries must not bypass consent or duplicate previously delivered messages.

## Acceptance and failure tests

Workers continue after the browser closes; crash/restart does not lose a job; concurrent workers do not process the same lease incorrectly; duplicate webhooks do not duplicate delivery accounting.

Test cancellations/reschedules before send time, timezone scheduling, rate limits, provider timeout, dead-letter recovery and business suspension. Retry of an already processed booking event must not create duplicate reminders or waitlist offers.

Use provider sandbox/local delivery only for verification. Missing live credentials are explicit setup gaps, not successful sends. Customer-booking pilot readiness still requires Phase 18 operational essentials and Phase 19 release checks.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

