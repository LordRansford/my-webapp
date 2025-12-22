# my-webapp

Premium, security-first learning hub for architecture, cybersecurity, and AI. Built with Next.js, MDX-driven
courses, and interactive browser-only labs (RSA keygen, Python WASM sandbox, entropy checks).

## Scope and guardrails

The canonical scope and architecture constraints live in `docs/scope.md`.

## How to contribute without breaking scope

- Keep core learning content accessible without accounts.
- Do not introduce paywalls, subscriptions, or credit metering unless there is an explicitly approved scoped plan.
- Do not move secrets, billing logic, or privileged tokens into client code.
- Prefer small, reversible changes with clear acceptance checks (lint, build, and mobile usability).
- If in doubt, update `docs/scope.md` first and propose a bounded plan.

## Security and data handling

- Dev and AI studios are educational sandboxes, not production. Do not upload real customer data or secrets.
- Uploads are validated client-side for size/type; blocked types are rejected with a friendly error. Tighten limits in `src/utils/validateUpload.ts` as needed.
- Dependencies are monitored via Dependabot and npm audit in CI. High-severity CVEs must be addressed before shipping changes.

## Run it locally

```bash
npm install
npm run dev
```

## Add or edit courses

- Drop new lessons into `content/courses/<course-slug>/<lesson>.mdx`.
- Front matter supports `title`, `description`, `order`, `tags`, `level`, and `duration`.
- MDX can embed React components such as `<RsaPlayground />`, `<PythonPlayground />`, and `<Callout />`.
