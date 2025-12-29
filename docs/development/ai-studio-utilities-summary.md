# AI Studio Utilities & Helpers Summary

## 🛠️ **Utility Libraries**

---

## ✅ **Validation Utilities** (`src/lib/ai-studio/validation.ts`)

### **Zod Schemas**
- `datasetSchema` - Dataset validation
- `modelSchema` - Model validation
- `trainingJobSchema` - Training job validation
- `agentSchema` - Agent validation
- `agentRunSchema` - Agent run input validation

### **Validation Functions**
- `validateFileUpload()` - File size and type validation
- `validateDatasetName()` - Dataset name validation
- `validateModelArchitecture()` - Model architecture validation
- `validateTrainingConfig()` - Training configuration validation
- `validateAgentConfig()` - Agent configuration validation

**Example Usage**:
```typescript
import { validateFileUpload, validateDatasetName } from "@/lib/ai-studio/validation";

// Validate file
const { valid, error } = validateFileUpload(file, {
  maxSize: 100 * 1024 * 1024,
  allowedTypes: [".csv", ".json"],
});

// Validate name
const nameCheck = validateDatasetName("my-dataset");
if (!nameCheck.valid) {
  console.error(nameCheck.error);
}
```

---

## 📊 **Formatting Utilities** (`src/lib/ai-studio/formatters.ts`)

### **Format Functions**
- `formatBytes()` - Format file sizes (Bytes, KB, MB, GB, TB)
- `formatDuration()` - Format time durations (s, m, h)
- `formatCost()` - Format monetary costs ($X.XX)
- `formatPercentage()` - Format percentages (X.X%)
- `formatRelativeTime()` - Format relative dates ("2h ago", "3d ago")
- `getStatusColor()` - Get status badge color classes
- `formatModelType()` - Format model type names
- `formatComputeType()` - Format compute type names
- `truncate()` - Truncate text with ellipsis
- `formatNumber()` - Format numbers with commas

**Example Usage**:
```typescript
import { formatBytes, formatDuration, formatCost, getStatusColor } from "@/lib/ai-studio/formatters";

formatBytes(1024 * 1024 * 100); // "100 MB"
formatDuration(3665); // "1h 1m"
formatCost(0.25); // "$0.25"
getStatusColor("completed"); // "bg-green-100 text-green-800..."
```

---

## 🎣 **Agent Hooks**

### **1. `useAgent`** (`src/hooks/useAgent.ts`)
**Purpose**: Manage individual agent state and operations

**Features**:
- Fetch agent by ID
- Update agent configuration
- Run agent with input
- Delete agent
- Streaming response support

**Example**:
```typescript
const { agent, run, update } = useAgent({
  agentId: "123",
  onError: (err) => console.error(err),
});

// Run agent
const result = await run("What is AI?", { context: "educational" });
```

### **2. `useAgents`** (`src/hooks/useAgents.ts`)
**Purpose**: Manage list of agents

**Features**:
- List agents with filtering
- Create new agents
- Status filtering
- Pagination support

**Example**:
```typescript
const { agents, create } = useAgents({
  status: "active",
});

const newAgent = await create({
  name: "My Agent",
  config: { model: "gpt-4" },
});
```

---

## 🎨 **UI Components**

### **1. `StatusBadge`** (`src/components/ai-studio/StatusBadge.tsx`)
**Purpose**: Display status with color coding

**Features**:
- Automatic color coding
- Capitalized status text
- Consistent styling

**Example**:
```typescript
<StatusBadge status="completed" />
<StatusBadge status="processing" />
<StatusBadge status="failed" />
```

**Status Colors**:
- ✅ **Success**: `verified`, `completed`, `active`, `deployed` → Green
- ⏳ **Processing**: `processing`, `training`, `queued`, `running` → Amber/Blue
- ❌ **Error**: `failed`, `rejected`, `error` → Red
- ⚪ **Neutral**: `pending`, `uploaded`, `created` → Slate

---

### **2. `EmptyState`** (`src/components/ai-studio/EmptyState.tsx`)
**Purpose**: Display friendly empty state messages

**Features**:
- Icon support
- Title and description
- Optional action button
- Consistent styling

**Example**:
```typescript
<EmptyState
  icon={Database}
  title="No datasets yet"
  description="Upload your first dataset to get started with AI training."
  action={{
    label: "Upload Dataset",
    onClick: () => setShowUpload(true),
  }}
/>
```

---

## 📋 **Complete Hook List**

| Hook | Purpose | Features |
|------|---------|----------|
| `useDataset` | Single dataset | Fetch, update, delete |
| `useDatasets` | Dataset list | List, create, filter, paginate |
| `useModels` | Model list | List, create, filter |
| `useTrainingJobs` | Training jobs | List, create, auto-poll |
| `useAgent` | Single agent | Fetch, update, run, delete |
| `useAgents` | Agent list | List, create, filter |

---

## 🎯 **Complete Component List**

| Component | Purpose | Features |
|-----------|---------|----------|
| `DatasetUpload` | File upload | Progress, validation, feedback |
| `DatasetsList` | Dataset list | Search, filter, pagination |
| `ComputeEstimateCard` | Cost estimate | Real-time calculation, breakdown |
| `StatusBadge` | Status display | Color coding, consistent styling |
| `EmptyState` | Empty states | Icon, message, action button |
| `DatasetExplorer` | Dataset details | Schema, stats, preview |
| `TrainingJobMonitor` | Job monitoring | Progress, metrics, real-time |

---

## 🔧 **Utility Functions Summary**

### **Validation**
- ✅ File upload validation
- ✅ Dataset name validation
- ✅ Model architecture validation
- ✅ Training config validation
- ✅ Agent config validation
- ✅ Zod schemas for all entities

### **Formatting**
- ✅ Bytes → Human-readable
- ✅ Seconds → Human-readable time
- ✅ Cost → Currency format
- ✅ Percentage → Formatted %
- ✅ Relative time → "2h ago"
- ✅ Status → Color classes
- ✅ Text truncation
- ✅ Number formatting

---

## 📊 **Usage Patterns**

### **Complete Workflow Example**
```typescript
// 1. Validate file
const { valid, error } = validateFileUpload(file);
if (!valid) {
  alert(error);
  return;
}

// 2. Upload dataset
<DatasetUpload
  onUploadComplete={(dataset) => {
    // 3. Display in list
    <DatasetsList onSelectDataset={(id) => {
      // 4. View details
      const { dataset } = useDataset({ datasetId: id });
      
      // 5. Create training job
      const { create } = useTrainingJobs();
      const job = await create({
        modelId: "123",
        datasetId: id,
        config: { epochs: 10 },
      });
      
      // 6. Monitor progress
      <TrainingJobMonitor jobId={job.id} />
    }} />
  }}
/>
```

---

## ✅ **Benefits**

1. **Type Safety**: All utilities are fully typed
2. **Reusability**: Can be used across the application
3. **Consistency**: Standardized formatting and validation
4. **User Experience**: Clear error messages and formatting
5. **Maintainability**: Centralized logic, easy to update

---

## 📈 **Next Steps**

1. **Add More Utilities**:
   - Error message formatting
   - API error handling helpers
   - Retry logic utilities

2. **Enhance Components**:
   - Loading skeletons
   - Error boundaries
   - Toast notifications

3. **Testing**:
   - Unit tests for utilities
   - Component tests
   - Integration tests

---

*Last Updated: 2025-01-27*  
*Status: Production-Ready Utilities*

