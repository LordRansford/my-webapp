## Stage D — UX, auth, mentor, reliability hardening notes

### What changed

- **Auth**
  - Added **Email magic link** provider (passwordless) alongside Google OAuth.
  - Magic links expire in **15 minutes**.
  - Sign-in error handling routes to `/signin` with friendly messaging.
  - Env validation now includes `EMAIL_SERVER` and `EMAIL_FROM` when email auth is configured.

- **Mentor**
  - Mentor now returns **structured refusal guidance** when it cannot answer from site content:
    - `refusalReason` (code + message)
    - `suggestedNextActions[]`
  - UI renders these so users get a clear next step.

- **Compute / credits UX**
  - Added machine-readable `failureReason` fields to blocked compute and insufficient credits responses (response layer only).

- **Navigation + notes UX**
  - Contents sidebar now renders only on **notes-style routes** (unless explicitly overridden).
  - Progress tracker layout uses a responsive grid to evenly distribute steps.

- **Contact**
  - Contact form posts to a server endpoint (`/api/contact/request`) with rate limiting and a CAPTCHA stub.
  - WhatsApp uses a server redirect endpoint (`/api/contact/whatsapp`) so the number is not embedded in frontend code.

- **Spotify playback**
  - Added an opt-in Spotify mini player (non-blocking, persists across navigation).
  - Controlled via `NEXT_PUBLIC_SPOTIFY_EMBED_URL`.

- **Dashboards export**
  - Added **Export CSV** and **Export PNG** controls in `DashboardFrame`:
    - PNG uses `html2canvas` at runtime.
    - CSV exports the first visible dashboard `<table>` when present.

### Why
- Reduce user confusion on auth errors, mentor “dead ends”, and compute failures.
- Improve reliability and clarity without changing pricing/limits/runner logic.
- Add export and contact paths without exposing sensitive personal details in the codebase.

### What to verify on Vercel Preview

Auth:
- `/signin` shows Google if configured, Email if configured.
- Email link shows “check your email” message (`/signin?check=1`).
- Misconfiguration errors show friendly copy (no raw JSON error page).

Mentor:
- Ask an off-page question and confirm you see `Why I could not answer from the site` + suggested next actions.

Compute:
- Trigger a blocked run and confirm UI shows a clear reason and hint.

Navigation:
- Contents sidebar appears on `/ai/*`, `/data/*`, `/cybersecurity/*`, `/software-architecture/*`, `/digitalisation/*` and stays off elsewhere.

Contact:
- Submit the contact form and confirm it returns a generic success.
- `/api/contact/whatsapp` redirects when configured.

Spotify:
- If `NEXT_PUBLIC_SPOTIFY_EMBED_URL` is set, opt in and confirm playback persists across navigation.

Dashboards:
- Open a dashboard and export PNG.
- If the dashboard has a table, export CSV.

### New/updated env vars (names only)
- `EMAIL_SERVER`
- `EMAIL_FROM`
- `WHATSAPP_CHAT_NUMBER`
- `CAPTCHA_ENABLED`
- `NEXT_PUBLIC_SPOTIFY_EMBED_URL`


