# Setup Guide: Sentry & Vercel Blob

This guide will help you configure Sentry error tracking and Vercel Blob storage for your Next.js application.

## Prerequisites

- Sentry account with a project created
- Vercel account with Blob storage enabled
- Access to your project's environment variables

## Step 1: Configure Environment Variables

Create or update your `.env.local` file in the project root with the following variables:

```bash
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://18ce20185c853218c17f8ae07b0a910c@04510635376836608.ingest.de.sentry.io/4510635463999568

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_UuhVh3M1IDJgNtMG_iVjfFbe4ZavEw1BfnPveoB3Z1dW7zU
```

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:
   - `NEXT_PUBLIC_SENTRY_DSN` (available in all environments)
   - `BLOB_READ_WRITE_TOKEN` (available in all environments)

## Step 2: Verify Sentry Configuration

The Sentry configuration files have been created:
- `sentry.client.config.ts` - Client-side error tracking
- `sentry.server.config.ts` - Server-side error tracking
- `sentry.edge.config.ts` - Edge runtime error tracking

These files will automatically initialize Sentry when:
- The `NEXT_PUBLIC_SENTRY_DSN` environment variable is set
- The `@sentry/nextjs` package is installed (already in devDependencies)

## Step 3: Verify Vercel Blob Integration

The `@vercel/blob` package is already installed and configured. The following features are available:

- **File Upload**: Use `put()` to upload files
- **File Download**: Use `get()` or `getDownloadUrl()` to retrieve files
- **File Management**: Use `list()`, `head()`, and `del()` for file operations

Example usage can be found in:
- `src/lib/ai-studio/storage.ts`
- `src/app/api/admin/support/[id]/attachments/[attachmentId]/route.ts`

## Step 4: Test the Integration

### Test Sentry

1. Start your development server: `npm run dev`
2. Trigger a test error (you can add a test button that throws an error)
3. Check your Sentry dashboard to see if the error appears

### Test Vercel Blob

1. Use the AI Studio file upload feature
2. Or test via the API endpoint: `/api/ai-studio/storage/upload`

## Sentry Features Enabled

Based on your Sentry configuration:
- ✅ **Performance Monitoring**: Enabled with 100% trace sample rate
- ✅ **Session Replay**: Enabled (10% session sample, 100% error sample)
- ✅ **Error Tracking**: Enabled for client, server, and edge runtimes

## Troubleshooting

### Sentry not capturing errors

1. Verify `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Check browser console for Sentry initialization messages
3. Ensure `@sentry/nextjs` is installed: `npm install @sentry/nextjs`

### Vercel Blob errors

1. Verify `BLOB_READ_WRITE_TOKEN` is set correctly
2. Check that the token has read/write permissions
3. Ensure `@vercel/blob` is installed: `npm install @vercel/blob`

## Step 5: Optional - Sentry Source Maps & Release Tracking

For better error debugging with source maps, you can optionally configure:

1. **Get Sentry Auth Token**:
   - Go to Sentry → Settings → Account → Auth Tokens
   - Create a new token with `project:releases` scope

2. **Add to Vercel Environment Variables**:
   - `SENTRY_ORG` - Your Sentry organization slug
   - `SENTRY_PROJECT` - Your Sentry project slug (e.g., `javascript-nextjs`)
   - `SENTRY_AUTH_TOKEN` - Your Sentry auth token (for source map uploads)

3. **The `next.config.mjs` is already configured** to use these if available

## Next Steps

- ✅ Configure Sentry release tracking (optional - requires SENTRY_ORG, SENTRY_PROJECT, SENTRY_AUTH_TOKEN)
- Set up Sentry alerts for critical errors
- Configure Vercel Blob access policies if needed
- Review Sentry performance monitoring dashboards

## Additional Resources

- [Sentry Next.js Documentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Vercel Blob Documentation](https://vercel.com/docs/storage/vercel-blob)
- [Environment Variables in Vercel](https://vercel.com/docs/concepts/projects/environment-variables)
