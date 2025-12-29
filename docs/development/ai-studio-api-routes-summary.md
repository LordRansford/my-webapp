# AI Studio API Routes - Complete Summary

## 📊 **Total Routes: 16**

All routes include:
- ✅ Authentication (`requireAuth`)
- ✅ Rate limiting (100 req/min)
- ✅ Origin validation (CSRF protection)
- ✅ Resource access verification
- ✅ Proper error handling
- ✅ Zod validation

---

## 🔌 **Route Inventory**

### **Datasets** (4 routes)

1. **GET `/api/ai-studio/datasets`**
   - List all datasets for user
   - Query params: `limit`, `offset`, `status`
   - Returns: Paginated list

2. **POST `/api/ai-studio/datasets`**
   - Create new dataset record
   - Body: `name`, `description`, `type`, `size`, `filePath`, `license`
   - Returns: Created dataset

3. **GET `/api/ai-studio/datasets/:id`**
   - Get dataset by ID
   - Returns: Dataset details
   - Errors: 404 (not found), 403 (forbidden)

4. **PUT `/api/ai-studio/datasets/:id`**
   - Update dataset
   - Body: `name?`, `description?`, `license?`
   - Returns: Updated dataset

5. **DELETE `/api/ai-studio/datasets/:id`**
   - Soft delete dataset
   - Returns: Success message

6. **POST `/api/ai-studio/datasets/upload`**
   - Upload dataset file
   - Form data: `file`
   - Returns: Upload result with dataset ID

7. **POST `/api/ai-studio/datasets/validate`**
   - Validate dataset for compliance
   - Body: `fileName`, `fileSize`, `fileType`, `license`, `attestation`
   - Returns: Validation results

---

### **Models** (4 routes)

8. **GET `/api/ai-studio/models`**
   - List all models for user
   - Query params: `limit`, `offset`, `status`
   - Returns: Paginated list

9. **POST `/api/ai-studio/models`**
   - Create new model
   - Body: `name`, `description`, `type`, `architecture`
   - Returns: Created model

10. **GET `/api/ai-studio/models/:id`**
    - Get model by ID
    - Returns: Model details
    - Errors: 404, 403

11. **PUT `/api/ai-studio/models/:id`**
    - Update model
    - Body: `name?`, `description?`, `architecture?`
    - Returns: Updated model

12. **DELETE `/api/ai-studio/models/:id`**
    - Soft delete model
    - Returns: Success message

13. **POST `/api/ai-studio/models/train`**
    - Create training job
    - Body: `modelId`, `datasetId`, `config`, `compute`
    - Returns: Training job ID

---

### **Training Jobs** (3 routes)

14. **GET `/api/ai-studio/jobs`**
    - List all training jobs for user
    - Query params: `limit`, `offset`, `status`
    - Returns: Paginated list

15. **GET `/api/ai-studio/jobs/:id`**
    - Get training job by ID
    - Returns: Job details with metrics
    - Errors: 404, 403

16. **POST `/api/ai-studio/jobs/:id/cancel`**
    - Cancel running job
    - Returns: Cancellation status

---

### **Agents** (4 routes)

17. **GET `/api/ai-studio/agents`**
    - List all agents for user
    - Query params: `limit`, `offset`, `status`
    - Returns: Paginated list

18. **POST `/api/ai-studio/agents`**
    - Create new agent
    - Body: `name`, `description`, `type`, `modelConfig`, `tools`, etc.
    - Returns: Created agent

19. **GET `/api/ai-studio/agents/:id`**
    - Get agent by ID
    - Returns: Agent details
    - Errors: 404, 403

20. **PUT `/api/ai-studio/agents/:id`**
    - Update agent
    - Body: `name?`, `description?`, `modelConfig?`, `tools?`, etc.
    - Returns: Updated agent

21. **DELETE `/api/ai-studio/agents/:id`**
    - Soft delete agent
    - Returns: Success message

22. **POST `/api/ai-studio/agents/run`**
    - Execute agent
    - Body: `agentId`, `input`, `context?`, `stream?`
    - Returns: Execution result

---

### **Compute & Utilities** (2 routes)

23. **POST `/api/ai-studio/compute/estimate`**
    - Estimate compute costs
    - Body: `type`, `model?`, `dataset?`, `config?`
    - Returns: Cost breakdown

---

## 🔒 **Security Features**

All routes implement:
- ✅ **Authentication**: NextAuth session required
- ✅ **Rate Limiting**: 100 requests per minute
- ✅ **Origin Validation**: CSRF protection
- ✅ **Resource Access**: User can only access their own resources
- ✅ **Input Validation**: Zod schemas for all inputs
- ✅ **Error Handling**: Consistent error responses

---

## 📝 **Error Response Format**

```typescript
{
  error: {
    code: "ERROR_CODE",
    message: "Human-readable message",
    details?: any // Additional context
  }
}
```

**Error Codes**:
- `UNAUTHORIZED` (401): Not authenticated
- `FORBIDDEN` (403): Access denied
- `NOT_FOUND` (404): Resource not found
- `VALIDATION_ERROR` (400): Invalid input
- `INTERNAL_ERROR` (500): Server error
- `INSUFFICIENT_TIER` (403): Tier too low

---

## 🎯 **Status**

- **Total Routes**: 16
- **Authentication**: ✅ 100%
- **Validation**: ✅ 100%
- **Error Handling**: ✅ 100%
- **Database Integration**: ⚠️ Ready (simulated until DB connected)

---

*Last Updated: 2025-01-27*  
*Status: API Structure Complete*

