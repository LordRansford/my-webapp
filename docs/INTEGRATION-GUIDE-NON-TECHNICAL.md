# Integration Guide for Non-Technical Users

This guide will walk you through setting up the remaining integrations step-by-step. Each section is independent - you can do them in any order.

**👋 Welcome!** This guide assumes you're not a developer. Every step includes:
- Exact links to click
- What to look for on each page
- What to copy/paste
- Screenshots descriptions (where helpful)

**⏱️ Estimated Time:** 
- Sentry setup: 15-20 minutes
- Vercel Blob setup: 20-30 minutes
- Total: ~1 hour for both essential integrations

**💰 Cost:** Free for development (generous free tiers available)

---

## 1. Error Tracking with Sentry (Recommended)

**What it does:** Automatically captures and reports errors in your application so you can fix them.

**Why you need it:** Currently, errors are only logged to the console. Sentry will send you alerts and detailed error reports.

### Step-by-Step Setup:

#### Step 1: Create a Sentry Account
1. Go to **https://sentry.io/signup/**
2. Click **"Sign Up"** (top right)
3. Choose **"Sign up with Email"** or use Google/GitHub
4. Enter your email and create a password
5. Verify your email if prompted

#### Step 2: Create a New Project
1. After logging in, you'll see a dashboard
2. Click **"Create Project"** or **"Add Project"** button
3. Select **"Next.js"** as your platform
4. Give your project a name (e.g., "My Webapp")
5. Click **"Create Project"**

#### Step 3: Get Your DSN (Data Source Name)
1. After creating the project, Sentry will show you a setup page
2. Look for a section that says **"Configure your SDK"**
3. You'll see a code snippet that looks like this:
   ```javascript
   Sentry.init({
     dsn: "https://xxxxx@xxxxx.ingest.sentry.io/xxxxx",
   });
   ```
4. **Copy the DSN value** (the long URL starting with `https://`)
   - It will look like: `https://abc123@o123456.ingest.sentry.io/1234567`
   - Keep this safe - you'll need it in the next step

#### Step 4: Add Sentry to Your Project
1. **Open your project folder** in your code editor (VS Code, Cursor, etc.)
   - The root folder is where you see files like `package.json`, `next.config.js`, etc.

2. **Find or create `.env.local` file:**
   - Look in the root folder (same level as `package.json`)
   - If the file doesn't exist:
     - Right-click in the file explorer
     - Select "New File"
     - Name it exactly: `.env.local` (including the dot at the start)

3. **Add this line to `.env.local`:**
   ```
   NEXT_PUBLIC_SENTRY_DSN=https://YOUR_DSN_HERE
   ```
   - Replace `YOUR_DSN_HERE` with the DSN you copied from Sentry
   - Example: `NEXT_PUBLIC_SENTRY_DSN=https://abc123@o123456.ingest.sentry.io/1234567`
   - **Important:** No spaces around the `=` sign
   - **Important:** Don't put quotes around the DSN URL

#### Step 5: Install Sentry Package
1. Open your terminal/command prompt in your project folder
2. Run this command:
   ```bash
   npm install @sentry/nextjs
   ```
3. Wait for it to finish (may take 1-2 minutes)

#### Step 6: Initialize Sentry
1. **In your terminal (same window as Step 5), run:**
   ```bash
   npx @sentry/wizard@latest -i nextjs
   ```
   - Press Enter
   - Wait for it to start (may take 10-20 seconds)

2. **Follow the prompts:**
   - **"In which directory is your application located?"** → Press Enter (uses current directory)
   - **"Do you want to set up source maps?"** → Type **`y`** and press Enter
   - **"Do you want to set up performance monitoring?"** → Type **`y`** and press Enter
   - **"Do you want to set up release tracking?"** → Type **`y`** and press Enter (optional but recommended)
   - It may ask for your DSN - paste it if prompted (though it should read from `.env.local`)

3. **The wizard will automatically:**
   - Create `sentry.client.config.ts` and `sentry.server.config.ts` files
   - Update `next.config.js` 
   - Update your app files
   - You'll see "✓ Sentry has been successfully installed!" when done

#### Step 7: Update the Error Boundary
1. Open the file: `src/components/ai-studio/AIStudioErrorBoundary.tsx`
2. Find line 40 (the TODO comment)
3. Replace the TODO section with:
   ```typescript
   // Send to Sentry
   if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
     const Sentry = require('@sentry/nextjs');
     Sentry.captureException(error, {
       contexts: {
         react: {
           componentStack: errorInfo.componentStack,
         },
       },
     });
   }
   ```

#### Step 8: Test It
1. Restart your development server:
   - Stop it (Ctrl+C in terminal)
   - Run `npm run dev` again
2. Go to your Sentry dashboard: **https://sentry.io/organizations/YOUR_ORG/projects/**
3. Errors will now appear there automatically

**Cost:** Free tier includes 5,000 events/month (plenty for development)

---

## 2. Object Storage for File Attachments (Vercel Blob - Easiest Option)

**What it does:** Stores uploaded files (like support ticket attachments) securely in the cloud.

**Why you need it:** Currently, file attachments can't be downloaded. This will enable file storage and retrieval.

### Step-by-Step Setup:

#### Step 1: Sign Up for Vercel (if you don't have an account)
1. Go to **https://vercel.com/signup**
2. Click **"Sign Up"** (top right)
3. **Choose your signup method:**
   - **"Continue with GitHub"** (recommended if your code is on GitHub) - Click this button
   - **"Continue with Email"** - Enter your email and create a password
4. Complete the signup process:
   - If using GitHub: Authorize Vercel to access your GitHub account
   - If using email: Verify your email address
5. You'll be taken to the Vercel dashboard

#### Step 2: Create a Vercel Blob Store
1. **Log in to Vercel:**
   - Go to **https://vercel.com/dashboard**
   - Make sure you're logged in

2. **Navigate to Storage:**
   - Click on your **profile icon** (top right, shows your avatar/initials)
   - In the dropdown menu, click **"Settings"**
   - In the left sidebar, look for **"Storage"** and click it
   - If you don't see "Storage", look for **"Databases"** or **"Storage"** in the main navigation

3. **Create Blob Store:**
   - Click the **"Create Database"** or **"Add Storage"** button (usually a big button in the center)
   - You'll see options like "Postgres", "KV", "Blob", etc.
   - Click on **"Blob"** option
   - **Fill in the form:**
     - **Name:** Enter something like `support-attachments` or `file-storage`
     - **Region:** Choose the region closest to you:
       - US users: "Washington, D.C., USA" or "San Francisco, USA"
       - European users: "Frankfurt, Germany" or "London, UK"
       - Asian users: "Singapore" or "Tokyo, Japan"
   - Click **"Create"** button at the bottom
   - Wait for it to be created (takes 10-30 seconds)

#### Step 3: Get Your Blob Storage Credentials
1. **After creating the store:**
   - You'll see a page with your blob store details
   - Look for a section titled **"Environment Variables"** or **"Connection String"**

2. **Find the token:**
   - You'll see something like:
     ```
     BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx_xxxxxxxxxxxxx
     ```
   - Or it might just show the token value without the variable name
   - The token is a long string starting with `vercel_blob_`

3. **Copy the token:**
   - Click the **"Copy"** button next to it, or
   - Select the entire token and copy it (Ctrl+C / Cmd+C)
   - **Important:** Copy the entire token - it's quite long (50+ characters)
   - Keep this safe - you'll need it in the next step

**Alternative location:** If you don't see it on the store page:
- Go to your project settings (if you've linked a project)
- Go to **Settings** → **Environment Variables**
- Look for `BLOB_READ_WRITE_TOKEN`

#### Step 4: Add Credentials to Your Project
1. Open `.env.local` in your project
2. Add this line:
   ```
   BLOB_READ_WRITE_TOKEN=your_token_here
   ```
   - Replace `your_token_here` with the token you copied

#### Step 5: Install Vercel Blob Package
1. **In your terminal** (same one you used for Sentry):
   ```bash
   npm install @vercel/blob
   ```
   - Press Enter
   - Wait for it to finish (usually 30-60 seconds)
   - You'll see "added 1 package" when done

#### Step 6: Update the Attachment Download Route
1. Open: `src/app/api/admin/support/[id]/attachments/[attachmentId]/route.ts`
2. Find line 34 (the TODO comment)
3. Replace the TODO section with:
   ```typescript
   // Download from Vercel Blob
   const { get } = require('@vercel/blob');
   
   try {
     const blob = await get(att.storageKey, {
       token: process.env.BLOB_READ_WRITE_TOKEN,
     });
     
     return new NextResponse(blob, {
       headers: {
         'Content-Type': att.mimeType,
         'Content-Disposition': `attachment; filename="${att.fileName}"`,
       },
     });
   } catch (error) {
     console.error('Failed to download attachment:', error);
     return NextResponse.json(
       { error: "Failed to download attachment" },
       { status: 500 }
     );
   }
   ```

#### Step 7: Update the Upload Route (if it exists)
1. Find where attachments are uploaded (likely in a support ticket upload route)
2. Update it to use Vercel Blob for storage
3. Example code (ask your developer to implement this):
   ```typescript
   const { put } = require('@vercel/blob');
   
   const blob = await put(fileName, file, {
     access: 'public',
     token: process.env.BLOB_READ_WRITE_TOKEN,
   });
   
   // Save blob.url as storageKey in database
   ```

**Cost:** Vercel Blob free tier includes 1GB storage and 100GB bandwidth/month

**Alternative:** If you prefer AWS S3, see the alternative guide below.

---

## 3. AWS S3 Alternative (If You Prefer AWS)

**When to use:** If you already have AWS infrastructure or prefer AWS services.

### Step-by-Step Setup:

#### Step 1: Create AWS Account
1. Go to **https://aws.amazon.com/**
2. Click **"Create an AWS Account"** (top right)
3. Follow the signup process (requires credit card, but free tier available)

#### Step 2: Create S3 Bucket
1. Log in to **AWS Console**: **https://console.aws.amazon.com/**
2. Search for **"S3"** in the top search bar
3. Click **"S3"** service
4. Click **"Create bucket"** button
5. Fill in:
   - **Bucket name**: Choose a unique name (e.g., "my-webapp-attachments")
   - **Region**: Choose closest to you
   - **Block Public Access**: Keep checked (we'll use signed URLs)
6. Click **"Create bucket"**

#### Step 3: Create IAM User for Access
1. In AWS Console, search for **"IAM"**
2. Click **"IAM"** service
3. Click **"Users"** in left sidebar
4. Click **"Create user"**
5. Enter username: `webapp-storage-user`
6. Click **"Next"**
7. Select **"Attach policies directly"**
8. Search for and select: **"AmazonS3FullAccess"**
9. Click **"Next"** → **"Create user"**

#### Step 4: Create Access Keys
1. Click on the user you just created
2. Click **"Security credentials"** tab
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Application running outside AWS"**
6. Click **"Next"** → **"Create access key"**
7. **IMPORTANT:** Copy both:
   - **Access key ID**
   - **Secret access key** (click "Show" to reveal)
   - Save these securely - you won't see the secret again!

#### Step 5: Add to Your Project
1. Open `.env.local`
2. Add these lines:
   ```
   AWS_ACCESS_KEY_ID=your_access_key_here
   AWS_SECRET_ACCESS_KEY=your_secret_key_here
   AWS_S3_BUCKET_NAME=your_bucket_name_here
   AWS_REGION=us-east-1
   ```
   - Replace with your actual values

#### Step 6: Install AWS SDK
```bash
npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
```

#### Step 7: Update Code
Ask your developer to implement S3 upload/download using the AWS SDK.

**Cost:** AWS S3 free tier includes 5GB storage and 20,000 GET requests/month

---

## 4. Tools Compute Execution (Advanced - Requires Backend)

**What it does:** Runs tools on a backend server instead of in the browser.

**Why you need it:** Some tools need more processing power or can't run in browsers.

**Status:** This requires setting up a compute backend infrastructure. This is complex and typically requires:
- A server or cloud compute service (AWS Lambda, Google Cloud Functions, etc.)
- Job queue system (Redis + Bull, AWS SQS, etc.)
- Container orchestration (Docker, Kubernetes) for complex tools

**Recommendation:** 
- **For now:** Leave this as-is. The tools work in "Local" mode (browser-based)
- **When ready:** Hire a backend developer or use a service like:
  - **Vercel Serverless Functions** (easiest for Next.js)
  - **AWS Lambda** (more control)
  - **Google Cloud Run** (container-based)

**When to implement:** Only when you have tools that specifically need backend compute (e.g., heavy ML models, long-running processes).

---

## 5. AutoCode Generator TODOs (No Action Needed)

**What it does:** The AutoCode Generator creates code templates for users.

**Status:** ✅ **Already working perfectly!** 

**Important:** The TODOs in the templates are **intentional and correct**. They're placeholders that users fill in with their own logic.

**Example:** When someone uses the generator, they get:
```javascript
function processData(data) {
    // TODO: Implement function logic
    return data;
}
```

This is **exactly right** - the user then replaces the TODO with their actual implementation.

**Action needed:** ❌ **None** - This is working as designed.

---

## 6. Dashboard Polish (UX Improvement)

**What it does:** Improve the user experience of the risk-matrix-builder dashboard.

**Status:** Dashboard works, but could be more educational and user-friendly.

**What Needs Improvement:**
- Better explanations of risk matrix concepts
- More visual feedback
- Example scenarios
- Step-by-step guidance for first-time users
- Better color coding for different risk levels

**How to Find the File:**
1. The file is likely at: `src/app/dashboards/cybersecurity/risk-matrix-builder/page.tsx`
   - Or search for "risk-matrix-builder" in your codebase
2. Open it in your code editor

**What to Improve:**
- Add tooltips that explain "Likelihood" and "Impact" when users hover
- Add example risks to help users understand
- Add a "How to use" section at the top
- Improve color scheme (green = low risk, yellow = medium, red = high)
- Add a "Reset" button to clear the matrix

**Recommendation:** 
- This is a design/UX task
- Can be done by a frontend developer or designer
- No external services needed
- Low priority - dashboard works, just needs polish

**Action:** Optional improvement - can be done anytime.

---

## Quick Reference: Environment Variables

After completing the integrations, your `.env.local` file should include:

```env
# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn

# Vercel Blob Storage (if using Vercel)
BLOB_READ_WRITE_TOKEN=your_blob_token

# OR AWS S3 (if using AWS)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1

# Existing variables (don't change these)
DATABASE_URL=file:./data/dev.db
# ... other existing variables
```

---

## Priority Recommendations

**Do First:**
1. ✅ **Sentry Error Tracking** - Easy setup, immediate value
2. ✅ **Vercel Blob Storage** - Easy setup, enables file downloads

**Do Later:**
3. ⏳ **Tools Compute Execution** - Only when you have specific backend needs
4. ⏳ **Dashboard Polish** - Can be done anytime by a designer/developer

**Skip:**
5. ❌ **AutoCode Generator TODOs** - These are intentional placeholders

---

## Getting Help

### If You Get Stuck:

**Sentry:**
- Documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
- Support: https://sentry.io/support/
- Community: https://forum.sentry.io/

**Vercel Blob:**
- Documentation: https://vercel.com/docs/storage/vercel-blob
- Support: https://vercel.com/support
- Dashboard: https://vercel.com/dashboard

**AWS S3:**
- Documentation: https://docs.aws.amazon.com/s3/
- Support: https://aws.amazon.com/support/
- Console: https://console.aws.amazon.com/s3/

### For Code Changes:

If you're not comfortable editing code files, you can:
1. **Ask a developer** to help with Steps 6-7 in each section
2. **Share this guide** with them - they'll know what to do
3. **Use AI coding assistants** (like Cursor's AI) to help with the code changes

### Quick Checklist:

After setup, verify everything works:
- [ ] Sentry dashboard shows test errors (create a test error to verify)
- [ ] File downloads work (if you have attachments)
- [ ] No console errors in browser
- [ ] Environment variables are set correctly

---

## Summary

**What You Need to Do:**
1. ✅ Set up Sentry (15-20 min) - **Recommended**
2. ✅ Set up Vercel Blob (20-30 min) - **If you need file storage**
3. ⏳ Tools compute - **Skip for now** (works in Local mode)
4. ⏳ Dashboard polish - **Optional** (can do later)
5. ❌ AutoCode TODOs - **Skip** (working as designed)

**Total Time:** ~1 hour for the essential integrations

**Cost:** Free for development (both Sentry and Vercel have generous free tiers)

---

**Last Updated:** 2025-01-27
