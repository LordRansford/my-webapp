# Known risks (starter list)

This file lists risks we know about right now, including items that are not yet fully mitigated.
Update it as we harden the system and as features evolve.

## SSRF and outbound fetch

- **Risk**: Pages router dashboard APIs accept a user-provided URL and perform `fetch()` from the server.
- **Impact**: Potential access to internal services, metadata endpoints, localhost, or private network ranges. Also potential large response downloads and slow request exhaustion.
- **Current state**: basic protocol validation exists in some endpoints, but private IP blocking is not consistently applied.
- **Planned mitigation**: centralized URL validation, private IP blocking, redirect limits, response size limits, strict timeouts.

Update: Appsec hardening adds shared URL validation and private network blocking for the dashboard fetch endpoints. Remaining work is to unify rate limiting for those endpoints and verify redirect and size limits are consistent across all fetchers.

## Proxying headers to a backend service

- **Risk**: `pages/api/scores` forwards `Authorization` and `cookie` headers to `BACKEND_SCORES_URL`.
- **Impact**: risk of unintended credential forwarding to a misconfigured backend URL.
- **Current state**: depends on operator configuration.
- **Planned mitigation**: restrict allowed backend hostnames or require same-origin and document the deployment expectation.

## JSON file storage

- **Risk**: JSON files are used for auth, billing, and template stores.
- **Impact**: not suitable for multi-instance concurrency without care; risk of corruption under parallel writes; relies on host filesystem security.
- **Current state**: acceptable for early stages; access is controlled by server routes.
- **Planned mitigation**: move to a proper database when operational needs require it, with migrations and backups.

## Admin endpoints

- **Risk**: Admin permission token endpoints exist.
- **Impact**: if access control is incomplete, token issuance could be abused.
- **Current state**: needs review of authorization rules and environment constraints.
- **Planned mitigation**: ensure server-side authorization checks and add audit logging for admin actions.

## KaTeX rendering via dangerouslySetInnerHTML

- **Risk**: KaTeX output is injected as HTML.
- **Impact**: if formula strings ever become user supplied, this could become an XSS vector.
- **Current state**: formulas are sourced from trusted content and components.
- **Planned mitigation**: keep formula sources trusted only; add guardrails that prevent user supplied formula strings from reaching KaTeX.


