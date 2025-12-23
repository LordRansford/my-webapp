## Hardening checklist (Vercel Preview and Production)

Keep changes small. Verify each stage before merging.

### Auth (NextAuth)
- **Preview and Production env vars (names only)**:
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `GOOGLE_CLIENT_ID` (if Google sign-in is enabled)
  - `GOOGLE_CLIENT_SECRET` (if Google sign-in is enabled)
- **Manual checks**
  - Visit `/api/auth/signin` and confirm it loads.
  - If env vars are missing in Production, confirm server logs show `auth:misconfigured` with missing keys (no values).
  - Confirm no JSON page returns `{"error":"Auth is misconfigured"}`.

### Stripe webhooks
- **Preview and Production env vars (names only)**:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_TEST_ENABLED` (only for test webhook route)
- **Manual checks**
  - Trigger a test webhook in Stripe and confirm the app returns HTTP 200.
  - Confirm server logs show event type and request id only (no payload, no signature value).
  - Confirm webhook replay is safe (duplicate event ids do not duplicate side effects).

### Compute and credits
- **Manual checks**
  - Open `/account/usage` while signed in. Confirm balance and recent runs render.
  - Run a small compute action and confirm:
    - Pre-run estimate is shown
    - Free tier usage is shown first
    - Paid usage shows only when above free
    - Receipt updates after run
  - Trigger an insufficient credits case and confirm:
    - The UI shows a short reason and a suggested fix
    - The server responds with a safe `code` and `message`
    - No stack trace is shown in the UI

### UI checks (navigation and contrast)
- **Manual checks**
  - Header dropdown menus open above the contents nav and remain clickable.
  - Contents nav only appears on pages that need it (notes-style pages).
  - Check a dark mode view (or prefers-color-scheme: dark) and confirm no black-on-black text.
  - Check progress tracker wraps and remains readable on mobile widths.

### Commands
- Lint: `npm run lint`
- Unit tests: `npm run test:data`
- E2E tests: `npm run test:e2e`
- Build: `npm run build`


