# AI Studio - Getting Started Guide

## 🚀 **Quick Start**

Welcome to the AI Studio! This guide will help you get started with building, training, and deploying AI models.

---

## 📋 **Prerequisites**

- Node.js 18+ installed
- Next.js project set up
- Database configured (PostgreSQL recommended)
- Vercel account (for Blob Storage)

---

## 🔧 **Setup Steps**

### **1. Install Dependencies**

```bash
npm install @vercel/blob zod @prisma/client
```

### **2. Configure Environment Variables**

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ai-studio"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"

# Authentication (if using NextAuth)
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### **3. Set Up Database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### **4. Get Vercel Blob Token**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to Storage → Blob
3. Create a new store (or use existing)
4. Copy the `BLOB_READ_WRITE_TOKEN`
5. Add to `.env.local`

---

## 📚 **Basic Usage**

### **Upload a Dataset**

```typescript
import { api } from "@/lib/ai-studio/api-client";

// Upload file
const file = new File([...], "dataset.csv", { type: "text/csv" });
const dataset = await api.datasets.upload(file, {
  name: "My Dataset",
  license: "MIT",
  description: "Training data for sentiment analysis",
});
```

### **Create a Model**

```typescript
const model = await api.models.create({
  name: "Sentiment Classifier",
  type: "transformer",
  architecture: {
    layers: 12,
    hiddenSize: 768,
    attentionHeads: 12,
  },
});
```

### **Start Training**

```typescript
const job = await api.jobs.create({
  modelId: model.id,
  datasetId: dataset.id,
  computeType: "gpu",
  config: {
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
  },
});
```

### **Run an Agent**

```typescript
const result = await api.agents.run({
  agentId: "agent-id",
  input: "Analyze this text for sentiment",
  context: {
    model: "sentiment-classifier",
  },
});
```

---

## 🎨 **Using React Components**

### **Dataset Upload**

```tsx
import DatasetUpload from "@/components/ai-studio/DatasetUpload";

function MyPage() {
  return (
    <DatasetUpload
      onUploadComplete={(dataset) => {
        console.log("Uploaded:", dataset);
      }}
      onError={(error) => {
        console.error("Error:", error);
      }}
    />
  );
}
```

### **Dataset List**

```tsx
import DatasetsList from "@/components/ai-studio/DatasetsList";

function MyPage() {
  return (
    <DatasetsList
      onSelectDataset={(id) => {
        console.log("Selected:", id);
      }}
    />
  );
}
```

### **Training Job Monitor**

```tsx
import TrainingJobMonitor from "@/components/ai-studio/TrainingJobMonitor";

function MyPage() {
  return <TrainingJobMonitor jobId="job-id" />;
}
```

---

## 🎣 **Using React Hooks**

### **Manage Datasets**

```tsx
import { useDatasets } from "@/hooks/useDatasets";

function MyComponent() {
  const { datasets, isLoading, create } = useDatasets();

  const handleCreate = async () => {
    await create({
      name: "New Dataset",
      type: "csv",
      size: 1024,
      filePath: "/path/to/file",
      license: "MIT",
    });
  };

  return (
    <div>
      {isLoading ? "Loading..." : datasets.map(d => <div key={d.id}>{d.name}</div>)}
    </div>
  );
}
```

### **Monitor Training Job**

```tsx
import { useTrainingJob } from "@/hooks/useTrainingJob";

function MyComponent() {
  const { job, progress, metrics } = useTrainingJob({
    jobId: "job-id",
    pollInterval: 5000,
  });

  return (
    <div>
      <p>Progress: {progress}%</p>
      <p>Status: {job?.status}</p>
    </div>
  );
}
```

### **Handle Errors**

```tsx
import { useApiError } from "@/hooks/useApiError";
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";

function MyComponent() {
  const { error, handleError, retry } = useApiError();

  const fetchData = async () => {
    try {
      const data = await api.datasets.list();
      // ...
    } catch (err) {
      handleError(err);
    }
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} onRetry={retry(() => fetchData())} />}
      {/* ... */}
    </div>
  );
}
```

---

## 🔐 **Authentication**

All API routes require authentication. The `requireAuth` function checks for a valid session:

```typescript
import { requireAuth } from "@/lib/ai-studio/auth";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request);
  if (!auth.ok) return auth.response!;
  
  // User is authenticated
  const userId = auth.user!.id;
  // ...
}
```

---

## 📊 **Error Handling**

### **Using Error Utilities**

```typescript
import { formatError, handleError } from "@/lib/ai-studio/errors";

try {
  // ...
} catch (error) {
  const formatted = formatError(error);
  console.error(formatted.message);  // User-friendly message
  console.error(formatted.code);     // Error code
  console.error(formatted.retryable); // Can retry?
  
  // Or use helper
  handleError(error, "Operation context");
}
```

### **Error Display Component**

```tsx
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";

<ErrorDisplay
  error={error}
  onRetry={() => retryOperation()}
  onDismiss={() => clearError()}
/>
```

---

## 🎯 **Best Practices**

### **1. Use Type-Safe API Client**

```typescript
// ✅ Good
const dataset = await api.datasets.get("id");

// ❌ Bad
const response = await fetch("/api/ai-studio/datasets/id");
const dataset = await response.json();
```

### **2. Handle Errors Properly**

```typescript
// ✅ Good
try {
  const data = await api.datasets.list();
} catch (error) {
  handleError(error);
  // Show user-friendly message
}

// ❌ Bad
const data = await api.datasets.list(); // No error handling
```

### **3. Use Hooks for State Management**

```typescript
// ✅ Good
const { datasets, isLoading } = useDatasets();

// ❌ Bad
const [datasets, setDatasets] = useState([]);
useEffect(() => {
  fetch("/api/ai-studio/datasets")
    .then(r => r.json())
    .then(setDatasets);
}, []);
```

### **4. Show Loading States**

```tsx
// ✅ Good
{isLoading ? <LoadingSpinner /> : <DataList />}

// ❌ Bad
<DataList /> // No loading indicator
```

### **5. Validate Input**

```typescript
// ✅ Good
import { validateFileUpload } from "@/lib/ai-studio/validation";

const { valid, error } = validateFileUpload(file);
if (!valid) {
  alert(error);
  return;
}

// ❌ Bad
// No validation
```

---

## 📖 **Example Pages**

Check out the example pages for complete integration examples:

- `/ai-studio/datasets` - Dataset management
- `/ai-studio/agents` - Agent management
- `/ai-studio/poc-showcase` - POC components

---

## 🔗 **API Reference**

See [API Client Guide](./ai-studio-api-client-guide.md) for complete API documentation.

---

## 🆘 **Troubleshooting**

### **"Prisma not available" Warning**

This is normal if the database isn't set up yet. The system will use simulated responses until Prisma is configured.

### **"BLOB_READ_WRITE_TOKEN not configured"**

Make sure you've added the Vercel Blob token to your `.env.local` file.

### **Authentication Errors**

Ensure your authentication system is properly configured and users are logged in.

---

## 📚 **Next Steps**

1. **Explore Components**: Check out all available components in `src/components/ai-studio/`
2. **Read API Docs**: See the API client guide for detailed API documentation
3. **Review Examples**: Look at example pages for integration patterns
4. **Customize**: Adapt components and hooks to your needs

---

*Happy Building! 🚀*

