# AI Studio - Database Integration Guide

## 🗄️ **Database Setup**

This guide covers integrating the AI Studio with your database.

---

## 📋 **Prerequisites**

- PostgreSQL database (recommended) or SQLite (for development)
- Prisma installed (`npm install @prisma/client`)
- Database connection string

---

## 🔧 **Step 1: Merge Schema**

The AI Studio schema needs to be merged with your main Prisma schema.

### **Option A: Merge into Main Schema**

1. Open `prisma/schema.prisma`
2. Copy the relevant models from `prisma/schema-ai-studio.prisma`
3. Add to your main schema

### **Option B: Use Separate Schema (Advanced)**

If you prefer to keep schemas separate, you'll need to:
1. Configure multiple Prisma clients
2. Update database functions to use the correct client

---

## 📝 **Step 2: Add Models to Schema**

Add these models to your `prisma/schema.prisma`:

```prisma
model Dataset {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  type        String   // csv, json, jsonl, parquet
  size        Int
  filePath    String
  license     String
  status      String   @default("uploaded")
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
}

model Model {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  type        String
  architecture Json
  status      String   @default("created")
  version     String   @default("1.0.0")
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
}

model TrainingJob {
  id          String   @id @default(uuid())
  userId      String
  modelId     String
  datasetId   String
  status      String   @default("queued")
  progress    Int      @default(0)
  computeType String   @default("browser")
  config      Json
  metrics     Json?
  errorMessage String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
}

model Agent {
  id          String   @id @default(uuid())
  userId      String
  name        String
  description String?
  config      Json
  status      String   @default("created")
  version     String   @default("1.0.0")
  metadata    Json     @default("{}")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  deletedAt   DateTime?

  user User @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([status])
}
```

**Note**: Adjust the `User` relation based on your existing schema.

---

## 🚀 **Step 3: Run Migrations**

```bash
# Generate Prisma client
npx prisma generate

# Create migration
npx prisma migrate dev --name add_ai_studio_tables

# Or for production
npx prisma migrate deploy
```

---

## 🔌 **Step 4: Update Database Functions**

The database functions in `src/lib/ai-studio/db.ts` are already set up to use Prisma when available. They will automatically:

1. Try to import Prisma client
2. Use Prisma queries if available
3. Fall back to simulated responses if not

### **Enable Prisma Queries**

Once your schema is merged and migrations are run, the functions will automatically use Prisma. To force simulated mode (for testing), set:

```env
AI_STUDIO_USE_SIMULATED=true
```

---

## ✅ **Step 5: Verify Integration**

### **Test Database Connection**

```typescript
// Test in a API route or script
import { prisma } from "@/lib/db/prisma";

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");
    
    // Test query
    const count = await prisma.dataset.count();
    console.log(`Datasets: ${count}`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}
```

### **Test CRUD Operations**

```typescript
import { createDataset, listDatasets } from "@/lib/ai-studio/db";

// Create dataset
const dataset = await createDataset({
  userId: "user-id",
  name: "Test Dataset",
  type: "csv",
  size: 1024,
  filePath: "/path/to/file",
  license: "MIT",
});

// List datasets
const datasets = await listDatasets("user-id");
console.log("Datasets:", datasets);
```

---

## 🔍 **Troubleshooting**

### **"Prisma not available" Warning**

This is normal if:
- Prisma client isn't generated
- Schema isn't merged
- Database isn't connected

**Solution**: Follow steps 1-3 above.

### **"Model does not exist" Error**

This means the schema isn't merged or migrations haven't run.

**Solution**:
1. Verify models are in schema
2. Run `npx prisma generate`
3. Run `npx prisma migrate dev`

### **Connection Errors**

Check:
- `DATABASE_URL` is set correctly
- Database is running
- Credentials are correct
- Network/firewall allows connection

---

## 📊 **Database Functions Status**

All database functions in `src/lib/ai-studio/db.ts` support:

- ✅ Automatic Prisma detection
- ✅ Graceful fallback to simulated data
- ✅ Error handling
- ✅ User-based isolation
- ✅ Soft deletes

**Functions Ready**:
- `getDataset`, `createDataset`, `updateDataset`, `deleteDataset`, `listDatasets`
- `getModel`, `createModel`, `updateModel`, `deleteModel`, `listModels`
- `getTrainingJob`, `createTrainingJob`, `updateTrainingJob`, `listTrainingJobs`
- `getAgent`, `createAgent`, `updateAgent`, `deleteAgent`, `listAgents`

---

## 🎯 **Next Steps**

1. ✅ Merge schema (Step 1)
2. ✅ Run migrations (Step 3)
3. ✅ Test connection (Step 5)
4. ✅ Remove `AI_STUDIO_USE_SIMULATED` from `.env.local`
5. ✅ Test all API routes

---

*Last Updated: 2025-01-27*  
*Status: Ready for Integration*

