# 🔗 Neon PostgreSQL Connection String Setup

## 📋 Step-by-Step Instructions

### Step 1: Get Your Connection String from Neon

1. **In Neon Console:**
   - You're already on the right page (Installation tab)
   - Click the **"Show secret"** button (eye icon) to reveal the connection strings
   - You'll see two options:
     - `DATABASE_URL` - **Use this one!** (Recommended for most uses)
     - `DATABASE_URL_UNPOOLED` - Only if you need direct connections (rare)

2. **Copy the `DATABASE_URL`:**
   - It will look like:
     ```
     postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
     ```
   - Click **"Copy Snippet"** or manually copy the value

---

### Step 2: Add to Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project (`my-webapp`)
   - Go to **Settings** → **Environment Variables**

2. **Add the Connection String:**
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the connection string you copied from Neon
   - **Environment**: Select **Production**, **Preview**, and **Development** (or just Production for now)
   - Click **Save**

3. **Verify:**
   - The variable should appear in your environment variables list
   - Make sure it's added to **Production** environment

---

### Step 3: Update Prisma Schema

Your Prisma schema needs to be updated to use PostgreSQL instead of SQLite:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Current state:**
```prisma
datasource db {
  provider = "sqlite"  // ❌ Change this
  url      = env("DATABASE_URL")
}
```

**After update:**
```prisma
datasource db {
  provider = "postgresql"  // ✅ Changed
  url      = env("DATABASE_URL")
}
```

---

### Step 4: Run Prisma Migrations

After updating the schema and adding the connection string:

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```
   
   Or create a migration:
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Verify Connection:**
   ```bash
   npx prisma studio
   ```
   This opens a browser UI to view your database tables.

---

### Step 5: Deploy to Vercel

1. **Commit your changes:**
   ```bash
   git add prisma/schema.prisma
   git commit -m "Update Prisma to use PostgreSQL"
   git push origin main
   ```

2. **Vercel will automatically:**
   - Detect the `DATABASE_URL` environment variable
   - Run Prisma migrations during build
   - Connect to your Neon database

---

## 🔍 Connection String Format

Your connection string will look like this:

```
postgresql://[user]:[password]@[host]/[database]?sslmode=require
```

**Example:**
```
postgresql://neondb_owner:abc123xyz@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
```

**Components:**
- `neondb_owner` - Database user
- `abc123xyz` - Password (auto-generated)
- `ep-cool-darkness-123456.us-east-2.aws.neon.tech` - Host (region-specific)
- `neondb` - Database name
- `?sslmode=require` - SSL connection required

---

## ⚠️ Important Notes

### Use `DATABASE_URL` (Not `DATABASE_URL_UNPOOLED`)

- **`DATABASE_URL`**: Uses connection pooling (pgbouncer) - **Recommended**
  - Better for serverless (Vercel)
  - Handles many concurrent connections
  - More efficient

- **`DATABASE_URL_UNPOOLED`**: Direct connection (no pooling)
  - Only use if you need:
    - Database extensions that don't work with pgbouncer
    - Long-running transactions
    - Specific PostgreSQL features

**For your use case (Next.js on Vercel): Use `DATABASE_URL` ✅**

---

## 🧪 Test Your Connection

After setting up, test locally:

1. **Create `.env.local` file:**
   ```bash
   DATABASE_URL=postgresql://...your-connection-string...
   ```

2. **Test connection:**
   ```bash
   npx prisma db pull
   ```
   This will connect and fetch your database schema.

3. **Run migrations:**
   ```bash
   npx prisma migrate dev
   ```

---

## ✅ Checklist

- [ ] Clicked "Show secret" in Neon console
- [ ] Copied `DATABASE_URL` (not UNPOOLED)
- [ ] Added `DATABASE_URL` to Vercel environment variables (Production)
- [ ] Updated `prisma/schema.prisma` to use `postgresql`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push` or `npx prisma migrate dev`
- [ ] Committed and pushed changes
- [ ] Verified deployment on Vercel

---

## 🚨 Troubleshooting

### "Connection refused" or "Connection timeout"
- Check that `DATABASE_URL` is correctly set in Vercel
- Verify the connection string is complete (no missing parts)
- Ensure SSL is enabled (`?sslmode=require`)

### "Schema does not match"
- Run `npx prisma db push` to sync schema
- Or create a migration: `npx prisma migrate dev --name init`

### "Too many connections"
- This shouldn't happen with `DATABASE_URL` (it uses pooling)
- If it does, check your connection management in code

---

## 📚 Next Steps

Once your database is connected:

1. ✅ Your app will use PostgreSQL instead of SQLite
2. ✅ Data will persist across deployments
3. ✅ You can scale to enterprise workloads
4. ✅ All your Prisma models will work with PostgreSQL

**You're almost live!** 🚀
