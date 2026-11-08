# Phase 01 validation record

**Date:** 3 November 2026, Asia/Calcutta.  
**Scope:** repository/delivery foundation only. Safe local implementation is complete. Database runtime execution is blocked by missing Docker/Podman; hosted delivery is prepared and unrun.

## Baseline and dependency evidence

Read the master, selected Phase 01 prompt, Phase 00 implementation log/coverage, architecture index, six ADRs and routes/configuration contract. Phase 00 was complete before scaffolding. No applicable AGENTS.md was found. No subagents were used. The Sites skill's portable repository/installer/local-preview workflow was used; no Site was created, registered or published.

The workspace initially contained 53 files and no Git repository, Angular app or Supabase project structure. A SHA-256 baseline was captured. All 10 original brand assets remain unchanged, as do the source brief, reference analysis, numbered prompts and master prompt. Three existing planning files are intentionally updated: implementation log, feature coverage and the decisions register (local toolchain/runtime observations). No pre-existing file is removed. The three frontend SVG copies match their root masters byte-for-byte.

## Toolchain selection and installation

- Angular/CLI/build/compiler 22.2.4, Material/CDK 22.2.5, Node 24.22.1, npm 12.2.1, TypeScript 6.0.2, RxJS 7.8.2, Vitest 5.1.0, Playwright 1.64.1, Supabase CLI 3.0.0 and SDK 2.118.0 are pinned. Root lockfile version 3 matches the two workspace manifests' dependency pins.
- Official [Angular compatibility](https://angular.dev/reference/versions), registry package versions/engines/peers, [Supabase local development](https://supabase.com/docs/guides/local-development) and [CLI v3 changes](https://supabase.com/docs/guides/local-development/cli/migrating-to-v3) were checked. TypeScript 7 was excluded because it is outside Angular 22's supported range.
- Existing system Node 20.10.0 was not used for application verification. The desktop-bundled Node executable was `C:/Users/sajin/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` (24.22.1). npm 12.2.1 was installed in ignored `.cache/toolchain/npm/`, with an ignored command-local shim selecting that Node. PATH/cache overrides affected only task commands; no global/system Node/npm installation was changed.
- Initial sandbox registry access stalled; an authorized network-enabled retry succeeded. All package downloads came from the configured npm registry. The Sites installer helper first caught a missing root preinstall script; `check-toolchain.mjs` was added and installation succeeded.
- Angular scaffold command: `npm exec --yes --package=@angular/cli@22.2.4 -- ng new miznora --directory frontend --routing --style=scss --standalone --strict --skip-git --skip-install --package-manager=npm --defaults --ssr=false --interactive=false` (invoked with the selected Node and workspace-local npm cache). Only missing application structure was generated.
- The Sites `install-dependencies.mjs` helper was run again with the lockfile present, `npm_config_offline=true`, repository-local npm cache and audit/fund disabled. It performed **npm ci**, exit 0, added 411 packages, and ran the exact Node/npm preinstall verifier. This validates a clean reinstall from cached registry content, not a second fresh Internet download. Lockfile SHA-256 before and after: `5061aeb118769150e8c8b66ba27573a09a6f05d5f3bd9bc96d2f70627e02554c`.
- npm 12 reported four dependency lifecycle scripts blocked by its default policy: parcel watcher, esbuild, lmdb and msgpackr-extract. No blanket allowance was granted. Subsequent builds and tests succeeded using distributed binaries. See [npm install-script policy](https://docs.npmjs.com/cli/v12/commands/npm-install-scripts/).

## Actual verification

| Command / check | Actual result |
|---|---|
| `npm run quality` | Exit 0: ESLint with zero warnings, strict app/spec TypeScript, 4 Node script tests, 7 Vitest tests, source secret-pattern scan |
| `npm run build:demo -- --base-path /phase-01-preview/` | Exit 0; optimized initial JS/CSS 352.95 kB; overview/guide/not-found lazy chunks |
| `npm run build:production -- --base-path /app-preview/` | Exit 0; initial JS/CSS 351.43 kB; absent configuration deliberately produces setup-error behavior |
| `npm run build:local` | Exit 0; unoptimized build with source maps, no production bundle-size budget |
| `npm run build:staging` | Exit 0; optimized build with a distinct environment binding |
| `npm run check:demo` | Exit 0; explicit demo adapter present, no real app adapter/SDK in emitted dependency graph, no public backend config, endpoint/key, JWT, `.env` or source map in Pages artifact |
| Demo artifact negative tests | Configuration file, embedded synthetic key and SDK dependency each rejected; temporary fixtures removed |
| `npm run test:e2e` | Final run exit 0: **5 passed in 8.3 seconds**, Chromium 156.0.8078.4 / Playwright browser revision 1248 |
| Final `npm run lint` after test-harness change | Exit 0; direct IPC test-server cleanup verified by successful E2E process exit |
| `npm start` | Angular watch server started at `http://127.0.0.1:4200/`; HTTP readiness returned 200 |
| Local browser preview | Requested through `open_in_codex`; app returned queued. Independently inspected with local Chromium and screenshots |
| Visual/RTL checks | Desktop EN/AR and 390 px Arabic mobile screenshots inspected; no horizontal overflow; Arabic Material selection overlay computed direction `rtl` |
| SVG checks | All 3 root/frontend copied SVGs matched SHA-256; all requested SVGs returned 200 and image/svg+xml in non-root browser tests |
| Original-file preservation | 53-file baseline compared; only the three documented planning updates allowed; no missing original file |
| Documentation links | 24 local Markdown links in setup/log/coverage/validation documents resolved successfully; validation script rerun with explicit UTF-8 after the Windows default encoding rejected Unicode |
| Final cleanup | Local TCP probes confirmed ports 4173, 4174 and 4200 closed |

Browser tests exercise demo hash deep-link refresh and lazy chunk loading, changing/resetting a fictional workspace, selection reset on reload, unknown routes, all SVG paths, no demo config artifact, missing assets returning 404, mobile Arabic/RTL, real-app deep-link refresh with missing config, and a valid **synthetic public config injected only by the test**. App mode exposes no demo selection, and neither the demo walkthrough nor configured app test makes backend requests. No real endpoint/key is supplied. These checks are not authentication/RLS or production-host acceptance.

The first artifact check used an incorrect Angular statistics filename; corrected to Angular 22's `browser-stats.json`. Its source-map input names retain the original provider filename despite replacement, so the guard verifies adapter/SDK dependencies and explicit demo presence rather than incorrectly rejecting that virtual name. A local build initially inherited production size budgets; corrected for the unoptimized local configuration. The first browser suite passed assertions but Windows Playwright process-tree teardown hung; only the two known test-server PIDs were stopped. The test runner now owns direct Node child processes, waits for IPC readiness and shuts them down through IPC. The rerun exited normally with all five tests passing. An ESLint missing timer-global finding in this new harness was fixed using explicit Node timer imports before that successful rerun.

## Database and remote checks: honest boundaries

- `supabase init` via local CLI 3.0.0: exit 0. It generated `supabase/config.toml`. Reviewed local changes disable automatic public-table exposure and reserve exact local Angular callback URLs; no callback handler/Auth workflow is implemented.
- `supabase --version`, `init --help`, `db reset --help`, `db push --help` and `gen types typescript --help`: exit 0. Current v3 local-default and `--remote=<ref>` behavior informed the wrappers. CLI home/telemetry were directed to ignored workspace cache after an initial user-profile telemetry write was denied; no external credential store was accessed.
- `npm run db:status`: **exit 1**, CLI reports `docker: command not found (podman also not found) — install Docker Desktop or Podman and ensure it is on PATH`. No local database was started.
- `npm run db:test`: **exit 1 by design**, because no Phase 02 SQL assertions exist. An empty suite is not called a pass.
- `npm run backend:release` without arguments: **exit 1 by design**, explicit environment required. Unit tests additionally reject missing, mismatched, malformed or demo remote targets before CLI execution.
- Database start/reset/type generation, migration execution, RLS/direct-API/Storage tests and Edge Function tests were **not run**. There are no schema migrations, RPCs, policies, generated database types or deployed functions in this phase. Synthetic seed SQL contains only comments; real role fixtures are Phase 02 work.
- Hosted GitHub Actions, Pages publication, backend dry-run connection, remote application, auth callbacks, provider delivery, backups and production performance were **not run**. Workflow syntax/static inspection is not a hosted CI run.
- A supplemental YAML-parser check was attempted but could not run: neither workspace Node nor system/bundled Python has a YAML parser installed. No parser or GitHub workflow-run success is claimed; the three workflows were manually inspected. This does not change the passing Angular/script/browser results.

Official GitHub Action tags were resolved through the official GitHub API to immutable commits: checkout v6 `d23441a48e516b6c34aea4fa41551a30e30af803`, setup-node v6 `249970729cb0ef3589644e2896645e5dc5ba9c38`, configure-pages v5 `983d7736d9b0ae728b81ab479565c72886d7745b`, upload-pages-artifact v4 `7b1f4a764d45c48632c6b24a0339c27f5614fb0b`, deploy-pages v4 `d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e`. [Official Pages workflow guidance](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Outstanding infrastructure

1. For actual local DB execution: install/start Docker Desktop or Podman, expose its CLI on PATH and ensure an operational engine. Then Phase 02 can run the local reset and real schema/tenant-security suite.
2. For hosted app access: actual distinct local/staging/production backend configuration, Supabase project ownership/reference/region and public URL/publishable key. None is invented.
3. For CI/Pages: actual GitHub repository/default branch, configured Pages source and protected `github-pages` environment, plus publication authorization. No Git repository/remote was created here.
4. For backend planning: actual protected staging/production environments, matching `SUPABASE_PROJECT_REF`, `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, and executable reviewed migrations/tests. No remote apply path is implemented.
5. For real app release: selected suitable commercial host/domain, SPA fallback and exact environment-specific Auth redirects. Provider secrets are later-phase inputs, unnecessary for this foundation.

All owned preview/test servers are stopped during final teardown. No repository, account, hosted project, deployment, charge or external message was created. Only package/browser downloads, public documentation reads and GitHub metadata reads used external services. Phase 02 was not started.
