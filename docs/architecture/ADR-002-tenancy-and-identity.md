# ADR 002 — Tenancy, identity and authority

**Date:** 3 November 2026  
**Status:** Adopted design.

## Decision

A business is a tenant; a location belongs to exactly one business. An Auth user is a global identity and can belong to multiple businesses. `business_members` links identities to workspace roles and location scopes. A `staff_members` scheduling record may exist without a login. `client_memberships` later represents purchased salon benefits, never workspace access.

Tenant records carry `business_id`. Parent references use tenant-qualified keys, for example a unique `(business_id, id)` parent key and a matching child foreign key. Do not rely on UUID unpredictability or frontend filters.

## Authentication versus authorization

Supabase validates identity/session. Database policies and command guards authorize that identity for the selected business, action, location, object and business lifecycle state.

User-editable metadata may store presentation preferences; it must not grant membership, tenant ownership, operator status or paid entitlements. The active business in local storage is only a navigation selection.

Use authoritative membership records on access paths, including role revocation and suspension. Existing JWT/session validity does not preserve a revoked business permission. API-key identity is separate from signed-in user identity; the browser receives publishable configuration only. [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys)

## Controlled membership operations

- First-business bootstrap requires a valid eligible authenticated identity, server quotas and an idempotent transaction creating the business and its owner membership.
- No caller may bootstrap themselves into an existing business.
- Invitations bind server-selected business, permissible role, scopes, expiry and a hashed token. Acceptance validates intended verified identity and cannot upgrade an invite's role.
- Ownership transfer requires the current owner, an eligible accepted recipient and one atomic transfer. Never remove/revoke the last owner.
- Finance and platform roles cannot be obtained by profile editing.
- Customer self-service uses `client_identity_links`. Do not automatically reveal past records merely because a verified account shares an email/phone with a client; shared contacts need an explicit linking/invitation/review path.

## Row, column and object boundaries

Use grants plus deny-by-default RLS on exposed tables; review both visible rows and allowed inserted/updated ownership. RLS does not replace column separation, function privilege review or file policies. [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)

Sensitive consultation records, compensation and integration credentials live outside ordinary directory rows. Staff receives a purpose-limited assigned-client projection; customer access excludes internal notes and staff compensation. Read-only views/reports must preserve the intended caller scope.

Storage policies resolve business membership or verified customer ownership, not just a caller-provided folder prefix. Public assets are intentionally published copies/metadata; private attachments and exports remain private with short-lived authorized download access.

## Platform operators

A platform operator is a distinct controlled identity, not a business role. Default access is platform metadata only. Tenant-data support requires an approved, purpose-limited, time-limited grant, elevated backend mediation and an immutable audit trail. No universal secret is delivered to an operator browser.

## Required proof in later phases

Use two businesses, one user in both, a non-member, anonymous access, a customer and all default roles. Test direct REST/RPC/Storage access, joins, report aggregates, role changes and location scope, including attempted ownership-column updates and cross-business foreign keys.

This ADR defines security requirements, not an assertion that those policies already exist. [Permission matrix](PERMISSIONS.md) and [API contract](API_CONTRACTS.md) specify the implementation details.

