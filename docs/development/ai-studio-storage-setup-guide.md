# AI Studio Storage Setup Guide - Vercel Blob

## 🎯 **Recommendation: Vercel Blob Storage**

**For your Vercel deployment, Vercel Blob Storage is the best choice.**

---

## ✅ **Why Vercel Blob?**

1. **No New Account Needed** - Uses your existing Vercel account
2. **Zero Configuration** - Works out of the box
3. **Perfect Integration** - Built specifically for Vercel
4. **Free Tier** - 100GB storage + 100GB egress/month free
5. **Security Built-in** - Private by default, HTTPS-only
6. **Fast Implementation** - Can be set up in minutes

---

## 🚀 **Setup Steps**

### **Step 1: Get Your Token**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Storage** → **Blob**
4. Click **Create Blob Store** (if you don't have one)
5. Copy the **`BLOB_READ_WRITE_TOKEN`**

### **Step 2: Add Environment Variable**

**Local Development** (`.env.local`):
```bash
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxx
```

**Vercel Production**:
1. Go to Project Settings → Environment Variables
2. Add `BLOB_READ_WRITE_TOKEN` with your token
3. Apply to all environments (Production, Preview, Development)

### **Step 3: Package Already Installed**

The `@vercel/blob` package is already installed in your project.

### **Step 4: Code Already Implemented**

The storage utilities are already implemented:
- ✅ `src/lib/ai-studio/storage.ts` - Storage functions
- ✅ `src/app/api/ai-studio/datasets/upload/route.ts` - Upload endpoint
- ✅ `src/app/api/ai-studio/storage/download/route.ts` - Download endpoint

**You just need to fix the TypeScript types** (see below).

---

## 🔧 **Quick Fix Needed**

There's a minor TypeScript issue with the `put()` function. Here's the fix:

**In `src/lib/ai-studio/storage.ts`**, change line 60-64 to:

```typescript
// Upload to Vercel Blob
const arrayBuffer = await file.arrayBuffer();
const blob = await put(pathname, arrayBuffer, {
  access: "private" as const,
  contentType: file.type || "application/octet-stream",
});
```

---

## 📊 **Cost Comparison**

### **Phase 1 (Expected Usage: <100GB)**
- **Vercel Blob**: **FREE** ✅
- **AWS S3**: Free tier (5GB, 12 months)
- **Cloudflare R2**: Free tier (10GB)

### **Scale (500GB storage, 200GB egress/month)**
- **Vercel Blob**: $75 + $20 = **$95/month**
- **AWS S3**: $11.50 + $18 = **$29.50/month**
- **Cloudflare R2**: $7.50 + $0 = **$7.50/month**

**Recommendation**: Start with Vercel Blob (free), migrate to R2 if egress costs become significant.

---

## 🔒 **Security Features**

✅ **Private by Default**: All files are private
✅ **Access Control**: User-based path isolation (`ai-studio/{userId}/...`)
✅ **Authentication Required**: All downloads require auth
✅ **HTTPS Only**: All transfers encrypted
✅ **Signed URLs**: Temporary access via `getDownloadUrl()`

---

## 🛡️ **Abuse Prevention**

✅ **Rate Limiting**: Via Vercel's infrastructure (100 req/min)
✅ **File Size Limits**: 100MB per file (configurable)
✅ **Type Validation**: Only allowed file types
✅ **User Isolation**: Files separated by user ID
✅ **DDoS Protection**: Built into Vercel

---

## 📋 **What You Need to Do**

1. ✅ **Get Token**: From Vercel Dashboard (5 minutes)
2. ✅ **Add Environment Variable**: `.env.local` + Vercel (2 minutes)
3. ⚠️ **Fix TypeScript**: Update `storage.ts` (1 minute)
4. ✅ **Test Upload**: Try uploading a dataset (5 minutes)

**Total Time: ~15 minutes**

---

## 🔄 **Migration Path (If Needed)**

If you outgrow Vercel Blob:

1. **To Cloudflare R2** (Best for high egress):
   - S3-compatible API
   - Zero egress fees
   - Easy migration

2. **To AWS S3** (Best for enterprise):
   - Maximum control
   - Compliance features
   - More complex setup

**The storage abstraction layer makes migration easy** - just update `storage.ts`.

---

## ✅ **Next Steps**

1. Get your `BLOB_READ_WRITE_TOKEN` from Vercel
2. Add it to environment variables
3. Fix the TypeScript issue in `storage.ts`
4. Test file upload
5. Deploy!

---

*Last Updated: 2025-01-27*  
*Status: Ready for Setup*

