# Threat model (repo-specific)

This is a lightweight threat model tailored to this repo's current architecture and endpoints.

## Assets we care about

- Authentication sessions (NextAuth)
- User progress (CPD state) and history
- Donation receipts and supporter entitlement state
- Template downloads and permission tokens
- Site availability and stability

## Trust boundaries

- **Browser to app**: public pages, tools, and dashboards
- **Authenticated browser to app**: account state, progress writes, premium download actions
- **Third party to app**: Stripe webhook
- **App to external sites**: dashboard APIs that fetch user-supplied URLs, backend score proxy
- **App to local storage**: JSON files under `data/`

## Primary attack surfaces

- **URL fetch endpoints (SSRF risk)**:
  - Pages router dashboard APIs that accept `url` and call `fetch()`
  - `pages/api/scores` proxy (forwards request metadata)
- **Auth endpoints (abuse and account takeover)**:
  - Magic link spam and OAuth login attempts
- **Webhook endpoint**:
  - Signature spoofing or replay, event processing duplication
- **State mutation endpoints**:
  - CPD save
  - Template download and request-download
  - Admin permission token creation and deletion
  - Tool execution endpoints that are logged and rate limited
- **XSS and HTML injection**:
  - KaTeX render output uses `dangerouslySetInnerHTML` and must remain isolated to trusted formula strings
  - MDX is sourced from repo content, not user input

## Existing mitigations in the repo

- **Server-side authorization**: protected routes use `getServerSession(authOptions)`
- **Rate limiting**:
  - `src/lib/security/rateLimit.ts` for auth, checkout, and some protected actions
  - Tool endpoints also have per-IP request limiting and daily usage limits
- **Stripe webhook signature verification**:
  - Webhook verifies `stripe-signature`
  - Processed events are deduped using stored event ids
- **CSRF posture (current)**:
  - NextAuth includes CSRF protection for its auth routes by default.
  - For browser-invoked state-changing API routes, we require same-origin via `Origin` or `Referer` checks.
  - Third-party invoked endpoints (Stripe webhook) do not use origin checks and instead require signature verification.
- **Secrets discipline**:
  - Secrets are loaded from environment variables
  - CI guards block common secret patterns in client code

## Threats and what we aim to do next

- **SSRF**: add a shared URL validation and private network blocking for any endpoint that fetches arbitrary URLs.
- **CSRF**: confirm protections for browser-invoked state-changing endpoints and document rationale where defaults apply.
- **Abuse**: unify rate limiting strategy for state-changing endpoints and external fetch endpoints.
- **Logging**: add minimal structured server logs with request id and route name, without leaking secrets.


