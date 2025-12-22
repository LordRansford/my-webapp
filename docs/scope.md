# Scope guardrails and architecture constraints

This document is the canonical scope baseline for Ransford’s Notes. It exists to prevent scope drift, regressions, and accidental decisions that would block a later Android and iOS release.

If a change does not fit this scope, it must be proposed as a new, explicitly scoped plan before implementation.

## Current phase purpose

Ransford’s Notes is a public, free, content-rich learning platform focused on:

- Courses and notes
- Interactive tools and dashboards for practice
- Experimentation and CPD-friendly learning signals

Monetisation is limited to:

- Donations (support the work)
- Credits for advanced computation (planned, not live)
- Paid CPD certificates (planned, not live)

Core educational content must remain accessible without an account.

## In scope for this phase

- Content improvements (accuracy, teaching quality, accessibility)
- Fixes for visibility, usability, performance, and mobile layout defects
- Ethical, privacy-first learning signals (local first; account sync only when explicitly enabled)
- Feedback capture that is optional, unobtrusive, and not publicly exposed
- Assistive tooling that explains existing content (no autonomy, no hidden actions)
- Minimal identity for optional continuity (sign in to save progress), without gating learning

## Out of scope for this phase

- Locking courses or tools behind paywalls or accounts
- Subscription products, upsells, growth hacks, or dark patterns
- Complex role management or community features (comments, forums, messaging)
- Heavy analytics, third-party tracking, or identity-tied behavioural profiling
- Large UI redesigns or wholesale component refactors
- Building native mobile apps (Android or iOS) at this stage
- Premature optimisation that increases complexity without clear user benefit

## Future mobile readiness constraints (Android and iOS later)

Mobile apps are a future goal, but this web codebase must stay mobile-ready now:

- Responsive-first UI. No desktop-only assumptions.
- All critical flows must work on mobile with touch and keyboard navigation.
- Avoid deep coupling between UI and data access. Keep clean boundaries so the same logic can be reused by a later mobile client.
- No reliance on local file system persistence for production data. Any server-side persistence must be durable in the target hosting model.
- Prefer stable, documented HTTP APIs over ad hoc cross-component state.

## Architecture constraints (non-negotiable)

- **No secrets in the client**: never ship API keys, billing secrets, or privileged tokens to browser bundles.
- **No billing logic in the client**: pricing display is fine; charging decisions are server-side only.
- **Separation of concerns**:
  - UI components render and validate input.
  - Compute logic is isolated and testable.
  - Metering logic (credits, limits, quotas) is separate from compute and can be disabled safely.
  - Content and documentation stay in `content/` and `docs/` and do not depend on application state.
- **Service boundary for expensive work**: anything computationally expensive or security-sensitive must sit behind a server route or service interface, with safe defaults and rate limits.
- **Browser computation preferred** where feasible and safe (educational sandboxes, no secrets), to keep the platform accessible and reduce operational cost.
- **Accessibility is not optional**:
  - Keyboard navigation for all interactive elements
  - Screen reader friendly labels and structure
  - Contrast and readable font sizes (including dark mode)
  - No content hidden behind hover-only controls

## The authoritative delivery plan (frozen)

The following implementation plan is the authoritative baseline and must not be silently expanded:

- Phase 1: Defect consolidation and visibility fixes
- Phase 2: Content depth, teaching quality, and CPD readiness
- Phase 3: Feedback loops, learning signals, and pre-accreditation readiness
- Phase 4: Controlled identity, read-only accounts, and future-safe authentication
- Phase 5: Admin visibility, content control, and operational oversight
- Phase 6: AI mentor and feedback intelligence (assistive only, no autonomy)

Any additional work requires a new plan with explicit scope, constraints, and acceptance checks.

## Non-goals

- No native mobile apps yet.
- No aggressive growth hacks.
- No dark patterns.
- No locking core educational content behind accounts.
- No premature optimisation or over-engineering.


