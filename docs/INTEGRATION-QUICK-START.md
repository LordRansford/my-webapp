# Quick Start: Essential Integrations

**Time:** ~1 hour | **Cost:** Free | **Difficulty:** Beginner-friendly

## What You'll Set Up

1. ✅ **Error Tracking (Sentry)** - See errors before users report them
2. ✅ **File Storage (Vercel Blob)** - Enable file downloads

---

## 🚀 Quick Setup (30 minutes)

### Part 1: Sentry Error Tracking (15 min)

1. **Sign up:** https://sentry.io/signup
2. **Create project:** Choose "Next.js"
3. **Copy DSN:** Look for the long URL starting with `https://`
4. **Add to `.env.local`:**
   ```
   NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
   ```
5. **Install:**
   ```bash
   npm install @sentry/nextjs
   npx @sentry/wizard@latest -i nextjs
   ```
6. **Done!** Errors will now appear in Sentry dashboard

**Full guide:** See `docs/INTEGRATION-GUIDE-NON-TECHNICAL.md` Section 1

---

### Part 2: Vercel Blob Storage (15 min)

1. **Sign up:** https://vercel.com/signup (or log in)
2. **Create Blob store:**
   - Go to Settings → Storage
   - Click "Create Database" → Select "Blob"
   - Name it (e.g., "support-attachments")
   - Choose region
3. **Copy token:** Look for `BLOB_READ_WRITE_TOKEN`
4. **Add to `.env.local`:**
   ```
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```
5. **Install:**
   ```bash
   npm install @vercel/blob
   ```
6. **Restart server:** `npm run dev`
7. **Done!** File downloads now work

**Full guide:** See `docs/INTEGRATION-GUIDE-NON-TECHNICAL.md` Section 2

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Sentry dashboard shows your project
- [ ] `.env.local` has both `NEXT_PUBLIC_SENTRY_DSN` and `BLOB_READ_WRITE_TOKEN`
- [ ] No errors in terminal when running `npm run dev`
- [ ] Can access Sentry dashboard: https://sentry.io
- [ ] Can access Vercel dashboard: https://vercel.com/dashboard

---

## 🆘 Need Help?

- **Stuck?** See the full guide: `docs/INTEGRATION-GUIDE-NON-TECHNICAL.md`
- **Sentry support:** https://sentry.io/support/
- **Vercel support:** https://vercel.com/support

---

**That's it!** You're all set. The code changes are already done - you just needed to configure the services.
