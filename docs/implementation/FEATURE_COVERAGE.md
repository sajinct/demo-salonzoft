# Feature coverage and implementation traceability

**Date:** 3 November 2026  
**Current status:** Phase 00/01 foundation exists. Phase 02 Auth/tenant-security implementation is present with embedded SQL and browser-fixture evidence, but full Supabase acceptance is blocked by the missing runtime and the phase is **not complete**. Phase 03 and operational catalogue/client/booking/checkout/report implementations remain **not started**.

The [Fresha analysis](../Fresha_Feature_Analysis.md) is the reference evidence. Reviewed means the account's visible screen/control was inspected, not that its entire operational/security behavior was proven. Overview/navigation claims remain labeled. Proposed Miznora rules do not become verified Fresha facts.

## Review-area map

The reference §3 actually contains **17 distinct rows**: Workspace administration and Extensions are separate. All 17 are mapped below (rather than collapsing them into a claimed count of 16). Its 12 detailed §4 sections are also covered by the feature rows.

| ID | Reference area | Evidence | Owning phases | Source | Delivery boundary | Scope |
|---|---|---|---|---|---|---|
| A01 | Dashboard | Reviewed | 09 | §3 Dashboard / §4.1 | Internal MVP | Booked value versus collected sales; scoped metrics, freshness and activity |
| A02 | Calendar and appointments | Reviewed; detailed behaviors partly unverified | 06, 07, 10 | §3 Calendar / §4.2 | Internal MVP; public extensions 10 | Reservations, staff/day calendar, lifecycle; customer/waitlist extensions |
| A03 | Services | Reviewed configuration; some sections navigation | 04, 05, 06, 13, 14, 17 | §3 Services / §4.3 | Core 04; extensions later | Catalogue/eligibility first; forms, resources, upsell, commissions, optional AI separate |
| A04 | CRM | Reviewed directory/profile; some tabs navigation | 05, 07, 08, 13, 15 | §3 CRM / §4.4 | Internal MVP core | Protected clients, history projections, later wallet/loyalty |
| A05 | Segmentation | Reviewed | 15 | §3 Segmentation / §4.4 | Extension | Constrained segments from operational events; not free-form SQL |
| A06 | POS and sales | Lists reviewed; checkout introduction only | 08, 09, 13, 16 | §3 POS / §4.5 | Manual internal MVP; provider later | Real partial-payment/refund behavior is a proposed requirement, not verified Fresha parity |
| A07 | Registers | Overview | 08, 09 | §3 Registers / §4.5 | Internal MVP | Cash opening/movement/closing/variance; no bank-transfer claim |
| A08 | Inventory | Overview; prerequisite screen; supplier navigation | 12 | §3 Inventory / §4.6 | Extension | Ledger, purchase orders, stocktake and receiving as proposed working flows |
| A09 | Packages and memberships | Package overview; memberships/report navigation | 13, 16 | §3 Packages / §4.6 | Extension | Snapshot benefits and balances; recurring payment requires provider |
| A10 | Online booking | Settings/direct links reviewed; other channels setup/navigation | 10, 17 | §3 Online booking / §4.7 | Customer pilot core; native channels later | Own public page/direct links first; marketplace/native Google/social eligibility deferred |
| A11 | Marketing | Templates reviewed; campaigns/deals overview | 11, 15 | §3 Marketing / §4.8 | Pilot reminders; growth later | Transactional jobs first, consent-aware campaigns/promotions later |
| A12 | Loyalty and reputation | Loyalty overview; reputation reviewed | 15, 17 | §3 Loyalty / §4.9 | Extension | Own verified reviews, points/tiers/referrals; external connection conditional |
| A13 | Team | Directory/profile/roster/pay settings reviewed; payroll overview | 02, 04, 06, 09, 14 | §3 Team / §4.10 | Internal MVP scheduling; workforce later | Role separation, shifts, metrics; compensation and approval later |
| A14 | Reports | Catalogue reviewed; one detailed report reviewed | 09–18 | §3 Reports / §5 | Named report map below | 59 source names mapped; no promise all 59 ship with MVP |
| A15 | Messaging | Demo inbox reviewed; controls partly disabled | 17 | §3 Messaging / §4.9 | Extension | Participant-scoped shared inbox and individual provider adapters |
| A16 | Workspace administration | Representative settings reviewed; billing/payment processing not deeply tested | 02, 04, 05, 06, 08, 16, 18, 19 | §3 Workspace administration / §4.11 | Internal MVP subset; platform operations later | Business/localization, locations, booking/sales/forms settings, billing and control plane |
| A17 | Extensions | Catalogue descriptions reviewed; connections untested | 16, 17, 18 | §3 Extensions / §4.12 | Optional/configuration dependent | Payments, accounting, ads/analytics, data connector, website, AI and support |

## Detailed feature map

Every row's application status is **Planned — not implemented**, except explicitly deferred behavior. Phase 00 completes design artifacts only. “MVP” below is planned release scope, not a working feature claim.

| ID | Feature / slice | Reference evidence | Phase / disposition | Boundary |
|---|---|---|---|---|
| F01 | Identity, tenant isolation, scoped roles, operator separation | Proposed Miznora | 02, 18 | Phase 02 local/staging source implemented; 87 SQL assertions in embedded PostgreSQL; real-stack acceptance blocked. Operator controls in 18 pending. |
| F02 | EN/AR runtime localization, RTL, responsive accessible shell | Proposed Miznora; Fresha Arabic unverified | 03, 19 | Core / release |
| F03 | Business, country/currency/languages, tax preferences, external links | Reviewed §4.11 | 04 | Core |
| F04 | Locations, business types, contacts and opening hours | Reviewed §4.11 | 04 | Core |
| F05 | Staff profiles without login; eligible locations/services | Reviewed/proposed §4.10 | 02, 04 | Core |
| F06 | Categories, service search/order/name/description/price/duration | Reviewed §4.3 | 04 | Core |
| F07 | Service forms and private client records | Section observed §4.3/4.11; field behavior proposed | 05 | Core basic; signing deferred |
| F08 | Service resources, add-ons and optional portfolio images | Section observed §4.3 | 04, 06, 13 | Resources core if pilot needs; upselling extension |
| F09 | AI catalogue description generation | Control observed §4.3 | 17 | Optional; no live model selected |
| F10 | Client CRUD/search/filter/sort/import preview and duplicates | Reviewed §4.4 | 05 | Core |
| F11 | Client appointments/sales/wallet/history read models | Reviewed profile tabs §4.4 | 07, 08, 13 | Implemented only as backing modules exist |
| F12 | Client tags/sources, consent, retention/export/redaction | Settings observed §4.11; policies proposed | 05, 18 | Core classification; full operations gate |
| F13 | Staff shifts/breaks/time off versus opening hours | Reviewed roster/settings §4.2/4.10 | 06, 14 | Scheduled availability core; actual hours later |
| F14 | Busy reservations, blocked time, conflict and stale-edit prevention | Controls observed §4.2; concurrency behavior unverified | 06 | Core proposed invariant |
| F15 | Calendar navigation/team/visibility filters/reset and appointment drawer | Reviewed §4.2 | 07 | Core |
| F16 | Day view plus optional week/drag interaction | Day reviewed §4.2; week/drag unverified | 07 | Day core; week/drag explicit optional |
| F17 | Multi-service booking, any eligible staff, walk-in, snapshots/totals | Reviewed draft §4.2 | 06, 07 | Core |
| F18 | Booked/confirmed/arrived/started/completed/canceled/no-show lifecycle | Statuses reviewed §4.2 | 06, 07 | Core |
| F19 | Cancellation reasons/custom statuses/closures | Settings observed §4.2 | 06, 07 | Defaults core; custom lifecycle labels later in same phase only if tested |
| F20 | Booking lead time/horizon/cutoffs, increments, gap optimization | Reviewed settings §4.2/4.7 | 06, 10 | Basic window core; sophisticated optimization deferred |
| F21 | Recurring bookings, processing-time staff release, intentional overbooking | Explicitly unverified §4.2 | Deferred | Requires separate rules and tests; no fake control |
| F22 | Manual sale/draft/payment/tip/refund/receipt operations | Lists/intro §4.5; full flow unverified | 08 | Core proposed transactions |
| F23 | Daily sales, cash movement, fee/tip/return categories | Reviewed §4.5 | 08, 09, 16 | Core manual subset; unsupported fees later |
| F24 | Tax versions/mode, receipt fields and sequencing | Reviewed §4.11 | 04, 08 | Core; legal configuration pending |
| F25 | Custom checkout methods, service charges and gift-card settings | Settings reviewed/navigation §4.11 | 08, 13, 16 | Cash/other core; charges/provider methods later |
| F26 | Register float/petty cash/open-close/variance | Overview §4.5 | 08 | Core proposed flow |
| F27 | Public profiles, service/staff choice, images, multi-person and disclosures | Reviewed settings/setup §4.7 | 10 | Pilot basic; multi-person separate subphase if selected |
| F28 | Direct/custom links, QR codes, cross-location offering | Reviewed/settings §4.7 | 10 | Pilot |
| F29 | Waitlist windows/offers/expiry and customer manage booking | Entry/templates observed §4.2/4.8; claim behavior unverified | 10, 11 | Pilot proposed flow |
| F30 | Marketplace discovery/ranking and native Google/social bookings | Overview/navigation §4.7 | 17 / Deferred | Individual eligible integration; marketplace discovery separate product scope |
| F31 | Reminders, booking-change/no-show/thank-you and waitlist messages | Reviewed templates §4.8 | 11 | Pilot |
| F32 | Message delivery history, balance/cost/budget controls | Reviewed/settings §4.8 | 11, 15, 16 | Delivery core; prepaid communication balance deferred unless priced model selected |
| F33 | Rebook, birthday, win-back, loyal/new-client messages | Reviewed templates §4.8 | 11, 15 | Rebook pilot; marketing consent in growth |
| F34 | Email/text campaigns, custom templates, promotions and reporting | Overview §4.8 | 15 | Extension |
| F35 | Discount codes/flash/last-minute deals and smart pricing | Overview/settings §4.8 | 15 | Deals extension; complex pricing optional |
| F36 | Standard/custom segments and audience definitions | Reviewed §4.4 | 15 | Extension |
| F37 | Loyalty points, tiers, rewards, referrals and customer progress | Overview §4.9 | 15 | Extension |
| F38 | Ratings/reviews, distributions, response rate, verified visits | Reviewed §4.9; enforcement proposed | 15 | Extension |
| F39 | Google review connection/boost and AI reply drafts | Catalogue/control §4.9/4.12 | 17 | Configuration dependent; no scraping or fake replies |
| F40 | Products/brands/categories/import/low-stock/online retail | Overview §4.6 | 12 | Extension |
| F41 | Stocktake scanner/count/pause/resume/notes and movements | Overview §4.6 | 12 | Extension; hardware test separately |
| F42 | Suppliers/orders/partial receiving/transfers/returns | Navigation/prerequisite §4.6; detailed flow proposed | 12 | Extension |
| F43 | Gift cards, prepayments, wallet ledger and redemptions | Profile/report entries §4.4/5 | 13 | Extension |
| F44 | Packages/memberships, limits, benefits and recognition | Overview/report entries §4.6/5 | 13 | Extension |
| F45 | Recurring customer membership payments | Unverified §4.6 | 16 | Provider dependent |
| F46 | Occupancy/retention, staff service/sales metrics | Reviewed profile §4.10 | 09, 14 | Basic metrics core; actual-time workforce later |
| F47 | Clock/break/time-off approval, wages, commissions, fees/tips | Settings/report catalogue §4.10/5; formulas unverified | 14 | Extension |
| F48 | Pay-run prep/approval/reports/advances | Overview/settings §4.10 | 14 | Manual approval/prep; advances and bank payouts deferred |
| F49 | Report search/categories/favorites/views/filter/customize/exports/freshness | Reviewed §5 | 09, 11, 17 | Essential implemented reports first; large export jobs 11; custom analytics 17 |
| F50 | Shared client inbox, participants/open-close/quick replies/attachments | Demo inbox §4.9 | 17 | Extension |
| F51 | Public contact-page inquiry and Team Connect | Intro/catalogue §4.9/4.12 | 17 | Optional extension |
| F52 | Real payments/terminals/deposits/split tender/refunds/webhooks | Overview/navigation; operational behavior unverified §4.5/4.11 | 16 | Approved provider capabilities; terminals/split tender require explicit slice |
| F53 | Miznora plans/trials/billing/entitlements and backend usage limits | Billing observed §4.11; Miznora rules proposed | 02, 16, 18 | Pilot grants first; no invented commercial price |
| F54 | Xero/QuickBooks, exports/Data Connector | Catalogue §4.12 | 17 | Selected adapter/API access dependent |
| F55 | Meta Pixel/Google Analytics/Google Ads | Catalogue §4.12 | 17 | Optional consent/provider eligibility dependent |
| F56 | Smart Website/business mini-site | Catalogue §4.7/4.12 | 10, 17 | Booking page first; full site builder deferred |
| F57 | Bookable Resources and usage reports | Catalogue §4.12 | 06, 17 | Unit reservations core where needed; advanced report optional |
| F58 | AI Concierge, premium support and advanced Insights | Catalogue §4.12 | 17, 18 | Optional separate scope; no parity promise |
| F59 | Backups, operator support, logs, lifecycle, imports and recovery | Proposed Miznora operational requirements | 18, 19 | Production gate even for reduced pilot |
| F60 | Auth routing, multi-business test fixtures and Pages demo separation | Proposed stack requirements | 00, 01, 02, 19 | Demo isolation retained. Phase 02 local/staging callbacks, typed context and synthetic SQL security fixtures implemented; real Auth/DB acceptance and publication pending. |

## Phase 02 evidence and remaining gate

| Slice | Delivered | Actual evidence / limits |
|---|---|---|
| Identity and scoped authority | Profiles, five controlled roles, tenant memberships, location scopes, separate staff identity links and current-state authorization | 87 pgTAP assertions pass in embedded PostgreSQL 18.6; actual Supabase PostgreSQL 17 acceptance pending |
| Trusted commands | Idempotent first-business creation, membership access/revocation, hashed intended-email invitations, last-owner protection and atomic ownership transfer | SQL assertions cover grants/RLS, cross-tenant FKs, metadata non-authority, changed scope/role, invitation expiry/revocation/retry and audit immutability |
| Auth and context UI | Local/staging SDK sign-in/out/restoration, confirmation/recovery, explicit PKCE callbacks, safe return paths, businesses and owner controls | 19 unit/script tests + 12 browser tests pass; seven browser Auth scenarios use intercepted HTTP fixtures, not a live Auth service |
| Storage/Edge foundation | Private registered/scoped documents, separate intentionally public marketing bucket and caller-JWT Edge boundary helper | SQL policy and injected-fetch tests pass; real binary Storage/Deno invocation unrun; no client/clinical upload UI or deployed Edge endpoint |
| Schema/types/fixtures | Three unapplied Supabase migrations; catalog-generated public types; two synthetic businesses/three locations/multiple principals | Actual executed-schema generation in the embedded harness; real CLI type generation blocked, not fabricated |
| Completion gate | Real local reset/Auth/mail/REST/RPC/Storage/concurrency acceptance and hosted environment configuration | [Validation](PHASE02_VALIDATION.md), [setup](../runbooks/PHASE02_LOCAL_SETUP.md), [actual contract](../architecture/AUTH_AND_TENANT_SECURITY.md). Phase 02 is not complete; Phase 03 is pending. |

## Phase 01 foundation evidence

Historical Phase 01 evidence follows. Current Phase 02 adds real Auth source and schema; see the section below for its separate verification limits.

| Slice | Actual delivery | Limits / evidence |
|---|---|---|
| Repository/toolchain | Strict standalone Angular, Material/CDK, pinned Node/npm/dependencies and root lockfile | [Setup and configuration matrix](../../README.md); no Git remote/repository created |
| Demo | Lazy overview/guide/not-found, original SVG copies, synthetic memory adapter and workspace switching/reset | No Auth, collected personal data, backend endpoint/key/SDK or network write adapter; [validation](PHASE01_VALIDATION.md) |
| App configurations | local/staging/production path routing, public runtime config validation and startup error | No live connectivity, authentication, tenant access or operational persistence implemented |
| Localization foundation | EN/AR copy, language direction and responsive preview | Does not complete F02/Phase 03 shell, calendar/table/dialog or full localization acceptance |
| Backend structure | CLI-generated local configuration, migration/test/function folders and synthetic seed contract | No schema, RPCs, policies, Edge Functions or populated DB fixtures; Docker/Podman unavailable; no DB pass claimed |
| Delivery | CI, manual demo Pages workflow and separate protected backend dry-run workflow | Prepared locally only; hosted workflow runs and publication unperformed |

## Named report map — 59 / 59

Exact report names come from reference §5. The source observed 51 Standard and 8 Premium; Miznora does not copy that pricing/access model. These are names mapped to an implemented domain/metric phase, not 59 promised first-release cards.

| ID | Category | Exact reference report name | Owning phase | Planned scope | Current status |
|---|---|---|---|---|---|
| R01 | Dashboard and general performance entries | Performance dashboard | 09 | MVP | Not started |
| R02 | Dashboard and general performance entries | Online presence dashboard | 17 | Extension | Not started |
| R03 | Dashboard and general performance entries | Loyalty dashboard | 15 | Extension | Not started |
| R04 | Dashboard and general performance entries | Performance summary | 09 | MVP | Not started |
| R05 | Dashboard and general performance entries | Performance over time | 09 | MVP | Not started |
| R06 | Sales | Sales summary | 09 | MVP | Not started |
| R07 | Sales | Sales by time period | 09 | MVP basic buckets | Not started |
| R08 | Sales | Sales list | 09 | MVP | Not started |
| R09 | Sales | Sales log detail | 09 | MVP | Not started |
| R10 | Sales | Gift card by time period | 13 | Extension | Not started |
| R11 | Sales | Gift card list | 13 | Extension | Not started |
| R12 | Sales | Memberships list | 13 | Extension | Not started |
| R13 | Sales | Memberships summary | 13 | Extension | Not started |
| R14 | Sales | Memberships benefits consumption | 13 | Extension | Not started |
| R15 | Sales | Packages list | 13 | Extension | Not started |
| R16 | Sales | Packages summary | 13 | Extension | Not started |
| R17 | Sales | Packages benefits consumption | 13 | Extension | Not started |
| R18 | Sales | Cash register summary | 09 | MVP | Not started |
| R19 | Sales | Discount summary | 09 | MVP | Not started |
| R20 | Sales | Taxes summary | 09 | MVP | Not started |
| R21 | Finance | Finance summary | 09 | MVP manual ledger | Not started |
| R22 | Finance | Payments summary | 09 | MVP | Not started |
| R23 | Finance | Payment transactions | 09 | MVP manual; provider detail 16 | Not started |
| R24 | Finance | Cash flow summary | 18 | Deferred accounting scope | Deferred; requirements pending |
| R25 | Finance | Cash flow statement | 18 | Deferred accounting scope | Deferred; requirements pending |
| R26 | Finance | Service charges | 16 | Extension policy dependent | Not started |
| R27 | Finance | Liability summary | 13 | Extension | Not started |
| R28 | Finance | Liability activity | 13 | Extension | Not started |
| R29 | Finance | Prepayments by time period | 13 | Extension | Not started |
| R30 | Finance | Prepayment list | 13 | Extension | Not started |
| R31 | Finance | Taxes list | 09 | MVP | Not started |
| R32 | Appointments | Appointments summary | 09 | MVP | Not started |
| R33 | Appointments | Appointments list | 09 | MVP | Not started |
| R34 | Appointments | Appointments cancellations & no-show summary | 09 | MVP | Not started |
| R35 | Appointments | Waitlist detail | 10 | Pilot extension | Not started |
| R36 | Appointments | Waitlist summary | 10 | Pilot extension | Not started |
| R37 | Team | Working hours activity | 14 | Extension | Not started |
| R38 | Team | Break activity | 14 | Extension | Not started |
| R39 | Team | Attendance summary | 14 | Extension | Not started |
| R40 | Team | Wages detail | 14 | Extension | Not started |
| R41 | Team | Wages summary | 14 | Extension | Not started |
| R42 | Team | Fee deduction activity | 14 | Extension | Not started |
| R43 | Team | Fee deduction summary | 14 | Extension | Not started |
| R44 | Team | Pay summary | 14 | Extension | Not started |
| R45 | Team | Scheduled shifts | 09 | MVP scheduled-only | Not started |
| R46 | Team | Working hours summary | 14 | Extension actual-time | Not started |
| R47 | Team | Team time off report | 14 | Extension | Not started |
| R48 | Team | Tips summary | 09 | MVP manual ledger | Not started |
| R49 | Team | Tips detail | 09 | MVP manual ledger | Not started |
| R50 | Team | Commission activity | 14 | Extension | Not started |
| R51 | Team | Commission summary | 14 | Extension | Not started |
| R52 | Clients | Client summary | 09 | MVP | Not started |
| R53 | Clients | Client list | 09 | MVP report over phase 05 directory | Not started |
| R54 | Clients | Client insights | 15 | Extension | Not started |
| R55 | Inventory | Stock on hand | 12 | Extension | Not started |
| R56 | Inventory | Stock movement summary | 12 | Extension | Not started |
| R57 | Inventory | Stock movement log | 12 | Extension | Not started |
| R58 | Inventory | Product list | 12 | Extension | Not started |
| R59 | Inventory | Ordered stock | 12 | Extension | Not started |

Cash flow summary/statement are explicitly deferred accounting scope: Phase 18 may define their requirements/operations, but those reports are not implied by a manual-cash daily summary or the existing operational journal. They need an approved accounting model before implementation. Report dates, source events, exclusions and reconciliation are specified before each report is marked implemented.

## Coverage update rules

1. Preserve source evidence separately from Miznora implementation state.
2. Mark a slice In progress, Implemented/unverified, Verified (with concrete environment/check evidence), Configuration dependent or Deferred honestly.
3. Hide unimplemented product controls and retain report names here rather than publishing empty successful-looking cards.
4. Update phase ownership when scope changes, with a decision-log reference and dependency impact.
5. A provider stub, menu item, demo screen, prompt file or architecture document is not a production feature.
6. Required reduced-pilot gates: [MVP acceptance](../architecture/MVP_ACCEPTANCE.md), [decisions](../architecture/DECISIONS_REGISTER.md), Phase 18 operational subset and Phase 19 release checks.

