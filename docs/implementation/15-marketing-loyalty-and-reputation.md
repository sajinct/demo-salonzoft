# Phase 15 — Marketing, loyalty and reputation

**Dependencies:** 11, 13, 14.

**Objective:** Build consent-aware audiences, promotions, loyalty and review collection over actual operational events.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 15. All master requirements and common deliverables apply.

Implement in bounded subphases if necessary: A segments/promotions, B campaigns, C loyalty/referrals, D reviews. Finish each vertical slice and record deferred scope.

## Backend

1. Create standard/custom client segments using a validated filter DSL or parameterized query model; never accept arbitrary client SQL.
2. Define standard new/recent/lapsed/high-spend/birthday/online-booker audiences using documented event/time boundaries.
3. Add promotions, discount codes, schedules, usage/customer limits, eligible services/products, stacking rules and immutable redemption records.
4. Checkout must atomically enforce deal validity, budget/caps and eligibility. Concurrent use cannot exceed a one-use code or campaign limit.
5. Add campaign drafts, audience preview, recipient snapshots, consent recheck, send approval, scheduling, cost estimate/budget caps and delivery metrics through the job system.
6. Add secure idempotent unsubscribe/suppression endpoints. Unsubscribing must affect already queued marketing before it sends.
7. Implement loyalty accounts, point earning/reversal, tier rules, reward redemption and referral attribution through auditable ledgers.
8. Prevent self-referral/repeated first-visit reward abuse, double earning and negative/duplicated redemption under concurrency.
9. Implement verified-visit reviews with appropriate moderation and business reply permissions. Use real approved Google APIs only if connected and permitted; do not scrape or fake Google reviews.
10. Smart pricing is optional. If included, define time/rule precedence, price disclosure, snapshots and enforcement; distinguish it from ordinary discounts.
11. Keep AI-generated review replies optional, reviewed and unsent until a user approves a real send action.

## Angular

Provide segment builder/count preview, deal editor, campaign preview/approval/history, loyalty program and client progress screens, referrals, review dashboard and reply drafts.

Respect tenant/location/marketing permissions, local dates, language and opt-out state. Never make a demo campaign send to a real provider.

## Acceptance

Test consent withdrawal between preview and delivery, duplicate events, stale audience previews, code-limit races, refund point reversal, referral fraud fixtures and review ownership.

Campaign metrics must distinguish queued, attempted, provider accepted, delivered, bounced and unknown; do not fabricate open/conversion metrics unsupported by a provider.

Deliver implemented growth reports, provider configuration gaps and an explicit consent/audience/loyalty rules document.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

