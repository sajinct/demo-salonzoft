# ADR 003 — Demo hosting and real-app routing

**Date:** 3 November 2026  
**Status:** Target separation adopted; production host selection pending.

## Decision

Produce two intentionally separate targets:

| Target | Behavior |
|---|---|
| Pages demonstration | Synthetic in-memory adapters, hash routing, no real authentication or personal-data collection, fictional-data notice |
| Real application | Supabase-backed Angular SPA, path routes, an approved host with SPA fallback and appropriate production capabilities |

GitHub Pages' current limits exclude use for commercial SaaS. The real app's production hosting is therefore an explicit external decision. A backend elsewhere or custom domain does not resolve this hosting restriction. [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

No host, repo owner/name, domain or remote URL is invented in Phase 00.

## Routing choice

Demo routes look like `{origin}{basePath}#/calendar`. Derive basePath from the selected repository/root/custom-domain configuration during deployment; it is not always `/`. Use Angular hash routing only in this target.

Real-app routes look like `{origin}{basePath}calendar`. The approved host must serve the SPA entry for supported application deep links while retaining proper missing-asset behavior. Do not use a 404-copy trick to conceal an unsuitable production host.

An unsupported path displays the app's not-found page. Static missing files must not silently return HTML as JavaScript.

## Auth callback design

The real app uses PKCE with one explicit callback handler and automatic URL session detection disabled for code exchange. The handler runs once per callback, exchanges using the SDK's supported API, clears sensitive query parameters and only then navigates to a validated local destination.

Use exact environment allowlists for `auth/callback` and `auth/recovery-callback` under the real base path. Invitation acceptance validates its own server token before membership creation. A callback path or query string does not grant a role, customer record or password-reset authority.

PKCE relies on a verifier associated with the originating browser; missing/expired/consumed verifiers require a clear retry path rather than silent authentication bypass. [Supabase PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow)

Recovery must validate the returned Supabase session/SDK recovery context before changing a password. Never infer authorization from `type=recovery` alone. OAuth and alternative OTP flows remain provider/configuration dependent.

## Consequences

- Demo/auth adapters are selected at build/configuration boundaries; production cannot silently fall back to synthetic identity.
- The demo artifact has no real Supabase configuration, provider credentials or real account collection.
- Real app mode fails clearly on absent/invalid required configuration.
- Test deep links, nested assets, callback refresh, repeated code exchange, expired sessions and malicious return URLs separately for each applicable environment.
- Phase 01 prepares build targets/workflows. Phase 19 verifies publication or release only when the corresponding external authorization and configuration exist.

See [routes/environment contract](ROUTES_AND_ENVIRONMENTS.md).

