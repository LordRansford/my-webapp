# Operations and maintenance

This document describes how to run the repo locally, what CI enforces, and what changes are risky.

## Local development

- Install dependencies: `npm ci`
- Run dev server: `npm run dev`
- Lint and guards: `npm run lint`
- Production build: `npm run build`

## CI structure

CI is designed to fail fast on:
- lint and type issues
- insecure configuration drift
- accidental paywall or payment activation drift

Key workflow: `.github/workflows/ci.yml`

## Guard scripts (do not weaken casually)

These scripts are part of the definition of done for a secure, predictable release.

- **Auth guards**: `scripts/auth-guards.mjs`
  - Prevents password-based auth from being introduced.
- **Monetization guards**: `scripts/monetization-guards.mjs`
  - Blocks live Stripe keys in repo text.
  - Blocks client-side Stripe SDK usage.
  - Ensures checkout endpoints remain explicitly gated.
- **Stripe guards**: `scripts/stripe-guards.mjs`
  - Ensures webhook signature verification and bounded donation amounts.
- **Access guards**: `scripts/access-guards.mjs`
  - Enforces premium asset handling and related constraints.
- **Template definition checks**: `scripts/check-template-definitions.mjs`
  - Prevents broken template registry entries.

## Operational endpoints

- **Health**: `/api/health`
  - Returns a minimal JSON payload to confirm the server is running.

## Performance and UX expectations

Avoid accidental regressions:
- Prefer loading heavy dashboard and tool modules lazily.
- Avoid unthrottled scroll listeners that trigger rerenders on every pixel.
- Avoid `Date.now()`, `Math.random()`, or `crypto.randomUUID()` in render paths that affect markup.
- Ensure tools and dashboards never show a blank screen during async work.

## What not to change casually

- Payment and entitlement enforcement (`src/lib/billing/**`, `src/app/api/stripe/**`)
- Auth and session wiring (`src/lib/auth/**`, `src/app/api/auth/**`)
- Security headers and request protections (`next.config.mjs`, `src/lib/security/**`)
- Guard scripts and CI workflow (`scripts/**`, `.github/workflows/**`)


