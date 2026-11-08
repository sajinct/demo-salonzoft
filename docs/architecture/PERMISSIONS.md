# Permission matrix and authorization contract

**Status:** Proposed default access, 3 November 2026. No grants or RLS are deployed yet.

## Principals and scope

| Principal | Source of authority | Default scope |
|---|---|---|
| Owner | active business_members owner role | all locations of own business |
| Manager | active delegated business_members manager role | selected/all explicitly granted locations |
| Receptionist | active business_members receptionist role | selected locations |
| Service professional | active member linked to staff profile | own staff assignments at permitted locations |
| Finance viewer | active business_members finance_viewer role | authorized financial data at granted locations; read/export only |
| Customer | verified client_identity_links | own authorized customer records, never staff workspace membership |
| Anonymous | no identity | published marketing/catalogue and bounded availability only |
| Platform operator | backend-controlled global operator registry | platform metadata by default; no automatic tenant-record access |

Membership scope mode is explicitly all_locations or selected_locations. New locations join an all-locations grant deliberately; they do not silently join a selected-locations grant. Authorization must also inspect object relationship and business lifecycle.

A staff profile without a login has no workspace API authority. A user can have different roles in separate businesses; do not union their permissions across tenants.

## Default capability matrix

Legend: **B** own business all locations, **L** granted locations, **A** assigned/self only, **O** verified customer-owned, **P** published fields, **—** denied. “Read” never grants arbitrary fields or mutation.

| Capability | Owner | Manager | Receptionist | Professional | Finance viewer | Customer | Anonymous | Platform |
|---|---|---|---|---|---|---|---|---|
| Business identity/defaults | B edit | L read | L read | A limited | L limited | P | P | metadata |
| Locations/opening hours | B edit | L edit | L read | L read | L read | P | P | metadata |
| Membership/invite/revoke | B manage | — | — | — | — | — | — | — |
| Transfer ownership | B controlled | — | — | — | — | — | — | — |
| Services/prices/categories | B edit | L edit | L read | L read | L read | P | P | — |
| Staff directory, ordinary fields | B edit | L edit | L limited read | A limited | L limited | P staff | P staff | — |
| Shifts/time off/blocked time | B manage | L manage | L read | A read/request | L read | — | — | — |
| Client directory/basic contacts | B CRUD | L CRUD | L CRUD | A projection | L billing projection | O details | — | — |
| Internal clinical/private notes | B restricted | — default | — | A explicit capability | — | — | — | — |
| Client's own submitted forms | B restricted | — default | request/status only | A explicit capability | — | O own submissions | — | — |
| Appointment create/reschedule | B | L | L | A, own eligible staff | read only | O policy-limited | verified booking gateway only | — |
| Appointment operational status | B | L | L | A allowed transitions | read only | O read/cancel policy | — | — |
| Manual checkout/payment record | B | L | L | — | read only | O receipts/read | — | — |
| Refund/reversal | B controlled | L controlled | — | — | read only | request only later | — | — |
| Open/close register/cash adjustment | B | L | — default | — | read/export only | — | — | — |
| Financial reports/exports | B | L | daily operational L | A own service activity | L | O receipts only | — | — |
| Compensation/payroll | B | — default | — | A approved own earnings | — default | — | — | — |
| Inventory | B manage | L manage | L read; checkout deduction via RPC | L read | L read | P retail fields | P retail fields | — |
| Plans/wallet issuance/adjustments | B | L controlled | read/sell via checkout | — | L ledger read | O balance/redemption policy | — | — |
| Campaign/promotions/loyalty setup | B | L | — | — | L report only | O opt-out/preferences | scoped opt-out token | — |
| Client messaging | B | L | L | A explicit assignment | — | O participant | inquiry gateway later | — |
| Provider credentials/connections | B via trusted setup | — | — | — | — | — | — | separate operator ops |
| Miznora billing/entitlements | B read/configured subscription actions | — | — | — | — | — | — | controlled platform action |
| Tenant audit trail | B redacted read | L redacted read | — | — | financial subset | — | — | scoped support grant |
| Raw credential values | — | — | — | — | — | — | — | — in browser |

MVP defaults intentionally constrain finance viewers to read/export and receptionists to manual tender. A future custom role can delegate narrowly named capabilities through a reviewed owner-only command; do not silently widen these defaults.

## Location and column semantics

Clients are business-wide identities, but location-limited directory users see clients linked through client_locations to their permitted locations. Client creation links the selected authorized location atomically. A professional's assigned-appointment projection supplies only the necessary name/contact/appointment fields; it does not unlock general CRM search.

Clinical/private record access requires a separate capability plus an assigned/purpose-appropriate relationship. Owner access is audited; professional access does not make internal notes customer-visible. Managers/receptionists may see form completion status without answers.

Keep compensation, clinical content, integration secrets and audit details outside ordinary staff/client rows. Use carefully granted projections or RPCs; frontend hidden columns are insufficient.

## Business states and exceptional actors

Active permits authorized operations. Suspended denies new ordinary writes; owner-permitted read/export remains available as defined by lifecycle policy. Archived is closed/read-only through its retention workflow. These statuses are controlled backend fields.

Verified provider settlement/refund reconciliation and approved recovery jobs have narrow system capabilities even when a business is suspended. They cannot create arbitrary new sales or memberships.

Operators gain tenant-data support only through a separate expiring support_grant with business, action set, purpose, approval, operator identity and audit. Business owners cannot manufacture these grants.

## Authorization decision order

1. Validate caller identity or the explicit public/webhook/job authentication mechanism.
2. Resolve the requested business context and object without leaking inaccessible existence.
3. Verify active membership/customer ownership/operator grant as appropriate.
4. Verify business state and backend entitlement.
5. Verify location/object relationship, capability, field restrictions and workflow transition.
6. Enforce cross-business foreign keys and invariant locks in the mutation transaction.
7. Attribute actor/correlation server-side and emit audit/event records.

User-facing errors should not distinguish another tenant's existing UUID from a nonexistent inaccessible record. Public booking is a separately constrained gateway, not anonymous general CRUD.

## Security acceptance matrix for implementation

| Test | Expected result |
|---|---|
| Anonymous reads private tables/direct RPC | denied; published projection only |
| Business A identity supplies business B UUID | denied for reads, writes, reports, files and live updates |
| User belongs to A and B with different roles | only the selected business's role applies |
| Location L1 receptionist requests L2 objects | denied despite same business |
| Update child business_id or point FK at another tenant | database rejects |
| Profile/metadata claims owner or operator | no authority gained |
| Self-insert membership or modify role/scope | denied; controlled command only |
| Revoke membership while session remains valid | subsequent business operations denied |
| Remove/demote the last owner | rejected atomically |
| Verified email matches an existing client | no automatic past-record access |
| Staff directory query includes salary column | denied/not exposed |
| Customer requests internal notes/other client files | denied |
| Owner invokes platform-admin endpoint | denied absent independent operator authority |
| Expired support grant or changed role | denied immediately by authoritative lookup |
| Guessed private Storage key or export ID | denied; URL/key knowledge is not ownership |
| Cross-business aggregate/report query | no totals or counts leaked |
| Concurrent role revocation/business suspension and mutation | transaction-time guard consistently enforces documented order |
| Sign-out/business switch with in-flight requests | subscriptions/cache cleared and stale data not displayed |

This matrix is a required future test plan. Phase 00 performs document validation only, not these security tests.

