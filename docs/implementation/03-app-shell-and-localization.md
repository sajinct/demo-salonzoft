# Phase 03 — App shell and localization

**Dependencies:** 02.

**Objective:** Build the branded operations shell with responsive navigation, accessible components and English/Arabic support.

## Copy-ready implementation prompt

Read `docs/implementation/MASTER_PROMPT.md` and the implementation log. Implement only Phase 03. All master requirements and common deliverables apply.

Implement a cohesive application shell over the working authentication and business context.

## Work

1. Build sidebar/navigation, mobile navigation, location/business switchers, account menu and a routed content layout. Show only implemented and authorized modules; do not populate the app with fake working menus.
2. Define reusable page headers, toolbars, filter panels, searchable lists, tables, pagination, drawers, dialogs, toasts, confirmation patterns, skeletons, empty states and error/retry states.
3. Establish emerald/ivory/charcoal design tokens with gold as a readable accent. Use the actual SVG wordmark and icon. Support operational density without decorative clutter.
4. Implement runtime English/Arabic switching with one coherent translation approach. Include typed/key-checked translations, translated validation messages and persisted user preference.
5. Update document `lang` and `dir`; use logical CSS properties. Keep emails, numbers, codes and phone fields readable inside RTL layouts.
6. Create centralized locale-aware date, time, quantity and money presentation utilities. Locale changes must update displayed formatting; do not assume a static Angular LOCALE_ID automatically follows a runtime toggle.
7. Keep time-zone conversion separate from translation and browser locale. Use the selected business/location zone.
8. Add session-expiry and access-denied UX. Clear business-scoped state and subscriptions when switching businesses or signing out.
9. Build a fictional-data component gallery in demo mode and a minimal real dashboard welcome state in app mode.
10. Make forms keyboard-operable with visible focus, labels, error descriptions, adequate targets and screen-reader announcements for async actions.

## Acceptance and verification

- Navigation and switches work at phone, tablet and desktop sizes.
- Switching between businesses does not retain another business's page data, cached exports or selections.
- English/Arabic screen captures cover sidebar, table, form, drawer, dialog and amount/date fields.
- Dialog focus returns correctly; keyboard users can dismiss overlays and complete forms.
- No unimplemented route implies its feature is operational.
- Demo assets and routes still work under a non-root Pages base path.

Deliver the component/theme layer, translation dictionary, formatting utilities, shell screens, targeted accessibility/RTL checks and usage documentation. Do not implement service or appointment business logic yet.

## Phase completion

Update the implementation log and feature coverage with actual evidence. Report changed artifacts, migration/API changes, commands and results, working user flows and any remaining blockers. Stop before starting the next phase.

