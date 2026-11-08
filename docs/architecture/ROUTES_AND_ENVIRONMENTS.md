# Routes, environments and auth callback contract

**Status:** Proposed, 3 November 2026. URLs are templates, not provisioned destinations.

## Route catalogue

All paths below are relative to configured basePath, which starts/ends with a slash. Use one path-composition helper for assets, redirects and links.

| Route group | Examples | Access and phase |
|---|---|---|
| Entry | /, /not-found, /configuration-error | safe entry/failure pages, 01–03 |
| Auth | /auth/sign-in, /auth/sign-up, /auth/confirm, /auth/forgot-password | real app only, 02 |
| Auth callbacks | /auth/callback, /auth/recovery-callback | SDK-verified flow; no workspace role assumed, 02 |
| Recovery | /auth/reset-password | valid recovery/session context, 02 |
| Invites/context | /invitations/accept, /businesses/select, /businesses/create | verified identity and server invitation/bootstrap rules, 02 |
| Business operations | /app/b/:businessId/l/:locationId/dashboard | scoped member, 03/09 |
| Configuration | .../settings, .../services, .../team | capability + location, 04 |
| CRM | .../clients, .../clients/:clientId | permitted rows/projection, 05 |
| Calendar | .../calendar, .../appointments/:appointmentId | member/assignment rules, 07 |
| Checkout | .../sales/new, .../sales/:saleId, .../register | financial capabilities, 08 |
| Reports | .../reports/:reportKey | allowlisted implemented report + access, 09 onward |
| Public booking | /book/:businessSlug/:locationSlug | published fields and bounded gateway, 10 |
| Customer | /customer/bookings, /customer/bookings/:id | verified identity/ownership, 10 |
| Guest management | /booking/manage | narrowly scoped verified token exchange; no generic UUID lookup, 10 |
| Growth/retail | .../inventory, .../benefits, .../workforce, .../marketing | actual implemented feature + backend entitlement, 12–15 |
| Messaging | .../inbox, /customer/messages | authorized participant, 17 |
| Platform | /platform/businesses, /platform/jobs, /platform/support | independent controlled operator, 18 |

“...” denotes the same /app/b/:businessId/l/:locationId prefix. Business-wide settings use the business context without falsely narrowing owner access; a location selector never grants new scope. IDs/slugs in a URL are selectors, not authorization credentials.

Routes exist only as their phase is implemented. Drawers may have stable detail routes so reload/back works. Deep-linking to another business resolves authorization before content. Preserve a validated local destination through sign-in; reject absolute URLs, protocol-relative paths, encoded escapes and unexpected schemes.

## Target matrix

| Target | Data / identity | Route strategy | Deployment |
|---|---|---|---|
| demo | synthetic in-memory fixtures; no Auth, personal collection or backend endpoint | hash routes under derived basePath | GitHub Pages, publication separately authorized |
| local-app | local Supabase with synthetic seeds and mail sink | path routes; local SPA dev fallback | developer environment, Phase 01 |
| staging-app | separate project, synthetic or explicitly authorized test data | path routes, actual configured callback allowlist | selected suitable host, unresolved |
| production-app | production Supabase + authorized business data | path routes + proper SPA fallback | suitable commercial app host, unresolved |

No demo code path imports/initializes a live client or falls back to production. Missing real-app configuration renders configuration-error instead of synthetic success. API/Storage URLs are not derived from the frontend origin.

## Configuration classification

| Setting | Classification / owner | Readiness |
|---|---|---|
| build target, basePath, asset prefix, locale defaults | public build configuration | define/validate in 01 |
| Supabase URL and publishable key | public real-app runtime/build configuration; not a user credential | project unresolved |
| exact app origin, callbacks and return allowlist | public configuration + Supabase Auth settings | local/staging/production separately resolved |
| elevated Supabase secret / database access | backend/CI secret only | not supplied, not required for Phase 00 |
| merchant/sender/accounting credentials | backend secret, scoped connection metadata separate | vendor undecided |
| GitHub repository and deployment environment | source/CI administrative input | no .git or remote currently |
| project references / region | environment identity and business data-location choice | undecided |
| worker auth and webhook signing secret | backend-only secret | implementation/integration dependent |

Values are not filled with invented real project references or example keys. A future .env.example documents variable names, with no production fallback.

## Callback sequence

1. Start auth with validated intent and local return route; SDK stores its PKCE verifier. Pass only the exact configured environment redirect.
2. Host serves the Angular entry at auth/callback (or recovery-callback). Callback layout bypasses normal member guards while showing a bounded progress/error state.
3. A single callback handler parses the supported SDK parameters and exchanges the code once with automatic URL detection disabled for that strategy.
4. Verify SDK outcome/session, handle expired/reused code or missing browser verifier, remove sensitive parameters using history replacement and avoid third-party analytics on this page.
5. Recovery enters a reset form only with the verified appropriate session/context. Invitation acceptance separately validates token, intended identity, expiry and granted role.
6. Load authoritative membership/customer context; choose a valid local destination. A user with no membership can create a permitted new business or access verified customer records, never guess an existing business.
7. On failure present retry/sign-in with no leaked token values or “successful” empty session.

Refresh and duplicate handler invocation share one pending exchange promise; do not execute exchange twice. Implement and test SDK-specific recovery events in Phase 02 rather than assuming query parameters alone authenticate a recovery.

## Required route tests

- Local/staging deep link to client/appointment/report survives refresh with correct guards.
- Expired session triggers sign-in, then returns only to a permitted route.
- Wrong business/location URL shows safe denied/not-found state.
- PKCE succeeds in supported same-browser flow; missing verifier offers a new attempt.
- Pages demo direct hash links and nested lazy chunks work under a non-root project path.
- Plain missing .js/.svg request is not served the SPA HTML as an asset.
- Logout/context change removes cached private route data.
- No test requires putting real login on the demo target.

