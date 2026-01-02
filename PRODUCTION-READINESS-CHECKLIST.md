# 🚨 PRODUCTION READINESS CHECKLIST

## ⚠️ CRITICAL BLOCKERS (Must Fix Before Going Live)

### 1. Database Setup - **REQUIRED**

**Current Problem:**
- App uses SQLite (`file:./data/dev.db`) - **WON'T WORK on Vercel**
- App uses JSON files in `data/` directory - **WON'T WORK on Vercel**
- Vercel filesystem is **read-only** (except `/tmp`)

**What's Using Files:**
- ✅ NextAuth adapter → JSON files (`data/auth.json`)
- ✅ Billing/credits → JSON files (`data/billing-store.json`)
- ✅ Analytics → JSON files (`data/learning-analytics.json`)
- ✅ Learning records → JSON files (`data/learning-records.json`)
- ✅ Feedback → JSON files (`data/feedback.json`)
- ✅ Prisma → SQLite file (`data/dev.db`)

**Solution:**
1. **Set up PostgreSQL database:**
   - **Vercel Postgres** (easiest - integrated)
   - **Supabase** (free tier, good for start)
   - **Neon** (serverless Postgres)
   - **Railway** (simple setup)

2. **Update Prisma schema:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Add DATABASE_URL to Vercel:**
   ```
   DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
   ```

4. **Run migrations:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

**Time to fix:** ~15-30 minutes

---

## ✅ Already Configured

- ✅ Sentry error tracking
- ✅ Vercel Blob storage
- ✅ Code structure ready
- ✅ Stripe integration code
- ✅ Google OAuth code

---

## 🔴 Required Environment Variables (Vercel Production)

### Core Authentication
```bash
NEXTAUTH_SECRET=<generate-a-strong-random-secret>  # ✅ REQUIRED
NEXTAUTH_URL=https://www.ransfordsnotes.com  # Your production domain
GOOGLE_CLIENT_ID=<get-from-google>
GOOGLE_CLIENT_SECRET=<get-from-google>
NEXT_PUBLIC_SITE_URL=https://www.ransfordsnotes.com
```

### Database (CRITICAL - Missing!)
```bash
DATABASE_URL=postgresql://...  # ⚠️ MUST SET UP POSTGRESQL FIRST
```

### Stripe (For Donations/Credits)
```bash
STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_<your-stripe-secret-key>  # Live-mode key for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_<your-stripe-publishable-key>  # Live-mode key for production
STRIPE_WEBHOOK_SECRET=whsec_...  # From webhook endpoint
```

### Sentry & Blob (Already Have)
```bash
NEXT_PUBLIC_SENTRY_DSN=<your-sentry-dsn>
BLOB_READ_WRITE_TOKEN=<your-blob-read-write-token>
```

### Optional
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=ransfordsnotes.com  # If using Plausible analytics
EMAIL_SERVER=smtp://...  # If using email magic links
EMAIL_FROM=noreply@ransfordsnotes.com
```

---

## 📋 Step-by-Step: Go Live Checklist

### Phase 1: Database Setup (15-30 min)

1. **Create PostgreSQL database:**
   - [ ] Go to Vercel Dashboard → Storage → Create Postgres
   - [ ] OR set up Supabase/Neon/Railway
   - [ ] Copy connection string

2. **Update Prisma:**
   - [ ] Change `prisma/schema.prisma` → `provider = "postgresql"`
   - [ ] Add `DATABASE_URL` to Vercel environment variables
   - [ ] Commit and push changes

3. **Deploy & Migrate:**
   - [ ] Vercel will auto-run Prisma migrations (or run manually)
   - [ ] Verify database connection works
   - [ ] Test that data persists

### Phase 2: Authentication (10 min)

4. **Google OAuth:**
   - [ ] Create OAuth credentials in Google Cloud Console
   - [ ] Add callback URL: `https://www.ransfordsnotes.com/api/auth/callback/google`
   - [ ] Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel

5. **NextAuth:**
   - [ ] `NEXTAUTH_SECRET` ✅ (already generated)
   - [ ] `NEXTAUTH_URL` = your production domain
   - [ ] Test sign-in works

### Phase 3: Payments (10 min)

6. **Stripe:**
   - [ ] Get live API keys from Stripe Dashboard
   - [ ] Create webhook endpoint: `https://www.ransfordsnotes.com/api/stripe/webhook`
   - [ ] Add all Stripe env vars to Vercel
   - [ ] Test donation flow

### Phase 4: Final Checks (5 min)

7. **Verify:**
   - [ ] Sign-up works
   - [ ] User data persists (check database)
   - [ ] Donation completes
   - [ ] Webhook receives events
   - [ ] No errors in Sentry

---

## 🎯 Quick Start: Get Database in 5 Minutes

### Option 1: Vercel Postgres (Easiest)

1. Vercel Dashboard → Your Project → **Storage** tab
2. Click **Create Database** → **Postgres**
3. Copy the connection string
4. Add to Vercel Environment Variables as `DATABASE_URL`
5. Done! Vercel handles the rest.

### Option 2: Supabase (Free Tier)

1. Sign up: https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for serverless)
5. Add to Vercel as `DATABASE_URL`

---

## ⚠️ What Happens If You Deploy Without Database?

**Current state:** Your app will:
- ❌ Fail to write user data (filesystem is read-only)
- ❌ Lose all data on every deployment
- ❌ Sign-ups won't persist
- ❌ Donations won't be recorded
- ❌ Progress won't save

**After database setup:** Everything will work! ✅

---

## 📝 Files That Need Database Migration

Your Prisma schema already has models for most data! You just need to:

1. **Switch to PostgreSQL** (change one line in schema.prisma)
2. **Update code** to use Prisma instead of JSON files:
   - `src/lib/auth/store.ts` → Use Prisma UserIdentity
   - `src/lib/billing/store.ts` → Use Prisma models
   - `src/lib/analytics/store.core.js` → Use Prisma
   - `src/lib/feedback/store.ts` → Use Prisma FeedbackSubmission model

**Note:** Some of these might already be using Prisma - check the code!

---

## 🚀 After Database is Set Up

Once PostgreSQL is configured:
1. ✅ User sign-ups will persist
2. ✅ Donations will be recorded
3. ✅ Progress will save
4. ✅ Everything will work in production
5. ✅ Data survives deployments
6. ✅ You can scale

---

## 📚 Next Steps

1. **Read:** `PRODUCTION-BLOCKERS.md` for detailed database setup
2. **Set up:** PostgreSQL database (Vercel Postgres recommended)
3. **Update:** Prisma schema to PostgreSQL
4. **Deploy:** Push changes and verify
5. **Test:** Sign-up, donation, data persistence

**You're almost there!** The database is the only critical blocker. Once that's done, you're live! 🎉
