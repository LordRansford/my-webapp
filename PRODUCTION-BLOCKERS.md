# 🚨 CRITICAL: Production Blockers

## ⚠️ BLOCKER #1: Database & File Storage

**Your app currently uses:**
- SQLite database (`file:./data/dev.db`)
- JSON files in `data/` directory for:
  - User authentication (`data/auth.json`)
  - Billing/credits (`data/billing-store.json`)
  - Analytics (`data/learning-analytics.json`)
  - Learning records (`data/learning-records.json`)
  - Feedback (`data/feedback.json`)
  - Certificates, CPD state, etc.

**Problem:** Vercel is serverless - there's NO persistent filesystem! Files written to `data/` will be lost on every deployment.

**Solution Required:**
1. **Set up PostgreSQL database** (Vercel Postgres, Supabase, Neon, or Railway)
2. **Update Prisma schema** to use PostgreSQL
3. **Migrate data** from JSON files to database
4. **Update all file-based storage** to use database

## ⚠️ BLOCKER #2: Prisma Schema Configuration

**Current:** `provider = "sqlite"`  
**Needed:** `provider = "postgresql"`

**Action:** Change `prisma/schema.prisma` datasource to PostgreSQL

## ✅ What WILL Work on Vercel

- ✅ Vercel Blob Storage (already configured)
- ✅ Static files in `public/`
- ✅ Environment variables
- ✅ Next.js API routes
- ✅ Serverless functions

## ❌ What WON'T Work on Vercel

- ❌ Writing to `data/` directory (filesystem is read-only)
- ❌ SQLite database files
- ❌ File-based JSON storage
- ❌ Persistent local storage

## 🔧 Required Actions Before Going Live

### 1. Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
1. Go to Vercel Dashboard → Your Project → Storage
2. Create Postgres database
3. Copy connection string

**Option B: Supabase (Free tier available)**
1. Sign up at https://supabase.com
2. Create project
3. Get connection string from Settings → Database

**Option C: Neon (Serverless Postgres)**
1. Sign up at https://neon.tech
2. Create database
3. Copy connection string

### 2. Update Prisma Schema

Change `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Add DATABASE_URL to Vercel

Add to Vercel environment variables:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

### 4. Run Prisma Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Migrate Existing Data (if any)

If you have existing users/data in JSON files, you'll need to:
- Export data from JSON files
- Import into PostgreSQL using Prisma

## 📋 Complete Production Checklist

### Critical (Must Have)
- [ ] **PostgreSQL database set up**
- [ ] **Prisma schema updated to PostgreSQL**
- [ ] **DATABASE_URL environment variable set in Vercel**
- [ ] **Database migrations run**
- [ ] **All file-based storage migrated to database**
- [ ] **NEXTAUTH_SECRET** (already generated)
- [ ] **NEXTAUTH_URL** (production domain)
- [ ] **GOOGLE_CLIENT_ID & SECRET**
- [ ] **STRIPE live keys & webhook**

### Important (Should Have)
- [ ] **Email service** (for magic link auth - optional)
- [ ] **Plausible analytics domain** (if using analytics)
- [ ] **Custom domain configured** in Vercel
- [ ] **SSL certificate** (Vercel handles automatically)
- [ ] **Error pages** (404, 500)
- [ ] **robots.txt & sitemap.xml**

### Nice to Have
- [ ] **Legal pages** (Privacy Policy, Terms of Service)
- [ ] **Backup strategy** for database
- [ ] **Monitoring alerts** (Sentry already set up)
- [ ] **Performance optimization**

## 🎯 Quick Fix Path

**Fastest way to go live:**

1. **Set up Vercel Postgres** (5 min)
   - Vercel Dashboard → Storage → Create Postgres
   - Copy connection string

2. **Update Prisma** (2 min)
   - Change `provider = "postgresql"` in schema.prisma
   - Add `DATABASE_URL` to Vercel env vars

3. **Deploy & Migrate** (5 min)
   - Push changes
   - Run `npx prisma migrate deploy` (or Vercel will auto-run)
   - Test database connection

4. **Verify** (2 min)
   - Test sign-up
   - Test donation
   - Check data persists

**Total time: ~15 minutes**

## 📝 Files That Need Database Migration

These currently use JSON files and need to be migrated:

- `src/lib/auth/store.ts` → Use Prisma UserIdentity
- `src/lib/billing/store.ts` → Use Prisma models
- `src/lib/analytics/store.core.js` → Use Prisma
- `src/lib/feedback/store.ts` → Use Prisma
- `src/lib/learning/records.core.js` → Use Prisma
- `src/lib/certificates/store.core.js` → Use Prisma

**Good news:** Your Prisma schema already has models for most of these! You just need to:
1. Switch to PostgreSQL
2. Update the code to use Prisma instead of JSON files

## 🚀 After Database Setup

Once PostgreSQL is configured:
1. All user data will persist
2. Sign-ups will work
3. Donations will be recorded
4. Progress will be saved
5. Everything will work in production!

---

**Bottom line:** You CANNOT go live with file-based storage. PostgreSQL is required.
