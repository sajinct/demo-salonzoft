# ADR 006 — Provider ports and environment lifecycle

**Date:** 3 November 2026  
**Status:** Adopted design; vendors and remote resources pending.

## Decision

Define provider-neutral ports for payments, notifications, attachments, imports/exports and accounting. A local fake implements the same contract explicitly for development/tests. A production adapter missing credentials reports unavailable; it cannot report simulated success.

No payment processor, sender, accounting API or AI provider is chosen by this ADR. Phase 16 verifies actual Oman eligibility, OMR units, merchant model and provider terms before connecting anything.

## Trust boundaries

| Caller | Required validation |
|---|---|
| Staff/customer request | Verified Auth identity plus current business/action/location/object authorization |
| Anonymous booking/availability request | Published business/service constraints, bounded fields, anti-abuse limits and ownership/contact verification where required |
| Provider webhook | Provider-specific signature over required raw bytes, replay checks, durable event identity and mapped business account |
| Worker/Cron | Backend-only machine identity, narrow job capability and allowlisted operation; no browser-derived actor override |
| Platform operator | Controlled operator identity, strong authentication, explicit scoped support/admin grant and audit |

A server secret bypassing normal user RLS is not itself proof that a request is authorized. Elevated adapters must bind their mapped business/object scope before calling a command. Never choose a merchant or accounting connection from unverified request metadata.

## Environment separation

Use synthetic local Supabase and separate staging/production projects. No production URL/keys in the Pages demo. Record project references explicitly before remote migrations; deployment defaults must not guess a target.

Keep browser-public URL/publishable key distinct from trusted provider keys, database access, deployment tokens and webhook secrets. Store secrets only in appropriate backend/CI secret facilities, not committed documents or frontend environment files.

Use additive/versioned migrations and generated types. Build compatibility into releases: expand → backfill → switch code → contract after the supported rollback window. A frontend rollback cannot undo an irreversible financial/data migration.

## Jobs and lifecycle

Backend entitlements are separate from UI feature flags. Manual pilot entitlements precede real SaaS billing; subscription webhook events later update controlled entitlements, not user metadata.

Business suspension blocks new ordinary operational writes while preserving permitted read/export access. Verified incoming settlement/refund events and recovery jobs use explicitly scoped system commands so funds are not lost in reconciliation.

Backups/restores must account for database, Storage objects and external configuration independently. Phase 18 defines operational RPO/RTO, verifies chosen plan capabilities and proves restoration in staging. No recovery guarantee is asserted by Phase 00.

## Consequences

Use the contracts in [API_CONTRACTS.md](API_CONTRACTS.md). Future integrations are individually configuration-dependent. Public deployment, paid activation, live charges/messages and remote schema changes remain distinct external actions, never implied by writing implementation code.

