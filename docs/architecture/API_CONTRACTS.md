# API boundary and provider-neutral contracts

**Status:** Proposed contracts for future implementation. Type sketches are documentation, not compiled source or deployed endpoints.

## 1. Common command transport

Use an operation-specific input DTO with a shared envelope:

```ts
type UUID = string;
type MinorString = string;       // canonical bounded integer, never JS number
type Instant = string;           // ISO timestamp with explicit UTC offset
type CurrencyCode = string;

interface CommandContext {
  businessId: UUID;
  locationId?: UUID;
  idempotencyKey: UUID;          // required for effect-producing commands
  expectedVersion?: number;     // required for mutable existing aggregates
}
interface CommandSuccess<T> {
  data: T;
  version?: number;
  correlationId: string;        // trusted backend-issued trace identifier
}
interface CommandError {
  code: 'UNAUTHENTICATED' | 'NOT_FOUND_OR_FORBIDDEN' | 'VALIDATION_ERROR'
    | 'STALE_VERSION' | 'SLOT_CONFLICT' | 'INSUFFICIENT_BALANCE'
    | 'IDEMPOTENCY_CONFLICT' | 'BUSINESS_UNAVAILABLE'
    | 'PROVIDER_UNAVAILABLE' | 'OUTCOME_PENDING' | 'TRANSIENT_FAILURE';
  messageKey: string;
  fieldErrors?: Record<string, string>;
  retryable: boolean;
  correlationId: string;
}
```

Caller-supplied business/location is context to validate, not authority. Do not accept actor_id, membership role, provider status or final totals as trusted command input.

Expose stable codes and translated message keys instead of raw SQL/provider errors. Avoid leaking whether an inaccessible tenant/object exists. Stale-version and slot-conflict errors need user reconciliation, not blind automatic retries.

## 2. Authentication modes

| Mode | Trust source / restrictions |
|---|---|
| User | backend-validated Supabase session; current membership/customer ownership checked in the command |
| Public | curated gateway/projection, publication/state/anti-abuse policy; no general private-table CRUD |
| Webhook | provider raw signature, replay checks and trusted connection → business mapping |
| Worker | machine capability/leased job, scoped operation and trusted actor type |
| Operator | controlled operator identity plus explicit action/support grant |

Publishable keys identify an application; they do not authenticate a staff member. Elevated secret clients bypass ordinary caller protection and therefore require explicit scoped authorization before use.

## 3. Core command catalogue

Names are stable candidate operation names; migrations define actual signatures/SQL schema in each owning phase.

| Command family | Caller / trusted work | Phase |
|---|---|---|
| bootstrap_business | eligible Auth identity; idempotent new business + owner; no attaching to existing tenant | 02 |
| issue/accept/revoke_invitation | owner/invitee; hashed token, intended identity, role/scope validation | 02 |
| transfer_ownership / set_member_access | current owner; last-owner and revocation constraints | 02 |
| update_business/location/service/staff | capability + location; tenant FKs, archived/version checks | 04 |
| create/update_client / link_client_identity | CRM scope or explicit verified linking flow; protected fields separate | 05/10 |
| preview/commit_import | authorized actor; typed rows, validation, dedupe and fingerprint | 05/11 |
| get_available_slots | internal permitted location; bounded interval and eligibility | 06 |
| create_appointment | staff or constrained public gateway; atomic quote/reservations/history/outbox | 06/10 |
| reschedule_appointment / transition_appointment | capability/ownership; version, locks, cutoff and allowed transition | 06/07/10 |
| set_shift/time_off/blocked_time/closure | same unit locks as booking; reject unhandled existing conflicts | 06 |
| post_sale / record_manual_payment | finance capability; backend amounts, receipt, journal, linked appointment/effects | 08 |
| refund_sale / reverse_payment | approved capability; original eligibility/caps and immutable reversal | 08 |
| open/adjust/close_register | privileged location; float/cash/count/variance integrity | 08 |
| run_report / create_export | allowlisted metric/filter/column scope; no arbitrary SQL | 09/11 |
| request/claim_waitlist_offer | verified ownership or operational capability; TTL + slot reservation atomically | 10 |
| receive/transfer/adjust_stock | authorized locations; immutable movement and balance locks | 12 |
| issue/redeem/reverse_benefit | permitted account/client; currency/eligibility/remaining balance | 13 |
| approve_timesheet/pay_run | pay capability; versioned rules, frozen results, no duplicate earning | 14 |
| redeem_promotion/reward / schedule_campaign | caps, consent and approved spend/scope | 15 |
| create_provider_order / apply_provider_event | trusted adapter; exact amount/account mapping/event uniqueness | 16 |
| send_message / apply_inbound_message | participant or verified provider mapping, dedupe and attachment scope | 17 |
| suspend_business / grant_support / export_or_redact | controlled operator/owner workflow; lifecycle, approval and audit | 18 |

A single command transaction owns all related writes. No UI or Edge orchestration can promise atomic booking/checkout through multiple independent REST mutations.

## 4. Booking command detail

create_appointment input: context, optional clientId or explicit walk-in, requested location/start instant, ordered service-variant IDs, eligible requested staff or any-staff marker, allowed notes/source and any accepted quote version.

The server resolves current authorized context; validates client/location/service relationships; picks/locks eligible units deterministically; resolves continuous MVP service + buffer intervals; computes snapshots; enforces overlap/working-time policies; writes appointment, lines, reservations, status history, audit, idempotent result and outbox.

Result contains appointment ID/version, actual assigned staff and times, quoted Money DTO totals and permitted detail fields. It never returns private staff/customer data unrelated to the operation.

A stale quoted amount requires a clear quote-change response/explicit agreement according to policy; do not silently accept a different public-facing price.

## 5. Checkout and provider transaction detail

post_sale input identifies draft/appointment, eligible line choices, permitted adjustment intent/reason and tender requests. The server revalidates versions, recomputes exact amounts, checks remaining entitlement/stock, posts immutable lines/journal/receipt and effects atomically.

Manual payment is an explicit operational record, not evidence a bank charge occurred. Provider creation first persists a pending payment intent; an external call occurs outside the DB transaction; verified callbacks/reconciliation later settle it through apply_provider_event.

Never hold reservation/stock/financial locks across a provider HTTP call. Unknown external outcomes return pending and schedule reconciliation. Domain-effect unique keys remain enforced even after ordinary command-result retention.

## 6. Provider-neutral ports

Implement adapters only after the relevant phase. Requests are internal validated DTOs; connection credentials are never part of a browser DTO.

```ts
interface Money {
  currency: CurrencyCode;
  minor: MinorString;
}
type ExternalOutcome<T> =
  | { state: 'accepted'; reference: string; detail: T }
  | { state: 'rejected'; reasonCode: string }
  | { state: 'unknown'; reconciliationKey: string };

interface PaymentPort {
  capabilities(connectionId: UUID): Promise<{
    currencyScales: Record<CurrencyCode, number>;
    supportsRefunds: boolean; supportsRecurring: boolean;
    supportsIdempotency: boolean;
  }>;
  createOrder(request: {
    connectionId: UUID; intentId: UUID; amount: Money;
    idempotencyKey: string; approvedReturnUrl: string;
  }): Promise<ExternalOutcome<{ hostedUrl?: string }>>;
  refund(request: {
    connectionId: UUID; refundIntentId: UUID;
    originalReference: string; amount: Money; idempotencyKey: string;
  }): Promise<ExternalOutcome<{}>>;
  reconcile(connectionId: UUID, reference: string): Promise<ExternalOutcome<{}>>;
  verifyWebhook(rawBody: Uint8Array, headers: Record<string,string>):
    Promise<{ connectionId: UUID; eventId: string; kind: string; payload: unknown }>;
}

interface NotificationPort {
  send(request: {
    connectionId: UUID; deliveryId: UUID; idempotencyKey: string;
    channel: 'email' | 'sms' | 'whatsapp'; recipient: string;
    templateVersion: string; language: string; variables: Record<string,string>;
  }): Promise<ExternalOutcome<{}>>;
  reconcile(connectionId: UUID, reference: string): Promise<ExternalOutcome<{}>>;
  verifyDeliveryWebhook(rawBody: Uint8Array, headers: Record<string,string>):
    Promise<{ connectionId: UUID; eventId: string; payload: unknown }>;
}

interface AttachmentPort {
  prepareUpload(request: {
    businessId: UUID; authorizedParentId: UUID; classification: string;
    contentType: string; sizeBytes: number;
  }): Promise<{ attachmentId: UUID; uploadUrl: string; expiresAt: Instant }>;
  authorizeDownload(attachmentId: UUID):
    Promise<{ downloadUrl: string; expiresAt: Instant }>;
}

interface ImportExportPort {
  previewImport(jobId: UUID): Promise<{ validRows: number; invalidRows: number }>;
  commitImport(jobId: UUID, previewFingerprint: string): Promise<{ jobId: UUID }>;
  requestExport(reportKey: string, validatedFilters: unknown):
    Promise<{ jobId: UUID; state: 'queued' | 'ready' }>;
  getExport(jobId: UUID): Promise<{
    state: 'queued' | 'running' | 'ready' | 'failed' | 'expired';
    downloadUrl?: string; expiresAt?: Instant;
  }>;
}

interface AccountingPort {
  capabilities(connectionId: UUID): Promise<{ entities: string[] }>;
  upsertBatch(request: {
    connectionId: UUID; syncJobId: UUID; externalIdempotencyKey: string;
    mappedRecords: unknown[];
  }): Promise<ExternalOutcome<{ checkpoint?: string }>>;
  reconcile(connectionId: UUID, syncJobId: UUID): Promise<ExternalOutcome<{}>>;
}
```

Every port invocation receives authenticated actor/context through its trusted service layer, omitted from signatures only to keep this sketch readable. An attachmentId, connectionId or jobId alone is not permission. Unknown provider payloads are validated against an allowlisted adapter schema before reaching a database command.

Notification adapter acceptance is not delivery. An accounting accepted batch is not a balanced reconciliation. Capabilities gates are checked server-side and may prohibit a channel/currency/recurring flow.

## 7. Bounded reads and pagination

Use keyset/stable ordered pagination for growing histories; bounded calendar date windows; safe normalized search and allowed filters. Views must not permit salary/private-note columns through broad SELECT. Export uses the same permission-filtered dataset as its report and a protected expiring result.

Public availability discloses eligible slots, not raw busy events/customer names. Public profiles contain only published content. Never accept client-defined SQL, column expressions or a caller-selected elevated connection.

## 8. Required contract proofs

Per owning phase: valid round-trip, malformed input, tenant/location/object denial, version conflict, key/fingerprint mismatch, duplicate concurrent request, rollback on failure and no secret-bearing error response.

Exercise callback signatures on raw bytes, mapped merchant ownership, replayed events, reordered statuses and timeout recovery with sandbox fixtures. This Phase 00 document does not assert those tests have run.

