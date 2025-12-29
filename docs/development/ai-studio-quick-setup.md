# AI Studio - Quick Setup Guide

## ⚡ **5-Minute Setup**

Get the AI Studio up and running quickly.

---

## 🚀 **Quick Start**

### **1. Run Setup Script**

**Linux/Mac:**
```bash
chmod +x scripts/setup-ai-studio.sh
./scripts/setup-ai-studio.sh
```

**Windows (PowerShell):**
```powershell
.\scripts\setup-ai-studio.ps1
```

### **2. Manual Setup (Alternative)**

#### **A. Environment Variables**

Create `.env.local`:

```env
# Database (required for full functionality)
DATABASE_URL="postgresql://user:password@localhost:5432/database"

# Vercel Blob Storage (required for file uploads)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Authentication (required)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### **B. Get Vercel Blob Token**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** → **Blob**
3. Create a new store (or use existing)
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add to `.env.local`

#### **C. Install Dependencies**

```bash
npm install
```

#### **D. Generate Prisma Client**

```bash
npx prisma generate
```

#### **E. Run Migrations (Optional)**

```bash
npx prisma migrate dev
```

---

## ✅ **Verify Setup**

### **1. Check Environment Variables**

```bash
# Linux/Mac
cat .env.local | grep -E "DATABASE_URL|BLOB_READ_WRITE_TOKEN|NEXTAUTH"

# Windows
findstr "DATABASE_URL BLOB_READ_WRITE_TOKEN NEXTAUTH" .env.local
```

### **2. Test Build**

```bash
npm run build
```

### **3. Start Development Server**

```bash
npm run dev
```

### **4. Visit AI Studio**

Open: http://localhost:3000/ai-studio

---

## 🎯 **What Works Without Database**

The AI Studio works in **simulated mode** without a database:

- ✅ All UI components
- ✅ All API routes (with simulated data)
- ✅ File uploads (if Blob token is set)
- ✅ Cost estimation
- ✅ Error handling
- ✅ All hooks and utilities

**Limitations**:
- Data is not persisted
- Simulated responses only
- No real database queries

---

## 🔧 **Enable Full Functionality**

### **Step 1: Set Up Database**

1. Create PostgreSQL database
2. Add `DATABASE_URL` to `.env.local`
3. Merge AI Studio schema (see [Database Integration Guide](./ai-studio-database-integration.md))
4. Run migrations: `npx prisma migrate dev`

### **Step 2: Set Up Storage**

1. Get Vercel Blob token
2. Add `BLOB_READ_WRITE_TOKEN` to `.env.local`

### **Step 3: Verify**

1. Restart dev server
2. Test file upload
3. Check database for records

---

## 🆘 **Troubleshooting**

### **"Prisma not available"**

**Normal** - System uses simulated data. To enable:
1. Set up database
2. Merge schema
3. Run migrations

### **"BLOB_READ_WRITE_TOKEN not configured"**

**Solution**: Get token from Vercel and add to `.env.local`

### **Build Errors**

**Solution**: 
```bash
npm install
npm run build
```

### **Database Connection Errors**

**Check**:
- `DATABASE_URL` is correct
- Database is running
- Credentials are valid

---

## 📚 **Next Steps**

- [Database Integration Guide](./ai-studio-database-integration.md) - Full database setup
- [Getting Started Guide](./ai-studio-getting-started.md) - Detailed usage
- [Deployment Guide](./ai-studio-deployment-guide.md) - Production deployment

---

*Last Updated: 2025-01-27*  
*Status: Ready to Use*

