# Deployment Guide

This guide covers deploying my-webapp to production environments with proper environment variable configuration.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables Setup](#environment-variables-setup)
- [Deploying to Vercel](#deploying-to-vercel)
- [Deploying to Other Platforms](#deploying-to-other-platforms)
- [Post-Deployment Verification](#post-deployment-verification)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

1. A production-ready database (PostgreSQL recommended for production)
2. All required environment variables configured
3. OAuth credentials (if using Google authentication)
4. SMTP server details (if using email authentication)
5. Stripe keys (if using payment features)

## Environment Variables Setup

### Required Variables (Minimum for Authentication)

These variables **must** be set for authentication to work:

```bash
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<your-secret-here>
```

#### Generating NEXTAUTH_SECRET

Generate a secure random secret using one of these methods:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Optional Variables (For Enhanced Features)

#### Google OAuth (Optional)

To enable Google sign-in:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
6. Set the following environment variables:

```bash
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

#### Email Magic Links (Optional)

To enable passwordless email authentication:

```bash
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

#### Database

```bash
# Production: PostgreSQL recommended
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Development: SQLite
DATABASE_URL=file:./dev.db
```

#### Stripe (Optional)

Only needed if using payment features:

```bash
STRIPE_SECRET_KEY=sk-live-replace-with-your-actual-key
STRIPE_WEBHOOK_SECRET=whsec-replace-with-your-webhook-secret
```

## Deploying to Vercel

Vercel is the recommended platform for deploying Next.js applications.

### Step 1: Connect Repository

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository

### Step 2: Configure Build Settings

Vercel will auto-detect Next.js. Default settings should work:

- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Step 3: Set Environment Variables

In the Vercel project settings:

1. Go to "Settings" → "Environment Variables"
2. Add all required variables from `.env.example`
3. Set variables for all environments (Production, Preview, Development) as needed

**Critical Variables:**

```
NEXTAUTH_URL → https://yourdomain.com (use your actual domain)
NEXTAUTH_SECRET → [Generated secure secret]
```

**Optional Variables (add if using these features):**

```
GOOGLE_CLIENT_ID → [Your Google OAuth Client ID]
GOOGLE_CLIENT_SECRET → [Your Google OAuth Client Secret]
EMAIL_SERVER → [Your SMTP server connection string]
EMAIL_FROM → [Your from email address]
DATABASE_URL → [Your production database URL]
```

### Step 4: Configure Domain

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update NEXTAUTH_URL to match your domain

### Step 5: Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Verify deployment at your URL

## Deploying to Other Platforms

### AWS (Elastic Beanstalk, ECS, etc.)

1. Set environment variables in your AWS service configuration
2. Ensure `NEXTAUTH_URL` matches your application URL
3. Use AWS Secrets Manager for sensitive credentials
4. Deploy using AWS CLI or Console

### Azure

1. Use Azure App Service environment variables
2. Configure `NEXTAUTH_URL` to match your Azure domain
3. Use Azure Key Vault for secrets
4. Deploy via Azure Portal or CLI

### Docker

Create a `.env` file (never commit this):

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Run with environment variables:

```bash
docker run -d \
  -e NEXTAUTH_URL=https://yourdomain.com \
  -e NEXTAUTH_SECRET=your-secret \
  -e GOOGLE_CLIENT_ID=your-id \
  -e GOOGLE_CLIENT_SECRET=your-secret \
  -p 3000:3000 \
  your-image-name
```

## Post-Deployment Verification

After deployment, verify the following:

### 1. Authentication Flows

Test these endpoints and flows:

- [ ] Visit `/api/auth/signin` - should load without errors
- [ ] Sign in with Google (if enabled) - should authenticate successfully
- [ ] Sign out - should clear session properly
- [ ] Protected routes - should redirect to sign-in if not authenticated

### 2. Check Server Logs

Look for these messages in your server logs:

**Good (Properly Configured):**
- No `auth:misconfigured` messages

**Bad (Misconfigured):**
- `auth:misconfigured signin missing=NEXTAUTH_SECRET`
- `auth:misconfigured signin missing=NEXTAUTH_URL`

### 3. Environment Variable Check

Create a non-public admin route to verify (remove after verification):

```javascript
// pages/api/admin/env-check.js
export default function handler(req, res) {
  if (process.env.NODE_ENV !== 'production') {
    res.json({
      NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
}
```

### 4. Security Headers

Verify security headers are applied:

```bash
curl -I https://yourdomain.com
```

Should see:
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`

## Troubleshooting

### Authentication Not Working

**Problem**: Sign-in redirects fail or show errors

**Solutions**:

1. Verify `NEXTAUTH_URL` matches your actual domain exactly
2. Ensure `NEXTAUTH_SECRET` is set and has sufficient length (32+ characters)
3. Check Google OAuth redirect URIs include your callback URL
4. Look for `auth:misconfigured` in server logs

### Google OAuth Errors

**Problem**: "redirect_uri_mismatch" error

**Solution**:
1. Go to Google Cloud Console → Credentials
2. Edit your OAuth 2.0 Client ID
3. Add authorized redirect URI: `https://yourdomain.com/api/auth/callback/google`
4. Ensure the domain matches exactly (including https://)

### Build Failures

**Problem**: Build fails during deployment

**Solutions**:

1. Check Node.js version compatibility (>=20 recommended)
2. Verify all dependencies are in `package.json`
3. Ensure build scripts run successfully locally
4. Check for missing environment variables needed at build time

### Database Connection Issues

**Problem**: Cannot connect to database in production

**Solutions**:

1. Verify `DATABASE_URL` is correctly formatted
2. Ensure database server allows connections from your hosting platform
3. Check firewall rules and security groups
4. For Vercel: Ensure database is accessible from Vercel's IP ranges

### Email Magic Links Not Working

**Problem**: Email links not being sent

**Solutions**:

1. Verify `EMAIL_SERVER` and `EMAIL_FROM` are correctly set
2. Test SMTP credentials separately
3. Check email provider allows SMTP access
4. Look for email sending errors in logs

## Environment Variable Checklist

Use this checklist before deploying:

### Required (All Deployments)
- [ ] `NEXTAUTH_URL` - Set to production domain
- [ ] `NEXTAUTH_SECRET` - Generated secure secret (32+ chars)

### Optional (Feature-Dependent)
- [ ] `GOOGLE_CLIENT_ID` - If using Google OAuth
- [ ] `GOOGLE_CLIENT_SECRET` - If using Google OAuth
- [ ] `EMAIL_SERVER` - If using email authentication
- [ ] `EMAIL_FROM` - If using email authentication
- [ ] `DATABASE_URL` - Production database connection
- [ ] `STRIPE_SECRET_KEY` - If using Stripe
- [ ] `STRIPE_WEBHOOK_SECRET` - If using Stripe webhooks

### Security Checks
- [ ] No secrets committed to repository
- [ ] Different credentials for dev/staging/production
- [ ] Secrets stored in platform's secure variable system
- [ ] Regular secret rotation scheduled

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/getting-started/introduction)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

## Support

If you encounter issues not covered in this guide:

1. Check the [hardening checklist](./hardening-checklist.md)
2. Review server logs for error messages
3. Verify all environment variables are set correctly
4. Test authentication flows in a local environment first
