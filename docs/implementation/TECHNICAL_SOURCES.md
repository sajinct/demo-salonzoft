# Technical source notes

Official sources checked on **2 November 2026**. Recheck versions and provider requirements when implementing each relevant phase. The prompts are Miznora's proposed engineering specification; they do not claim to document Fresha's internal stack.

| Topic | Verified platform fact and design consequence | Official source |
|---|---|---|
| Pages usage | Commercial SaaS and sensitive transactions are outside the intended/allowed Pages use. Restrict the Pages target to a fictional-data demonstration; use an appropriate production host for the real app. | [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| Angular toolchain | Angular versions require compatible Node, TypeScript and RxJS versions. Verify and pin a complete supported toolchain during Phase 01. | [Version compatibility](https://angular.dev/reference/versions) |
| Static deployment | Routing and base paths must match the target hosting environment. | [Angular deployment](https://angular.dev/tools/cli/deployment) |
| Hash routing | Angular provides `withHashLocation()`; use it for the Pages demo to avoid server-side route fallback requirements. | [withHashLocation](https://angular.dev/api/router/withHashLocation) |
| Pages CI | GitHub supports custom build/artifact/deployment workflows for Pages. Verify current official actions and pin reviewed revisions during implementation. | [Custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) |
| Browser keys | Supabase distinguishes public publishable keys from secret/elevated keys. Only publishable configuration belongs in a browser build. | [Supabase API keys](https://supabase.com/docs/guides/getting-started/api-keys) |
| Data access | Database grants and RLS protect exposed data. Design and test business-specific policies and relationships. | [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security) |
| Auth callbacks | Auth redirect destinations are configured in Supabase. Use exact environment URLs and deliberately tested callback handling. | [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls) |
| PKCE | PKCE uses a code exchange and browser-held verifier; same-browser/device flow constraints must be considered in recovery and email-link UX. | [PKCE flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow) |
| Function identity | Edge Functions need an authentication model appropriate to their caller; trusted jobs/webhooks need different validation from user requests. | [Securing Edge Functions](https://supabase.com/docs/guides/functions/auth) |
| Database operations | Supabase exposes Postgres functions; choose invocation privileges deliberately. Domain transactions belong in database functions, with authorization appropriate to the function's execution mode. | [Database functions](https://supabase.com/docs/guides/database/functions) |
| File protection | Storage has separate access-control policies; SQL table protection does not automatically make uploaded files private. | [Storage access control](https://supabase.com/docs/guides/storage/security/access-control) |
| Schema workflow | Capture database changes as versioned migrations and verify them locally before applying to shared environments. | [Database migrations](https://supabase.com/docs/guides/local-development/database-migrations) |
| Booking exclusion | PostgreSQL ranges and exclusion constraints can enforce non-overlap for resources. Select a design supported by the actual Supabase Postgres version. | [PostgreSQL range types](https://www.postgresql.org/docs/current/rangetypes.html) |
| Scheduling | Supabase Cron can run scheduled database work or invoke functions; schedule the backend, not a user's browser. | [Supabase Cron](https://supabase.com/docs/guides/cron) |
| Durable work | Supabase Queues provides Postgres-backed job/message processing. Application-side provider effects still need idempotency and recovery. | [Supabase Queues](https://supabase.com/docs/guides/queues) |

Production hosting provider, payment processor, email/SMS/WhatsApp provider, observability service and accounting integration access have deliberately not been chosen or provisioned.

