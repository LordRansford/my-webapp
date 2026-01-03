# 🚀 GO LIVE - Production Setup Checklist

**⚠️ CRITICAL: Read `PRODUCTION-BLOCKERS.md` first!**  
**Your app uses file-based storage which WON'T work on Vercel. You MUST set up PostgreSQL first!**

**This guide is for PRODUCTION deployment. Configure everything in Vercel, not localhost!**

## Your Production Domain

Based on your codebase, your production domain appears to be:
- **Primary**: `https://www.ransfordsnotes.com` (or your custom domain)
- **Vercel**: `https://my-webapp-*.vercel.app` (check your Vercel dashboard)

## ⚡ QUICK START - Get Live in 30 Minutes

### Step 1: Configure Vercel Environment Variables (5 min)

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these for **Production** environment:

```bash
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://18ce20185c853218c17f8ae07b0a910c@04510635376836608.ingest.de.sentry.io/4510635463999568

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_REPLACE_WITH_YOUR_TOKEN

# NextAuth (REQUIRED for Google sign-in)
NEXTAUTH_SECRET=<generate-strong-random-secret-32-chars>
NEXTAUTH_URL=https://www.ransfordsnotes.com  # YOUR PRODUCTION DOMAIN

# Google OAuth (REQUIRED for sign-in)
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# Site URL
NEXT_PUBLIC_SITE_URL=https://www.ransfordsnotes.com  # YOUR PRODUCTION DOMAIN

# Database (REQUIRED - set up PostgreSQL first!)
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require

# Stripe (REQUIRED for donations/credits)
STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_live_...  # LIVE KEY for production!
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...  # LIVE KEY for production!
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe webhook endpoint

# Email Service (Resend - Optional, for magic link auth)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_SERVER=smtp://resend:re_xxxxxxxxxxxxx@smtp.resend.com:587
EMAIL_FROM=noreply@ransfordsnotes.com  # Use verified domain email

# Plausible Analytics (Optional)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=www.ransfordsnotes.com
```

### Step 2: Get Google OAuth Credentials (10 min)

1. **Go to**: https://console.cloud.google.com
2. **Create OAuth 2.0 Client ID**:
   - APIs & Services → Credentials → Create Credentials → OAuth client ID
   - Type: **Web application**
   - **Authorized redirect URIs** (CRITICAL - add these EXACT URLs):
     ```
     https://www.ransfordsnotes.com/api/auth/callback/google
     https://my-webapp-*.vercel.app/api/auth/callback/google
     ```
   - Copy **Client ID** and **Client Secret**
3. **Add to Vercel** environment variables

### Step 3: Get Stripe Live Keys (5 min)

1. **Go to**: https://dashboard.stripe.com
2. **Switch to Live mode** (toggle in top right)
3. **Get API keys**:
   - Developers → API keys
   - Copy **Publishable key** (`pk_live_...`)
   - Copy **Secret key** (`sk_live_...`)
4. **Create webhook endpoint**:
   - Developers → Webhooks → Add endpoint
   - URL: `https://www.ransfordsnotes.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy **Signing secret** (`whsec_...`)
5. **Add all to Vercel** environment variables

### Step 4: Generate NEXTAUTH_SECRET (1 min)

**PowerShell:**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Or use online generator**: https://generate-secret.vercel.app/32

Copy the result and add to Vercel as `NEXTAUTH_SECRET`

### Step 5: Deploy & Test (5 min)

1. **Push to GitHub** (if not already):
   ```bash
   git push origin main
   ```
2. **Vercel will auto-deploy** (or trigger manually)
3. **Test production URLs**:
   - Sign-in: `https://www.ransfordsnotes.com/signin`
   - Donations: `https://www.ransfordsnotes.com/support/donate`
   - Account: `https://www.ransfordsnotes.com/account`

## 🔴 CRITICAL: Production URLs

**Replace `localhost:3000` with your actual production domain everywhere:**

- ✅ `NEXTAUTH_URL=https://www.ransfordsnotes.com`
- ✅ `NEXT_PUBLIC_SITE_URL=https://www.ransfordsnotes.com`
- ✅ Google OAuth callback: `https://www.ransfordsnotes.com/api/auth/callback/google`
- ✅ Stripe webhook: `https://www.ransfordsnotes.com/api/stripe/webhook`

## ✅ Pre-Launch Checklist

### Environment Variables in Vercel
- [ ] `NEXT_PUBLIC_SENTRY_DSN` - Set
- [ ] `BLOB_READ_WRITE_TOKEN` - Set
- [ ] `NEXTAUTH_SECRET` - Generated and set (32+ chars)
- [ ] `NEXTAUTH_URL` - Set to production domain (HTTPS!)
- [ ] `GOOGLE_CLIENT_ID` - Set
- [ ] `GOOGLE_CLIENT_SECRET` - Set
- [ ] `NEXT_PUBLIC_SITE_URL` - Set to production domain
- [ ] `STRIPE_ENABLED=true` - Set
- [ ] `STRIPE_SECRET_KEY` - Set (LIVE key: `sk_live_...`)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Set (LIVE key: `pk_live_...`)
- [ ] `STRIPE_WEBHOOK_SECRET` - Set

### Google OAuth Configuration
- [ ] OAuth client created in Google Cloud Console
- [ ] Redirect URI added: `https://www.ransfordsnotes.com/api/auth/callback/google`
- [ ] Client ID and Secret copied to Vercel

### Stripe Configuration
- [ ] Stripe account activated (live mode)
- [ ] Live API keys obtained
- [ ] Webhook endpoint created
- [ ] Webhook signing secret added to Vercel
- [ ] Test a donation with real card (small amount)

### Testing
- [ ] Google sign-in works at `/signin`
- [ ] User can create account
- [ ] Donation checkout works at `/support/donate`
- [ ] Payment completes successfully
- [ ] Webhook receives events (check Stripe Dashboard)
- [ ] User account shows after sign-in

## 🚨 Common Production Issues

### "redirect_uri_mismatch" (Google)
- **Fix**: Ensure callback URL in Google Console EXACTLY matches: `https://www.ransfordsnotes.com/api/auth/callback/google`
- No trailing slash, must be HTTPS

### "Stripe is not enabled"
- **Fix**: Set `STRIPE_ENABLED=true` in Vercel

### "Authentication is not configured"
- **Fix**: Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` in Vercel

### Webhook not receiving events
- **Fix**: Check webhook URL is accessible (not behind auth)
- Verify webhook secret matches
- Check Stripe Dashboard → Webhooks for delivery status

## 📋 Environment Variables Template for Vercel

Copy-paste this into Vercel (replace placeholders):

```
NEXT_PUBLIC_SENTRY_DSN=https://18ce20185c853218c17f8ae07b0a910c@04510635376836608.ingest.de.sentry.io/4510635463999568
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_REPLACE_WITH_YOUR_TOKEN
NEXTAUTH_SECRET=<generate-32-char-secret>
NEXTAUTH_URL=https://www.ransfordsnotes.com
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
NEXT_PUBLIC_SITE_URL=https://www.ransfordsnotes.com
STRIPE_ENABLED=true
STRIPE_SECRET_KEY=sk_live_<your-stripe-secret-key>
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_<your-stripe-publishable-key>
STRIPE_WEBHOOK_SECRET=whsec_<your-webhook-secret>
```

## 🎯 You're Ready When...

1. ✅ All environment variables are set in Vercel (Production)
2. ✅ Google OAuth callback URL is configured
3. ✅ Stripe webhook is configured
4. ✅ Test sign-in works on production domain
5. ✅ Test donation works on production domain

## 🚀 Launch!

Once all checkboxes are done:
1. Push any final changes to GitHub
2. Verify Vercel deployment succeeded
3. Test sign-in: `https://www.ransfordsnotes.com/signin`
4. Test donation: `https://www.ransfordsnotes.com/support/donate`
5. **You're live!** 🎉

---

**Need help?** Check the detailed guides:
- `SETUP-GOOGLE-AUTH.md` - Google OAuth details
- `SETUP-STRIPE-DONATIONS.md` - Stripe details
- `SETUP-SENTRY-VERCEL-BLOB.md` - Sentry & Blob details
