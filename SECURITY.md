# Security Policy

## Supported versions

This repository is under active development. Security fixes land on the default branch.

## Reporting a vulnerability

Please email `security@<domain>` with:

- A clear description of the issue
- Reproduction steps
- Impact and affected routes or files
- Any suggested fix (optional)

If the report is credible, we will acknowledge receipt and aim to provide a timeline for a fix.

## What this project is

RansfordsNotes is a Next.js education site that includes:

- Static and MDX-based learning content
- Interactive tools and dashboards
- Passwordless authentication (magic link and OAuth)
- Donation checkout (Stripe) and server-side receipts

## Data we store

Server-side storage uses JSON files under `data/` (location controlled by env where applicable).
We store:

- Auth users, accounts, sessions, and verification tokens (NextAuth adapter)
- CPD state for authenticated users
- Billing records (plan, tool runs, template downloads, donation receipts)
- Template permission tokens and download records

We do not store:

- Passwords (passwordless only)
- Card details (Stripe handles payment data)
- IP addresses as persisted records (we use short-lived in-memory rate limiting keyed by a hashed value)

## High-level security controls

- Server-side enforcement using `getServerSession(authOptions)` for protected actions
- Rate limiting for sensitive endpoints using `src/lib/security/rateLimit.ts`
- Stripe webhooks require signature verification
- CI guard scripts to prevent:
  - Auth secrets in client code
  - Unsafe Stripe usage and live keys
  - Regressions in access control wiring

# Security Guidelines

Ransford’s Notes is an educational sandbox, not a production SaaS. Everything here currently runs client side only. Please keep these guardrails in mind:

- **Never paste real secrets, passwords, access tokens, API keys or live customer data** into any tool, lab or studio.
- All execution is in-browser for learning. Nothing is sent to a backend or third party unless explicitly added later.
- Generated code and templates are for teaching, not production compliance.

Planned hardening when a backend is introduced:

- Enforce authentication, authorization, rate limiting and audit logging server side.
- Terminate TLS everywhere; add CSP, HSTS and secure cookies.
- Validate and sanitize all inputs server side; store secrets only in server environment variables or a vault.
- Add security scanning in CI/CD, including SAST/DAST where appropriate.
