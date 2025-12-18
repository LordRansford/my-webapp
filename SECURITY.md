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
