# Salonzoft — Dedicated Single-Salon Deployment Guide

Each salon is deployed with **its own GitHub repository + GitHub Pages website** and **its own dedicated Supabase project**. This keeps every salon's data, branding, pricing, and custom workflows 100% isolated and effortless to customize.

## 1. Customize a New Salon Instance
Edit [`frontend/src/app/core/salon-config.ts`](../../frontend/src/app/core/salon-config.ts) to customize:
- **Salon Identity**: English & Arabic salon name, tagline, WhatsApp contact, currency (`OMR`, `AED`, `SAR`), and branches.
- **Service Catalog & Pricing**: Categories, service names (EN/AR), durations, and prices.
- **Stylists & Specialists**: Team roster, specialties, and chairs/suites.
- **Supabase Connection (Optional)**: Add the salon's dedicated `supabaseUrl` and `supabasePublishableKey` (`anon` key). When left blank, the GitHub Pages site runs with full interactive in-memory state.

## 2. Provision the Salon's Supabase Project
1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** and run [`supabase/single-salon/schema.sql`](schema.sql).
3. Copy the project's `Project URL` and `anon / publishable` key into `frontend/src/app/core/salon-config.ts` (or `frontend/public/app/config.json`).

## 3. Publish on GitHub Pages
Push to `main` — the included GitHub Actions workflow (`.github/workflows/pages-demo.yml`) automatically runs quality checks, builds the Angular application with the repository's base path, and deploys to GitHub Pages.
