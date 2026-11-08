# Identity and tenant-security migrations

Phase 02 adds three ordered migrations: identity/authorization tables and grants; controlled identity commands; private Storage and intentionally public marketing boundaries. See [the actual security contract](../../docs/architecture/AUTH_AND_TENANT_SECURITY.md). They have been applied only in an ephemeral embedded PostgreSQL test harness so far, not a real local/staging Supabase stack. Never edit a shared applied migration; append a new migration after the first shared application.
