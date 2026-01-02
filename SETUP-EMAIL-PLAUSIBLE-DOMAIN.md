# 📧 Complete Setup Guide: Email, Plausible & Custom Domain

## ✅ What's Already Done

- ✅ Error pages (404, 500) - Already implemented
- ✅ Legal pages (Privacy, Terms) - Already implemented
- ✅ Footer links - Already link to Privacy and Terms
- ✅ Plausible code - Already integrated in `src/pages/_document.js`
- ✅ NextAuth EmailProvider - Already configured in `src/lib/auth/options.ts`
- ✅ Resend package - Just installed

## 🎯 What You Need to Do

### 1. Email Service (Resend) - 10-15 minutes

#### Step 1.1: Get Your Resend API Key
You're already on the Resend onboarding page. Copy your API key:
- **API Key:** `re_6qS5SRTB_M9WnNEdfBeHd95twAA5Jruwq` (from the page you're viewing)

#### Step 1.2: Add to Local Environment (.env.local)

Create or update `.env.local` in your project root:

```bash
# Resend Email Service
RESEND_API_KEY=re_6qS5SRTB_M9WnNEdfBeHd95twAA5Jruwq
EMAIL_SERVER=smtp://resend:re_6qS5SRTB_M9WnNEdfBeHd95twAA5Jruwq@smtp.resend.com:587
EMAIL_FROM=onboarding@resend.dev  # For testing - change to your verified domain later
```

#### Step 1.3: Add to Vercel Environment Variables

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Click **Add New**
3. Add these three variables:

   **Variable 1:**
   - **Key:** `RESEND_API_KEY`
   - **Value:** `re_6qS5SRTB_M9WnNEdfBeHd95twAA5Jruwq`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 2:**
   - **Key:** `EMAIL_SERVER`
   - **Value:** `smtp://resend:re_6qS5SRTB_M9WnNEdfBeHd95twAA5Jruwq@smtp.resend.com:587`
   - **Environment:** Production, Preview, Development
   - Click **Save**

   **Variable 3:**
   - **Key:** `EMAIL_FROM`
   - **Value:** `onboarding@resend.dev` (for now - update after domain verification)
   - **Environment:** Production, Preview, Development
   - Click **Save**

#### Step 1.4: Verify Domain in Resend (For Production)

**Important:** `onboarding@resend.dev` works for testing, but for production you need your own domain.

1. Go to **Resend Dashboard** → **Domains** → **Add Domain**
2. Enter your domain: `ransfordsnotes.com` (or your domain)
3. Resend will provide DNS records to add:
   - **TXT record** for domain verification
   - **DKIM records** for email authentication
4. Add these DNS records to your domain registrar
5. Wait for verification (usually 5-30 minutes)
6. Once verified, update `EMAIL_FROM` in Vercel to: `noreply@ransfordsnotes.com` (or your verified email)

#### Step 1.5: Test Magic Link Authentication

1. Deploy to Vercel (or run locally with `npm run dev`)
2. Go to: `https://your-domain.com/signin`
3. Enter your email address
4. Click "Sign in with Email"
5. Check your inbox for the magic link
6. Click the link to complete sign-in

**That's it!** NextAuth will automatically use Resend to send magic links.

---

### 2. Plausible Analytics - 5-10 minutes

#### Step 2.1: Sign Up for Plausible

1. Go to: https://plausible.io
2. Click **"Get started"** or **"Sign up"**
3. Create an account (free tier available for testing)
4. Verify your email

#### Step 2.2: Add Your Website

1. In Plausible Dashboard → Click **"Add website"**
2. Enter your domain:
   - **For testing:** `my-webapp-*.vercel.app` (your Vercel preview domain)
   - **For production:** `www.ransfordsnotes.com` (or your custom domain)
3. Click **"Add website"**
4. Copy the domain name you just added

#### Step 2.3: Add Environment Variable

**Local (.env.local):**
```bash
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=my-webapp-*.vercel.app  # Or your custom domain
```

**Vercel (Production):**
1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Click **Add New**
3. Add:
   - **Key:** `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
   - **Value:** `www.ransfordsnotes.com` (or your domain)
   - **Environment:** Production, Preview, Development
   - Click **Save**

#### Step 2.4: Verify It's Working

1. Deploy to Vercel
2. Visit your site
3. Go to **Plausible Dashboard** → **Your website**
4. You should see real-time visitors appearing
5. Analytics will track page views, referrers, and more (privacy-friendly, no cookies!)

**Note:** The Plausible script is already integrated in `src/pages/_document.js` - it will automatically start tracking once the environment variable is set.

---

### 3. Custom Domain in Vercel - 10-30 minutes

#### Step 3.1: Purchase Domain (If You Don't Have One)

If you already have `ransfordsnotes.com`, skip this step.

**Recommended Registrars:**
- **Cloudflare Registrar** - $8-10/year (cheapest, best DNS)
- **Namecheap** - $10-15/year
- **GoDaddy** - $12-20/year

#### Step 3.2: Add Domain to Vercel

1. Go to: **Vercel Dashboard** → **Your Project** → **Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain:
   - **Root domain:** `ransfordsnotes.com`
   - **Or subdomain:** `www.ransfordsnotes.com`
4. Click **"Add"**

#### Step 3.3: Configure DNS Records

Vercel will show you the exact DNS records to add. Here's what you'll typically need:

**Option A: Root Domain Only (ransfordsnotes.com)**
```
Type: A
Name: @ (or leave blank)
Value: 76.76.21.21
```

**Option B: www Subdomain Only (www.ransfordsnotes.com)**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Option C: Both (Recommended)**
- Add **A record** for root domain: `@` → `76.76.21.21`
- Add **CNAME record** for www: `www` → `cname.vercel-dns.com`
- This allows both `ransfordsnotes.com` and `www.ransfordsnotes.com` to work

#### Step 3.4: Update DNS at Your Registrar

1. Log in to your domain registrar (where you bought the domain)
2. Go to **DNS Management** or **DNS Settings**
3. Find the **DNS Records** section
4. Add the records Vercel provided:
   - Click **"Add Record"** or **"Create Record"**
   - Enter the Type, Name, and Value from Vercel
   - Click **Save**
5. Repeat for all records Vercel shows

#### Step 3.5: Wait for Verification

1. DNS propagation usually takes **5-30 minutes** (can take up to 48 hours)
2. Vercel will automatically detect when DNS is configured
3. You'll see a **green checkmark** ✅ in Vercel when the domain is verified
4. **SSL certificate** will be automatically provisioned by Vercel (free!)

#### Step 3.6: Update All Environment Variables

Once your custom domain is live and verified, update these in Vercel:

**Vercel Environment Variables:**
1. `NEXTAUTH_URL` = `https://www.ransfordsnotes.com` (or your domain)
2. `NEXT_PUBLIC_SITE_URL` = `https://www.ransfordsnotes.com`
3. `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` = `www.ransfordsnotes.com` (update from previous step)

**Google OAuth:**
1. Go to: **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Click on your OAuth 2.0 Client ID
3. Under **"Authorized redirect URIs"**, add:
   - `https://www.ransfordsnotes.com/api/auth/callback/google`
4. Click **Save**

**Stripe Webhooks:**
1. Go to: **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Update the endpoint URL to: `https://www.ransfordsnotes.com/api/stripe/webhook`
4. Or create a new webhook with the custom domain URL
5. Copy the new webhook secret and update `STRIPE_WEBHOOK_SECRET` in Vercel

---

## ✅ Final Checklist

After completing all steps:

- [ ] Resend API key added to `.env.local` and Vercel
- [ ] `EMAIL_SERVER` and `EMAIL_FROM` set in Vercel
- [ ] Test magic link email works (go to `/signin` and request magic link)
- [ ] Resend domain verified (for production emails)
- [ ] Plausible account created and website added
- [ ] `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` set in Vercel
- [ ] Plausible tracking visible in dashboard (visit site, check Plausible)
- [ ] Custom domain added in Vercel
- [ ] DNS records configured at registrar
- [ ] Domain verified in Vercel (green checkmark)
- [ ] SSL certificate active (automatic, check in Vercel)
- [ ] Site accessible via custom domain (visit `https://www.ransfordsnotes.com`)
- [ ] `NEXTAUTH_URL` updated with custom domain
- [ ] `NEXT_PUBLIC_SITE_URL` updated with custom domain
- [ ] Google OAuth callback URL updated
- [ ] Stripe webhook URL updated

---

## 🎉 You're Done!

Once all steps are complete:
- ✅ Magic link authentication will work via Resend
- ✅ Privacy-friendly analytics will track via Plausible
- ✅ Your site will be accessible via your custom domain
- ✅ All services will use your custom domain URLs

**Estimated total time:** 30-60 minutes (mostly waiting for DNS propagation)

---

## 📚 Additional Resources

- **Resend Docs:** https://resend.com/docs
- **Plausible Docs:** https://plausible.io/docs
- **Vercel Domains:** https://vercel.com/docs/concepts/projects/domains
- **NextAuth Email Provider:** https://next-auth.js.org/providers/email
