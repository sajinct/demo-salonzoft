# Database assertions

`02_tenant_security.sql` is the same rollback-only pgTAP suite for `npm run db:test` on a real local Supabase database and `npm run test:db:embedded` on PostgreSQL WASM with managed-schema compatibility fixtures. These are distinct results: an embedded pass is not Auth/REST/Storage integration evidence. `npm run test:backend` separately exercises real loopback Auth, REST, RPC and Storage HTTP services using the synthetic fixtures. Reset before that mutating HTTP suite; no hosted target is accepted. See [setup](../../README.md).
