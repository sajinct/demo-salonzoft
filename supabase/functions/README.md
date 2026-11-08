# Trusted function authorization

Phase 02 supplies `_shared/authorize.ts`, a reusable user-request boundary. It validates a caller JWT with Supabase Auth and invokes the database authorization RPC using that same caller token. It does not use an elevated service key or trust a decoded/user-editable role. SDK-free fetch injection supports targeted local tests. No callable Edge endpoint is implemented or deployed. Future endpoints must call this boundary, maintain supported platform JWT configuration, and perform domain mutations in one authorized database transaction.
