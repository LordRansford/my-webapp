# AI Studio - Deployment Guide

## 🚀 **Deployment Checklist**

This guide covers deploying the AI Studio to production.

---

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables**

Ensure all required environment variables are set:

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/database"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Optional: Feature flags
AI_STUDIO_ENABLED="true"
AI_STUDIO_MAX_FILE_SIZE="104857600"  # 100MB
```

### **2. Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Verify connection
npx prisma db pull
```

### **3. Vercel Blob Storage**

1. Create a Blob store in Vercel Dashboard
2. Get the `BLOB_READ_WRITE_TOKEN`
3. Add to environment variables
4. Test upload functionality

### **4. Build Verification**

```bash
# Build the project
npm run build

# Check for errors
npm run lint

# Run type check
npm run type-check  # if available
```

---

## 🌐 **Vercel Deployment**

### **Step 1: Connect Repository**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your Git repository
4. Configure build settings

### **Step 2: Configure Build Settings**

**Build Command**: `npm run build`  
**Output Directory**: `.next`  
**Install Command**: `npm install`

### **Step 3: Set Environment Variables**

Add all environment variables in Vercel Dashboard:
- `DATABASE_URL`
- `BLOB_READ_WRITE_TOKEN`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

### **Step 4: Deploy**

1. Click "Deploy"
2. Wait for build to complete
3. Verify deployment

---

## 🗄️ **Database Migration**

### **Production Migration**

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/database"

# Run migrations
npx prisma migrate deploy

# Verify
npx prisma db pull
```

### **Migration Best Practices**

1. **Test migrations locally first**
2. **Backup database before migration**
3. **Run migrations during low-traffic periods**
4. **Monitor migration progress**
5. **Have rollback plan ready**

---

## 🔒 **Security Checklist**

### **Authentication**

- ✅ NextAuth.js configured
- ✅ Session management enabled
- ✅ CSRF protection enabled
- ✅ Rate limiting configured

### **API Security**

- ✅ All routes require authentication
- ✅ Input validation (Zod schemas)
- ✅ File upload validation
- ✅ Size limits enforced
- ✅ Type restrictions enforced

### **Storage Security**

- ✅ Path-based isolation (`ai-studio/{userId}/...`)
- ✅ Authentication required for downloads
- ✅ Signed URLs for temporary access
- ✅ No direct URL exposure

### **Data Privacy**

- ✅ PII detection in validation
- ✅ Data encryption at rest
- ✅ Secure file uploads
- ✅ Access control enforced

---

## 📊 **Monitoring & Logging**

### **Error Tracking**

Consider integrating:
- **Sentry** for error tracking
- **LogRocket** for session replay
- **Vercel Analytics** for performance

### **Example: Sentry Integration**

```typescript
// src/lib/ai-studio/errors.ts
import * as Sentry from "@sentry/nextjs";

export function handleError(error: unknown, context?: string): void {
  // ... existing code ...
  
  if (process.env.NODE_ENV === "production") {
    Sentry.captureException(error, {
      tags: { context },
      level: getErrorSeverity(error) === "error" ? "error" : "warning",
    });
  }
}
```

### **Performance Monitoring**

- Monitor API response times
- Track file upload success rates
- Monitor training job completion rates
- Track error rates

---

## 🔧 **Configuration**

### **File Size Limits**

```typescript
// src/lib/ai-studio/storage.ts
export const STORAGE_CONFIG: StorageConfig = {
  provider: "vercel-blob",
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: [".csv", ".json", ".jsonl", ".parquet"],
};
```

### **Rate Limiting**

```typescript
// src/lib/ai-studio/auth.ts
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
};
```

### **Compute Limits**

```typescript
// src/lib/ai-studio/compute.ts
export const COMPUTE_LIMITS = {
  free: {
    maxTrainingHours: 1,
    maxConcurrentJobs: 1,
  },
  paid: {
    maxTrainingHours: 100,
    maxConcurrentJobs: 5,
  },
};
```

---

## 🧪 **Testing Before Deployment**

### **1. API Testing**

```bash
# Test authentication
curl -X GET https://your-domain.com/api/ai-studio/datasets \
  -H "Cookie: next-auth.session-token=..."

# Test file upload
curl -X POST https://your-domain.com/api/ai-studio/datasets/upload \
  -F "file=@test.csv" \
  -F "name=Test Dataset" \
  -F "license=MIT"
```

### **2. Component Testing**

- Test all UI components
- Verify error handling
- Check loading states
- Test responsive design

### **3. Integration Testing**

- Test complete workflows
- Verify database operations
- Test file storage
- Check authentication flow

---

## 📈 **Post-Deployment**

### **1. Verify Functionality**

- [ ] User authentication works
- [ ] File uploads succeed
- [ ] Datasets can be created
- [ ] Models can be created
- [ ] Training jobs can be started
- [ ] Agents can be created and run

### **2. Monitor Performance**

- Check API response times
- Monitor error rates
- Track file upload success
- Watch database performance

### **3. Set Up Alerts**

- Error rate alerts
- Performance degradation alerts
- Storage quota alerts
- Database connection alerts

---

## 🔄 **Rollback Plan**

### **If Deployment Fails**

1. **Revert to previous deployment** in Vercel
2. **Check logs** for errors
3. **Verify environment variables**
4. **Test database connection**
5. **Re-deploy after fixes**

### **Database Rollback**

```bash
# List migrations
npx prisma migrate status

# Rollback last migration (if needed)
# Note: Prisma doesn't support automatic rollback
# You'll need to create a new migration to undo changes
```

---

## 🎯 **Production Best Practices**

### **1. Use Environment Variables**

Never hardcode secrets or configuration.

### **2. Enable Caching**

```typescript
// API routes
export const revalidate = 60; // Revalidate every 60 seconds
```

### **3. Monitor Resource Usage**

- Database connections
- Storage usage
- API rate limits
- Compute costs

### **4. Regular Backups**

- Database backups (daily)
- Configuration backups
- Environment variable backups

### **5. Security Updates**

- Keep dependencies updated
- Monitor security advisories
- Apply patches promptly

---

## 📚 **Additional Resources**

- [Vercel Deployment Docs](https://vercel.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

*Last Updated: 2025-01-27*  
*Status: Production-Ready*

