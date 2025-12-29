# AI Studio API Client Guide

## 📡 **API Client Overview**

The AI Studio provides a centralized API client with automatic retry logic, error handling, and type safety.

---

## 🚀 **Quick Start**

### **Basic Usage**
```typescript
import { api } from "@/lib/ai-studio/api-client";

// List datasets
const datasets = await api.datasets.list({ limit: 10 });

// Get dataset
const dataset = await api.datasets.get("dataset-id");

// Create dataset
const newDataset = await api.datasets.create({
  name: "My Dataset",
  type: "csv",
  size: 1024,
  filePath: "/path/to/file",
  license: "MIT",
});

// Upload file
const uploaded = await api.datasets.upload(file, {
  name: "My Dataset",
  license: "MIT",
  description: "Optional description",
});
```

---

## 🎯 **API Methods**

### **Datasets**
```typescript
api.datasets.list(params?)           // List datasets
api.datasets.get(id)                 // Get dataset
api.datasets.create(data)            // Create dataset
api.datasets.update(id, data)        // Update dataset
api.datasets.delete(id)              // Delete dataset
api.datasets.upload(file, metadata)  // Upload file
```

### **Models**
```typescript
api.models.list(params?)      // List models
api.models.get(id)             // Get model
api.models.create(data)        // Create model
api.models.update(id, data)    // Update model
api.models.delete(id)           // Delete model
```

### **Training Jobs**
```typescript
api.jobs.list(params?)         // List jobs
api.jobs.get(id)               // Get job
api.jobs.create(data)          // Create training job
api.jobs.cancel(id)            // Cancel job
```

### **Agents**
```typescript
api.agents.list(params?)       // List agents
api.agents.get(id)             // Get agent
api.agents.create(data)         // Create agent
api.agents.update(id, data)     // Update agent
api.agents.delete(id)           // Delete agent
api.agents.run(data)           // Run agent
```

### **Compute**
```typescript
api.compute.estimate(data)     // Estimate compute cost
```

---

## 🔧 **Custom Client Configuration**

```typescript
import { AIStudioApiClient } from "@/lib/ai-studio/api-client";

const customClient = new AIStudioApiClient({
  baseUrl: "/api/ai-studio",
  timeout: 60000,        // 60 seconds
  retries: 5,            // 5 retries
  retryDelay: 2000,      // 2 seconds between retries
});

const data = await customClient.get("/datasets");
```

---

## ⚠️ **Error Handling**

### **Using Error Utilities**
```typescript
import { api } from "@/lib/ai-studio/api-client";
import { formatError, handleError } from "@/lib/ai-studio/errors";

try {
  const dataset = await api.datasets.get("invalid-id");
} catch (error) {
  const formatted = formatError(error);
  console.error(formatted.message);  // User-friendly message
  console.error(formatted.code);     // Error code
  console.error(formatted.retryable); // Can retry?
  
  // Or use helper
  handleError(error, "Dataset fetch");
}
```

### **Using Error Hook**
```typescript
import { useApiError } from "@/hooks/useApiError";

function MyComponent() {
  const { error, handleError, clearError, retry } = useApiError();

  const fetchData = async () => {
    try {
      const data = await api.datasets.list();
      clearError();
      return data;
    } catch (err) {
      handleError(err);
    }
  };

  // With retry
  const fetchWithRetry = async () => {
    return await retry(() => api.datasets.list());
  };

  return (
    <div>
      {error && <ErrorDisplay error={error} onRetry={fetchWithRetry} />}
      {/* ... */}
    </div>
  );
}
```

---

## 🎨 **Using Error Display Component**

```typescript
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";

function MyComponent() {
  const [error, setError] = useState<unknown>(null);

  const handleRetry = () => {
    setError(null);
    fetchData();
  };

  return (
    <div>
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={handleRetry}
          onDismiss={() => setError(null)}
        />
      )}
      {/* ... */}
    </div>
  );
}
```

---

## 🔄 **Retry Logic**

The API client automatically retries:
- **5xx server errors** (up to 3 times by default)
- **Network errors** (up to 3 times by default)
- **Exponential backoff** (1s, 2s, 3s delays)

You can customize retry behavior:
```typescript
const client = new AIStudioApiClient({
  retries: 5,
  retryDelay: 2000,
});
```

---

## 📊 **Complete Example**

```typescript
import { api } from "@/lib/ai-studio/api-client";
import { useApiError } from "@/hooks/useApiError";
import ErrorDisplay from "@/components/ai-studio/ErrorDisplay";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";

function DatasetsPage() {
  const { error, handleError, retry } = useApiError();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setLoading(true);
        const data = await retry(() => api.datasets.list({ limit: 20 }));
        setDatasets(data.datasets);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasets();
  }, [handleError, retry]);

  if (loading) {
    return <LoadingSpinner message="Loading datasets..." />;
  }

  return (
    <div>
      {error && (
        <ErrorDisplay
          error={error}
          onRetry={() => window.location.reload()}
        />
      )}
      {/* Render datasets */}
    </div>
  );
}
```

---

## ✅ **Best Practices**

1. **Always handle errors**: Use try/catch or error hooks
2. **Use retry for critical operations**: Let the client handle retries
3. **Display user-friendly messages**: Use `formatError()` for display
4. **Log errors in development**: Use `handleError()` for logging
5. **Show loading states**: Use `LoadingSpinner` component
6. **Provide retry options**: Use `ErrorDisplay` with retry button

---

## 🎯 **Error Codes**

| Code | Meaning | Retryable |
|------|---------|-----------|
| `UNAUTHORIZED` | Not authenticated | No |
| `FORBIDDEN` | No permission | No |
| `VALIDATION_ERROR` | Invalid input | No |
| `NOT_FOUND` | Resource missing | No |
| `INTERNAL_ERROR` | Server error | Yes |
| `NETWORK_ERROR` | Network failure | Yes |
| `TIMEOUT` | Request timeout | Yes |

---

*Last Updated: 2025-01-27*  
*Status: Production-Ready*

