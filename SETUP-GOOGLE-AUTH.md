# Setup Guide: Google Sign-In (OAuth)

This guide will help you configure Google OAuth authentication for your Next.js application.

## Current Status

✅ **Code is already integrated:**
- Sign-in page at `/signin`
- NextAuth with GoogleProvider configured
- Session management working
- Account page for authenticated users

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**: https://console.cloud.google.com
2. **Create or select a project**
3. **Enable Google+ API**:
   - Go to APIs & Services → Library
   - Search for "Google+ API" or "People API"
   - Click Enable
4. **Create OAuth 2.0 credentials**:
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: "Ransfords Notes" (or your app name)
5. **Configure authorized redirect URIs**:
   - Add these URIs (replace with your actual domain):
     ```
     http://localhost:3000/api/auth/callback/google
     https://your-domain.com/api/auth/callback/google
     https://your-vercel-app.vercel.app/api/auth/callback/google
     ```
6. **Copy credentials**:
   - **Client ID** (starts with `...apps.googleusercontent.com`)
   - **Client Secret**

## Step 2: Configure Environment Variables

### Local Development (`.env.local`)

```bash
# NextAuth Configuration (Required)
NEXTAUTH_SECRET=your-secret-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (Required for Google sign-in)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Site URL (used for redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Generate NEXTAUTH_SECRET

```bash
# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Mac/Linux
openssl rand -base64 32
```

### Vercel Deployment

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add all variables for appropriate environments:
   - **Production**: Use production domain in `NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL`
   - **Preview**: Use preview domain
   - **Development**: Use `http://localhost:3000`

## Step 3: Update Google OAuth Redirect URIs

After deploying to Vercel, add your production callback URL:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click on your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-production-domain.com/api/auth/callback/google
   https://your-vercel-app.vercel.app/api/auth/callback/google
   ```

## Step 4: Test Google Sign-In

### Local Testing

1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/signin`
3. Click "Continue with Google"
4. You should be redirected to Google sign-in
5. After signing in, you should be redirected back to your app

### Common Issues

**"redirect_uri_mismatch" error:**
- Check that the redirect URI in Google Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- Ensure no trailing slashes
- Check `NEXTAUTH_URL` matches your current domain

**"Invalid client" error:**
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that credentials are for the correct project
- Ensure Google+ API or People API is enabled

**Sign-in button doesn't appear:**
- Check browser console for errors
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Check that NextAuth is properly initialized

## Environment Variables Summary

### Required
```bash
NEXTAUTH_SECRET=...  # Random secret for session encryption
NEXTAUTH_URL=http://localhost:3000  # Base URL of your app
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Optional
```bash
# Email magic link (if you want email authentication too)
EMAIL_SERVER=smtp://...
EMAIL_FROM=noreply@yourdomain.com
```

## NextAuth Callback URL

The callback URL format is:
```
{NEXTAUTH_URL}/api/auth/callback/{provider}
```

For Google:
```
http://localhost:3000/api/auth/callback/google
https://your-domain.com/api/auth/callback/google
```

## Testing Checklist

- [ ] Sign-in page loads at `/signin`
- [ ] "Continue with Google" button is visible
- [ ] Clicking button redirects to Google
- [ ] Google sign-in completes successfully
- [ ] Redirects back to app after sign-in
- [ ] User session is created
- [ ] Can access `/account` page when signed in
- [ ] Sign-out works correctly

## Troubleshooting

### Check Environment Variables

Run this to verify:
```bash
node -e "console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing'); console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing'); console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'Set' : 'Missing');"
```

### Check Browser Console

Open browser DevTools → Console and look for:
- NextAuth initialization errors
- OAuth redirect errors
- Network errors to `/api/auth/*`

### Check Server Logs

Look for:
- "auth.provider_misconfigured" warnings
- OAuth callback errors
- Session creation errors

## Security Notes

- ✅ `NEXTAUTH_SECRET` should be a strong random string
- ✅ Never commit secrets to git
- ✅ Use different secrets for dev/prod
- ✅ Google Client Secret is server-side only
- ✅ OAuth flow is secure (no passwords stored)

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [NextAuth Google Provider](https://next-auth.js.org/providers/google)
