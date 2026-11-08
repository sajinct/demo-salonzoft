# Phase 01 — Repository and delivery foundation

**Dependencies:** 00.

**Objective:** Create the runnable Angular workspace, local Supabase project structure, CI foundation and separate demo build.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 01. All master requirements and common deliverables apply.

Read the Phase 00 decisions and inspect what already exists. Scaffold only missing structure.

## Work

1. Verify a supported stable Angular/CLI release and its Node, TypeScript and RxJS compatibility. Pin versions, package manager and lockfile; record exact commands and prerequisites. Do not use prereleases by accident.
2. Create `frontend/` with strict compilation, standalone components, lazy routing, reactive forms, an error boundary/handler and a minimal branded landing page.
3. Establish one component/theme system. Copy existing SVG assets into the frontend's asset pipeline without replacing the originals.
4. Define `DataAccess` interfaces and separate `demo`, local app, staging app and production app configurations. Demo adapters are explicit synthetic implementations, not fallback paths.
5. The demo build must have no live Supabase endpoint/key, no network write adapter, no real login fields, no personal-data collection and no checkout/provider integrations. Use an obvious fictional-data demonstration notice.
6. Configure demo hash routing and project-relative asset paths/base href. Derive the correct base path for a project repository versus root/custom-domain deployment; do not guess repository names.
7. The real-app build uses a configurable base path and the selected host's SPA-routing requirements. Supply a startup error page for missing public runtime configuration.
8. Initialize the Supabase local configuration, migration/test/function folders and synthetic seed structure. Follow current CLI/local-runtime guidance; document unavailable runtime prerequisites honestly.
9. Add environment examples distinguishing public build configuration from backend-only secrets. Ignore local secret files and generated sensitive outputs.
10. Add CI for clean install, lint, tests, production/demo compilation and static secret/config checks. Prepare, but do not publish, a Pages workflow using official artifact/deploy actions and least permissions.
11. Keep backend migration/deployment workflows separate from public Pages deployment. Never expose deployment tokens to untrusted pull-request builds.
12. Add scripts for type generation, local database reset/testing and quality checks. Scripts that can affect remote databases must require an explicit environment/project target.

## Acceptance and tests

- A clean checkout installs reproducibly and starts the Angular app.
- Demo navigation refreshes successfully under a non-root base path; SVGs and lazy chunks load.
- App mode fails clearly if Supabase configuration is absent, while demo mode works without it.
- No production secret or Supabase live configuration is included in the Pages artifact.
- CI and local checks report actual results; a missing Docker/native runtime is documented, not misreported as a passing database check.

## Deliverables

Working skeleton, local setup README, package/toolchain pins, configuration matrix, scripts and draft workflows. Stop before real authentication or tenant tables.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

