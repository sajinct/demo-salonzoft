# Salonzoft

**Current brand:** Salonzoft. [Logo and icon assets](docs/branding/README.md).

Phase 02 adds local/staging Supabase authentication, tenant-security migrations and owner access management to the Phase 01 foundation. Its full Supabase acceptance remains blocked by the missing Docker-compatible runtime. The demo stays isolated; bookings, clients and checkout are not implemented. Read the [implementation log](docs/implementation/IMPLEMENTATION_LOG.md), [Phase 02 setup](docs/runbooks/PHASE02_LOCAL_SETUP.md) and [actual security contract](docs/architecture/AUTH_AND_TENANT_SECURITY.md).

## Prerequisites and pinned versions

Use **Node 24.22.1 and npm 12.2.1**. `.node-version`, `.nvmrc`, package engines, the preinstall check and the root lockfile agree. Install/select Node through your normal version manager, then install the specified npm if needed (`npm install --global npm@12.2.1 --ignore-scripts`). Do not use the previously observed system Node 20.10.0.

| Dependency | Exact version |
|---|---|
| Angular / CLI / build / compiler | 22.2.4 |
| Material / CDK | 22.2.5 |
| TypeScript / RxJS | 6.0.2 / 7.8.2 |
| Vitest / Playwright | 5.1.0 / 1.64.1 |
| Supabase CLI / JS SDK | 3.0.0 / 2.118.0 |
| Embedded PostgreSQL / pgTAP extension packages | PGlite 0.5.14 / pglite-pgtap 0.0.15 |

The [Angular compatibility table](https://angular.dev/reference/versions) supports Angular 22 with Node 24.15+, TypeScript 6.0 and RxJS 7.4+. The newer TypeScript 7 was deliberately excluded. npm 12 blocks dependency install scripts by default; this workspace currently builds using the distributed platform binaries without granting a blanket script allowance. Review any new native dependency before approving its scripts.

## Run the demo

From the repository root:

```sh
npm ci --no-audit --no-fund
npm start
```

Open `http://127.0.0.1:4200/`. No credentials or database are needed. Choose Noura Studio or Waha Wellness, reset the selection, open the workspace guide, refresh, and switch to Arabic. Selection is in memory, resets on reload, and never writes to a backend or browser storage. There are no login, personal-data or payment forms.

The original root SVGs remain the masters. `assets:sync`, build and start copy them byte-for-byte to `frontend/public/brand/`; the Angular asset pipeline publishes them as relative `assets/brand/` URLs. Do not edit these copies independently.

## App configuration

App builds **never fall back to demo data**. Set the selected environment’s two public variables before building or running `npm run start:app`:

```powershell
$env:MIZNORA_SUPABASE_URL = '<actual backend origin>'
$env:MIZNORA_SUPABASE_PUBLISHABLE_KEY = '<actual publishable key>'
npm run start:app
```

The placeholders above are instructions, not working credentials. No project has been provisioned. Both variables must be supplied together or left absent. `sb_publishable_` keys are accepted; elevated keys and legacy JWT keys are rejected. HTTPS is required except for local loopback HTTP. URL paths, embedded credentials, queries and fragments are rejected.

Build/start generates ignored `frontend/public/app/config.json`. The real app fetches it relative to its base with no-store caching and a five-second timeout; missing/invalid/mismatched configuration renders a setup error. Local/staging initialize the typed SDK and verify restored sessions with Auth before protected pages. Business access uses current database membership through typed RPC adapters. Production deliberately retains the foundation without Auth routes/client initialization because Phase 02 is local/staging only. A valid config does not prove connectivity. See [setup and exact callback settings](docs/runbooks/PHASE02_LOCAL_SETUP.md).

For runtime injection by an approved host, the public file shape is:

```json
{
  "environment": "staging",
  "supabaseUrl": "",
  "supabasePublishableKey": "",
  "allowSignup": false
}
```

Empty values intentionally show the error page. Replace them only with actual public project configuration; match `environment` to the build. A `.env.example` documents classification; scripts do not automatically load `.env`. Keep deployment/provider/database secrets in protected backend environments. Nothing named in frontend configuration is confidential.

| Build | Adapter | Routes | Public configuration | Output |
|---|---|---|---|---|
| `build:demo` | synthetic memory only | hash | excluded from artifact | `dist/demo/browser/` |
| `build:local` | real SDK/Auth and authorized business RPCs | path | local, loopback HTTP permitted | `dist/local/browser/` |
| `build:staging` | real SDK/Auth and authorized business RPCs | path | staging, HTTPS | `dist/staging/browser/` |
| `build:production` | foundation only; Phase 02 Auth excluded | path | production, HTTPS | `dist/production/browser/` |

All builds accept `-- --base-path /chosen/path/`. Default is `/`; `DEMO_BASE_PATH` or `APP_BASE_PATH` can override it. Do not supply an origin. For Pages, the draft workflow obtains the base path from `configure-pages` metadata: `/` for root/custom-domain sites or the actual repository subpath. No owner/repository/domain is hardcoded.

Real hosting must serve the SPA entry for extensionless app deep links under its base while returning 404 for missing `.js`, `.svg`, `.json` and other files. Configure this on the selected host; the local `static-server.mjs` models it for verification. Commercial app hosting remains undecided. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) restrict commercial SaaS hosting, so Pages is reserved for the isolated demo.

## Local Supabase

`supabase/config.toml` was generated by CLI 3.0.0, with local identifier `miznora`, Postgres 17, local ports 54320–54324 and auto-exposure of new public tables disabled. This is a local identifier, not a hosted project reference. CLI telemetry/cache state is directed into ignored `.cache/supabase-cli/` by the scripts. No remote is linked.

On Windows, install and start a Docker-compatible runtime (Docker Desktop or Podman), ensure its CLI is on PATH and that the engine is reachable. The [current local-runtime guidance](https://supabase.com/docs/guides/local-development) requires a container runtime on Windows; experimental native runtimes support other platforms. Docker/Podman are missing in the current workspace environment.

```sh
npm run db:start
npm run db:status
npm run db:reset
npm run db:types
npm run db:test
npm run db:stop
```

`db:reset` explicitly acknowledges a **local** reset in its script. Every database wrapper requires `--local` and rejects arbitrary/remote flags. CLI v3 uses local targets by default; removed v2 `--local` CLI flags are not forwarded. `db:types` writes `frontend/src/app/core/api/database.types.ts` only after a successful actual local query. Currently committed types were generated by catalog introspection of the executed migrations in embedded PostgreSQL; `db:types:embedded` regenerates them and `db:types:check` checks drift. Their provenance is explicit and is not a claimed Supabase CLI result.

Phase 02 provides **three migrations**, controlled identity RPCs, RLS/grants, two Storage buckets and synthetic seeds with two businesses/multiple roles/locations. No callable Edge endpoint, client/clinical workflow or operational module is implemented. `test:db:embedded` executes the migrations, seeds and 87 rollback-only SQL assertions in PostgreSQL WASM with managed-schema compatibility fixtures. It cannot prove Auth/REST/Storage HTTP behavior. `test:backend` is a separate real-loopback-stack suite requiring explicit local public test configuration; it refuses remote targets. Current `db:test`/`db:types` fail because the real local database is absent. See [Phase 02 validation](docs/implementation/PHASE02_VALIDATION.md) and [CLI v3 guidance](https://supabase.com/docs/guides/local-development/cli/migrating-to-v3).

## Verification

```sh
npm run quality
npm run build:demo -- --base-path /phase-01-preview/
npm run build:production -- --base-path /app-preview/
npm run build:local
npm run build:staging -- --base-path /auth-preview/
npm run check:demo
npx playwright install chromium
npm run test:e2e
```

The E2E runner owns three static servers (ports 4173/4174/4175) and shuts them down through IPC. It expects the non-root builds above. Twelve tests cover five foundation flows and seven real-SDK Auth/UI flows against intercepted HTTP fixtures: sign-in/out/restoration, confirmation, PKCE/recovery, callback failures, owner controls, invitation acceptance, empty/error/denied states and Arabic RTL. These are client/RPC-wiring checks, not real Auth-server proof. `quality` additionally runs lint, strict app/spec/Edge types, 19 unit/script tests, 87 embedded SQL assertions, generated-type drift and a source secret-pattern scan. `check:demo` inspects emitted files/dependencies; Angular may include unused component style metadata, but Auth TypeScript/templates and SDK dependencies are forbidden. Full [Phase 02 evidence](docs/implementation/PHASE02_VALIDATION.md); [Phase 01 history](docs/implementation/PHASE01_VALIDATION.md).

## Draft delivery workflows

- `ci.yml`: push/PR clean install, lint, strict types, embedded SQL, all four compilations, demo/secret checks and Chromium E2E; a separate Docker-capable job prepares real local reset/pgTAP/CLI-type checks. No deployment secrets are referenced. Neither hosted job has run in this task.
- `pages-demo.yml`: manual, default-branch-only demo publication using official configure/upload/deploy actions, immutable action SHAs, read-only build permissions and a separate least-privilege deploy job. Prepared only; never run in this task. See [official Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- `backend-release.yml`: separate manual, protected staging/production **migration plan only**. Requires an explicit project reference matching that environment’s `SUPABASE_PROJECT_REF`, then its `SUPABASE_ACCESS_TOKEN` and `SUPABASE_DB_PASSWORD`. It permits only dry-run planning and has no apply/reset/function deployment path. Full local-stack Phase 02 acceptance is still pending; no remote planning/application was performed. No secrets reach PR jobs or Pages.

Before any publication: create/choose the actual GitHub repository/default branch, configure Pages source as Actions and protected `github-pages` environment, and obtain authorization to publish. Before remote backend planning: choose real staging/production projects and set protected environment variables/secrets. Before commercial release: select the approved host/domain, SPA fallback and exact auth callback configuration. These are absent, not guessed. No repository, remote, account, deployment or paid service was created by this phase.
