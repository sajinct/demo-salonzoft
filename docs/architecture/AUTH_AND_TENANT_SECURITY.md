# Implemented identity and tenant-security contract

**Phase 02 — 3 November 2026.** Source implementation and embedded SQL/browser-fixture checks exist. Full local Supabase/HTTP acceptance is blocked by the missing Docker-compatible runtime. This document describes the actual code, not a deployed service. Phase 03 and operational modules have not started.

## Identity and authority

Supabase Auth owns credentials and global identities. `profiles` contains only a self-editable display name and EN/AR preference. Workspace authority comes from current `business_members`, code-controlled roles/permissions, location scopes and business status. User metadata and cached frontend context never grant permissions. Verified email identity is required for tenant operations; unverified/banned accounts fail the trusted helper.

`staff_members` is a scheduling identity with an optional tenant-qualified `staff_identity_links` relationship to membership. It carries no salary/medical/credential fields. A staff record without login grants no access, and owners do not need staff assignments. Customer identity linking is deliberately absent until its owning phase.

Public tables: profiles, app_roles, app_permissions, role_permissions, businesses, locations, business_members, member_location_scopes, staff_members, staff_identity_links, audit_events and file_objects. The unexposed `app_private` schema contains bootstrap idempotency records, invitation hashes and invitation location scopes. All have RLS enabled; private tables have no browser table grants. Public tenant tables grant SELECT only, except the two explicitly editable profile columns. Membership, role, lifecycle, owner and audit fields have no direct browser mutation grants.

Tenant references use composite keys, including member-location, staff/member links, file locations and invitation/location relationships. Business IDs are immutable on tenant rows. Recursive membership policies are avoided by small security-definer predicates that read authoritative rows with a fixed empty search path and explicit schema names. Internal writer helpers are not executable by user roles. No read-only view bypass is introduced.

## Implemented command API

All public commands are granted to `authenticated`, never anonymous. Definer commands validate verified identity and explicit current authority before writes. No actor ID or editable role claim is trusted. `authorize_workspace` is an invoker boundary for active-workspace user operations; it deliberately does not authorize owner-retention reads on suspended businesses.

| RPC | Actual contract |
|---|---|
| `bootstrap_business(request_id, business_name, location_name)` | One transaction creates business, first location and owner membership; per-identity advisory lock and unique request record make identical retries return one ID. A changed payload/key or second first-business creation fails. It cannot attach to an existing UUID. |
| `get_workspace_context()` | Returns only current verified memberships, their role/permission definitions and authorized locations; revoked authority is omitted. |
| `set_member_access(business_id, user_id, role, scope_mode, location_ids, active)` | Owner-only existing-member change/revocation. Validates tenant-qualified location scope; cannot create owners or demote/remove an owner. |
| `transfer_ownership(business_id, new_owner)` | Canonical owner transfers atomically to an active, verified existing member. Previous canonical owner becomes manager; new owner gains all-location scope. |
| `issue_invitation(business_id, email, role, scope_mode, location_ids)` | Owner issues one seven-day, email-bound non-owner grant. Stores SHA-256 of a random 32-byte token; returns the bearer token once. Reissuing revokes the previous pending invitation for the same business/email. No email is sent. |
| `accept_invitation(token)` | Validates token, current verified Auth email, active business, expiry/revocation and controlled scope. Duplicate successful acceptance does not create/reassign membership. An accepted token cannot reactivate revoked membership or restore an earlier role. |
| `revoke_invitation(business_id, invitation_id)` | Owner revokes a pending invitation. Accepted membership access is changed/revoked through the membership command. |
| `list_business_members`, `list_invitations` | Current owner-only projections; no credential/token hash is returned. Member projection exposes display name and controlled scope, not unrelated profile fields. |
| `register_file(business_id, location_id, extension, public_marketing)` | Authorized owner/manager registers a random object key at a current authorized location. Intentionally public marketing registration is owner-only. Does not upload a file or create client/clinical relationships. |
| `authorize_workspace(business_id, permission, location_id?)` | Checks current database authorization for a caller JWT; unknown capabilities and revoked scope fail generically. |

Membership, invitation, ownership and file-registration writers lock the business first, providing a common serialization order. Bootstrap locks the verified identity. A deferred constraint protects the canonical active owner at transaction end; ordinary membership operations cannot assign an owner role. These transaction/constraint paths pass SQL tests; concurrent multi-connection HTTP bootstrap acceptance remains unrun until a real stack is available.

Already-issued invitations are durable business grants until expiry/revocation, including if ownership changes. The current owner can list and revoke pending invitations. They cannot grant owner status. Changing a member does not revive an already accepted invitation; a new owner-issued invitation is required for reactivation.

Audit events record server-created IDs/times, verified actors, action and bounded server-selected details. Membership/invitation/bootstrap/ownership/file-registration commands append events. Raw tokens, email addresses and provider errors are excluded from audit details. UPDATE/DELETE triggers reject audit rewrites, and browser INSERT is denied. Binary upload/deletion auditing and clinical record workflows are later file-module work.

## Storage boundaries

- `client-files`: private, 5 MiB, PDF/PNG/JPEG/WebP. Reads/writes require an exact `file_objects` registration, current business membership, file capability and matching location scope. Only owner/manager roles initially receive file capabilities. A tenant path prefix alone is insufficient. UPDATE checks both existing and destination authorization; revocation is re-evaluated on later requests.
- `marketing-assets`: intentionally public image bucket, separate from private documents. Only owners register/write keys, and PDF marketing registration is rejected. Public binary URLs intentionally bypass private download authorization.
- These policies currently model scoped workspace documents and future file infrastructure. No client/medical upload screen, customer file access, signed-download feature or clinical-parent association is implemented. Phase 05 must add parent/clinical capability rules before enabling those workflows. A previously issued signed URL would require its own expiry policy; none is issued by this phase.

## Angular and browser sessions

Only local/staging builds include the Auth routes and real Supabase client. Production retains the Phase 01 configuration-error/foundation behavior. The Pages demo retains hash routing and memory fixtures without an Auth SDK, credential screens or network writes.

Registration defaults off in both local Auth configuration and public UI configuration. `MIZNORA_ALLOW_SIGNUP` controls UI visibility only; the authoritative Supabase `auth.enable_signup` setting must also be enabled for a deliberate registration test. Confirmation remains required, and the server minimum password length is 12. Hiding a signup form is not an API security boundary.

`SupabaseGateway` centralizes a typed client with PKCE, `detectSessionInUrl: false`, persistent SDK session storage, token refresh and bounded fetch timeouts. The storage key includes backend host and environment. Stored signed session tokens support restoration; they are not membership authority. Restoration verifies the user with Auth before exposing a protected page. Confirmed 401/403 restoration errors clear local SDK storage; sign-out clears current context, subscriptions, channel state and this environment's session/verifier keys even if logout HTTP cannot complete. This is local-device sign-out, not a promise to terminate every other device.

Exactly one explicit callback handler exchanges a code. Its pending/result promise is reused for duplicate invocations, and callback query values are scrubbed before requests/rendering. A failed/consumed callback requires starting a new flow. Recovery requires the SDK's verified `PASSWORD_RECOVERY` event plus a validated session, not a URL `type` parameter. The reset form's recovery marker lives only in memory: refreshing the password form requires a new recovery link. Confirmation/recovery must finish in the browser where the PKCE verifier was created. No OAuth provider or experimental overlapping-flow strategy is enabled. [Supabase PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [recovery API](https://supabase.com/docs/reference/javascript/auth-resetpasswordforemail).

Return destinations are a small allowlist of relative business/invitation/access routes. Absolute/protocol-relative/encoded paths, arbitrary queries and fragment credentials are rejected. Invitation bearer values use a fragment, are scrubbed and held only in memory across SPA sign-in. Reopening the original invitation link is required after a full reload loses the draft. Referrers are disabled for the app document; no third-party analytics/fonts are added.

Business context clears selected/scoped state before reload, aborts superseded requests and rejects stale responses using a generation counter. Account changes/sign-out clear it immediately. Owner pages re-fetch current context before rendering controls and after mutations; SDK refresh events also revalidate context. Backend checks remain authoritative even if a displayed role becomes stale between requests.

## Common Edge boundary

`supabase/functions/_shared/authorize.ts` rejects requests without a user JWT, verifies identity through Auth, then calls `authorize_workspace` using that same JWT and the configured public key. It never decodes a role into authority or replaces the user with an elevated client. The module has injected-fetch tests and a strict TypeScript check. No callable Edge endpoint or function deployment is added, so a platform/Deno invocation has not been tested.

## Evidence and remaining gate

Three migrations and synthetic seed data execute in PGlite 0.5.14 / PostgreSQL 18.6 with clearly isolated compatibility definitions for the managed Auth/Storage schemas. The pgTAP suite has 87 passing assertions. Catalog introspection produces committed public TypeScript database types, including columns, FK relationships and RPC signatures; unknown function-output nullability is conservative. This is genuine executed-schema generation, but **not** CLI generation from an actual Supabase stack. The configured Supabase local target uses PostgreSQL 17 and still requires its own clean reset, pgTAP and CLI-generated-type checks.

Twelve Chromium scenarios pass: five foundation scenarios and seven real-SDK auth/UI scenarios against intercepted HTTP fixtures. They prove browser/client behavior and RPC wiring, not live Auth-server or Storage-service correctness. `test:backend` is a separate, loopback-only real HTTP suite for synthetic logins, REST denials, invitation binding, real private upload/download, unchanged-JWT revocation and concurrent bootstrap. It refuses missing/remote configuration and has not run here. [Full validation](../implementation/PHASE02_VALIDATION.md).
