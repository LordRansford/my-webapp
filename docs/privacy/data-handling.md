# Data handling and privacy (identity stage)

- **What we store**
  - Email (for account and certificate ownership)
  - Display name if provided
  - Auth provider identifier (email magic link, Google, GitHub)
  - Created and last login timestamps
  - Progress and CPD activity tied to userId when signed in
  - Certificates (id, course, level, hours, issuedAt, optional learner name)

- **What we do not store**
  - Passwords
  - OAuth tokens client side
  - Tracking pixels or advertising identifiers

- **Sessions**
  - HttpOnly cookies
  - SameSite=Lax, Secure in production
  - Server validated on each request

- **Progress**
  - Anonymous users: local storage only
  - Signed-in users: server-side records; CPD events linked to userId
  - Local-to-account merge is limited; if local progress is critical, export before login

- **Certificates**
  - Issued only when completion rules are met
  - Verification pages show minimal data (no email)

- **Sharing**
  - No third-party sharing of learning data
  - No analytics tied to identity at this stage

