# AI Studio API Specification

## Overview

This document provides comprehensive API specifications for the AI Studio platform, including REST, GraphQL, and WebSocket APIs.

**Base URL**: `https://api.ransfordsnotes.com/v1`

**Authentication**: Bearer Token (JWT) or API Key

**Content-Type**: `application/json`

---

## Table of Contents

1. [Authentication APIs](#authentication-apis)
2. [Dataset APIs](#dataset-apis)
3. [Model APIs](#model-apis)
4. [Training Job APIs](#training-job-apis)
5. [Agent APIs](#agent-apis)
6. [Deployment APIs](#deployment-apis)
7. [Compute APIs](#compute-apis)
8. [User & Account APIs](#user--account-apis)
9. [Educational APIs](#educational-apis)
10. [WebSocket APIs](#websocket-apis)
11. [Error Handling](#error-handling)
12. [Rate Limiting](#rate-limiting)

---

## Authentication APIs

### POST /auth/login

Authenticate user and receive access token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "rememberMe": true
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "name": "John Doe",
    "tier": "free",
    "avatar": "https://..."
  }
}
```

### POST /auth/refresh

Refresh access token using refresh token.

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### POST /auth/logout

Invalidate refresh token.

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

### GET /auth/me

Get current user information.

**Response** (200 OK):
```json
{
  "id": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "tier": "professional",
  "avatar": "https://...",
  "createdAt": "2024-01-01T00:00:00Z",
  "usage": {
    "computeHours": 5.2,
    "storageUsed": 1024000000,
    "storageLimit": 10737418240
  }
}
```

---

## Dataset APIs

### GET /datasets

List user's datasets with filtering and pagination.

**Query Parameters**:
- `page` (integer, default: 1): Page number
- `limit` (integer, default: 20, max: 100): Items per page
- `search` (string): Search query
- `type` (string): Filter by type (csv, json, parquet)
- `license` (string): Filter by license
- `sort` (string): Sort field (createdAt, name, size)
- `order` (string): Sort order (asc, desc)

**Response** (200 OK):
```json
{
  "datasets": [
    {
      "id": "dataset_123",
      "name": "Customer Data",
      "type": "csv",
      "size": 1048576,
      "rows": 10000,
      "columns": 15,
      "license": "user-owned",
      "status": "verified",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3
  }
}
```

### POST /datasets

Upload a new dataset.

**Request** (multipart/form-data):
- `file` (file, required): Dataset file
- `name` (string, required): Dataset name
- `description` (string, optional): Dataset description
- `license` (string, required): License type
- `attestation` (boolean, required): User attestation checkbox

**Response** (201 Created):
```json
{
  "id": "dataset_123",
  "name": "Customer Data",
  "status": "uploading",
  "uploadProgress": 0,
  "estimatedTime": 30
}
```

### GET /datasets/:id

Get dataset details.

**Response** (200 OK):
```json
{
  "id": "dataset_123",
  "name": "Customer Data",
  "description": "Customer purchase data",
  "type": "csv",
  "size": 1048576,
  "rows": 10000,
  "columns": 15,
  "license": "user-owned",
  "status": "verified",
  "schema": {
    "columns": [
      {
        "name": "age",
        "type": "numeric",
        "nullable": false,
        "min": 18,
        "max": 80,
        "mean": 35.5
      },
      {
        "name": "purchased",
        "type": "categorical",
        "nullable": false,
        "categories": ["yes", "no"],
        "distribution": {"yes": 0.6, "no": 0.4}
      }
    ]
  },
  "statistics": {
    "missingValues": 0,
    "duplicates": 5,
    "qualityScore": 0.95
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /datasets/:id/validate

Validate dataset for legal compliance and quality.

**Response** (200 OK):
```json
{
  "status": "valid",
  "checks": {
    "license": {
      "status": "verified",
      "license": "user-owned",
      "verified": true
    },
    "copyright": {
      "status": "clear",
      "watermarks": false,
      "knownContent": false
    },
    "quality": {
      "status": "good",
      "score": 0.95,
      "issues": []
    },
    "pii": {
      "status": "clear",
      "detected": false
    }
  },
  "warnings": [],
  "errors": []
}
```

### GET /datasets/:id/preview

Get dataset preview (first N rows).

**Query Parameters**:
- `rows` (integer, default: 10, max: 100): Number of rows

**Response** (200 OK):
```json
{
  "columns": ["age", "income", "purchased"],
  "rows": [
    [25, 50000, "yes"],
    [35, 75000, "no"],
    [45, 100000, "yes"]
  ],
  "totalRows": 10000
}
```

### DELETE /datasets/:id

Delete dataset.

**Response** (200 OK):
```json
{
  "message": "Dataset deleted successfully"
}
```

---

## Model APIs

### GET /models

List user's models.

**Query Parameters**: Same as datasets

**Response** (200 OK):
```json
{
  "models": [
    {
      "id": "model_123",
      "name": "Purchase Predictor",
      "type": "classification",
      "status": "trained",
      "accuracy": 0.92,
      "version": "1.0.0",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /models

Create a new model.

**Request Body**:
```json
{
  "name": "Purchase Predictor",
  "description": "Predicts customer purchases",
  "type": "classification",
  "architecture": {
    "type": "neural-network",
    "layers": [
      {"type": "dense", "units": 64, "activation": "relu"},
      {"type": "dense", "units": 32, "activation": "relu"},
      {"type": "dense", "units": 1, "activation": "sigmoid"}
    ]
  },
  "datasetId": "dataset_123",
  "targetColumn": "purchased",
  "featureColumns": ["age", "income"],
  "trainingConfig": {
    "learningRate": 0.001,
    "batchSize": 32,
    "epochs": 100,
    "validationSplit": 0.2
  }
}
```

**Response** (201 Created):
```json
{
  "id": "model_123",
  "name": "Purchase Predictor",
  "status": "created",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /models/:id

Get model details.

**Response** (200 OK):
```json
{
  "id": "model_123",
  "name": "Purchase Predictor",
  "description": "Predicts customer purchases",
  "type": "classification",
  "status": "trained",
  "version": "1.0.0",
  "architecture": {...},
  "trainingData": {
    "datasetId": "dataset_123",
    "rows": 8000,
    "features": ["age", "income"]
  },
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.89,
    "recall": 0.91,
    "f1": 0.90
  },
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### POST /models/:id/train

Start training a model.

**Request Body**:
```json
{
  "config": {
    "learningRate": 0.001,
    "batchSize": 32,
    "epochs": 100,
    "validationSplit": 0.2,
    "callbacks": ["early-stopping", "checkpoint"]
  },
  "compute": {
    "type": "browser" | "backend",
    "gpu": true
  }
}
```

**Response** (202 Accepted):
```json
{
  "jobId": "job_123",
  "status": "queued",
  "estimatedTime": 300,
  "estimatedCost": 0.50
}
```

### GET /models/:id/training

Get training status.

**Response** (200 OK):
```json
{
  "status": "training",
  "progress": 0.65,
  "currentEpoch": 65,
  "totalEpochs": 100,
  "metrics": {
    "loss": 0.15,
    "accuracy": 0.92,
    "valLoss": 0.18,
    "valAccuracy": 0.90
  },
  "estimatedTimeRemaining": 120
}
```

### POST /models/:id/evaluate

Evaluate model on a dataset.

**Request Body**:
```json
{
  "datasetId": "dataset_456",
  "metrics": ["accuracy", "precision", "recall", "f1", "confusion-matrix"]
}
```

**Response** (200 OK):
```json
{
  "metrics": {
    "accuracy": 0.92,
    "precision": 0.89,
    "recall": 0.91,
    "f1": 0.90
  },
  "confusionMatrix": {
    "truePositives": 1800,
    "falsePositives": 200,
    "trueNegatives": 1600,
    "falseNegatives": 400
  },
  "perClass": {
    "yes": {"precision": 0.90, "recall": 0.82},
    "no": {"precision": 0.88, "recall": 0.95}
  }
}
```

### POST /models/:id/predict

Make predictions with a model.

**Request Body**:
```json
{
  "inputs": [
    {"age": 25, "income": 50000},
    {"age": 35, "income": 75000}
  ]
}
```

**Response** (200 OK):
```json
{
  "predictions": [
    {"class": "yes", "probability": 0.85},
    {"class": "no", "probability": 0.72}
  ],
  "modelVersion": "1.0.0"
}
```

### POST /models/:id/deploy

Deploy a model.

**Request Body**:
```json
{
  "target": "api" | "browser" | "container" | "edge",
  "config": {
    "name": "purchase-predictor-api",
    "replicas": 2,
    "autoScaling": {
      "min": 1,
      "max": 10,
      "targetCPU": 70
    },
    "environment": "production"
  }
}
```

**Response** (202 Accepted):
```json
{
  "deploymentId": "deployment_123",
  "status": "deploying",
  "url": "https://api.ransfordsnotes.com/v1/deployments/deployment_123/predict"
}
```

### DELETE /models/:id

Delete model.

**Response** (200 OK):
```json
{
  "message": "Model deleted successfully"
}
```

---

## Training Job APIs

### GET /jobs

List training jobs.

**Query Parameters**: Same as datasets, plus:
- `status` (string): Filter by status (queued, running, completed, failed)
- `modelId` (string): Filter by model

**Response** (200 OK):
```json
{
  "jobs": [
    {
      "id": "job_123",
      "modelId": "model_123",
      "status": "completed",
      "progress": 1.0,
      "startedAt": "2024-01-01T00:00:00Z",
      "completedAt": "2024-01-01T00:05:00Z",
      "duration": 300,
      "cost": 0.50
    }
  ],
  "pagination": {...}
}
```

### GET /jobs/:id

Get job details.

**Response** (200 OK):
```json
{
  "id": "job_123",
  "modelId": "model_123",
  "status": "running",
  "progress": 0.65,
  "currentEpoch": 65,
  "totalEpochs": 100,
  "metrics": {
    "loss": [0.5, 0.3, 0.2, ...],
    "accuracy": [0.7, 0.85, 0.90, ...]
  },
  "startedAt": "2024-01-01T00:00:00Z",
  "estimatedCompletion": "2024-01-01T00:05:00Z"
}
```

### GET /jobs/:id/logs

Get job logs.

**Query Parameters**:
- `lines` (integer, default: 100, max: 1000): Number of lines
- `level` (string): Filter by level (info, warning, error)

**Response** (200 OK):
```json
{
  "logs": [
    {
      "timestamp": "2024-01-01T00:00:00Z",
      "level": "info",
      "message": "Starting training..."
    },
    {
      "timestamp": "2024-01-01T00:00:01Z",
      "level": "info",
      "message": "Epoch 1/100: loss=0.5, accuracy=0.7"
    }
  ]
}
```

### GET /jobs/:id/metrics

Get job metrics (real-time).

**Response** (200 OK):
```json
{
  "metrics": {
    "loss": {
      "current": 0.15,
      "history": [0.5, 0.3, 0.2, 0.15],
      "best": 0.15
    },
    "accuracy": {
      "current": 0.92,
      "history": [0.7, 0.85, 0.90, 0.92],
      "best": 0.92
    }
  },
  "epoch": 65,
  "timestamp": "2024-01-01T00:03:00Z"
}
```

### POST /jobs/:id/cancel

Cancel a running job.

**Response** (200 OK):
```json
{
  "message": "Job cancellation requested",
  "status": "cancelling"
}
```

---

## Agent APIs

### GET /agents

List user's agents.

**Response** (200 OK):
```json
{
  "agents": [
    {
      "id": "agent_123",
      "name": "Research Assistant",
      "type": "single",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### POST /agents

Create a new agent.

**Request Body**:
```json
{
  "name": "Research Assistant",
  "description": "Helps with research tasks",
  "type": "single",
  "model": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.7
  },
  "tools": [
    {
      "type": "web-search",
      "config": {"engine": "google"}
    },
    {
      "type": "code-execution",
      "config": {"language": "python"}
    }
  ],
  "memory": {
    "type": "conversation",
    "maxTokens": 4000
  },
  "systemPrompt": "You are a helpful research assistant..."
}
```

**Response** (201 Created):
```json
{
  "id": "agent_123",
  "name": "Research Assistant",
  "status": "created",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### GET /agents/:id

Get agent details.

**Response** (200 OK):
```json
{
  "id": "agent_123",
  "name": "Research Assistant",
  "type": "single",
  "status": "active",
  "model": {...},
  "tools": [...],
  "memory": {...},
  "stats": {
    "runs": 150,
    "successRate": 0.95,
    "avgCost": 0.02,
    "totalCost": 3.00
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST /agents/:id/run

Execute an agent.

**Request Body**:
```json
{
  "input": "Research the latest developments in AI",
  "context": {},
  "stream": true
}
```

**Response** (200 OK, streaming):
```json
{
  "executionId": "exec_123",
  "status": "running",
  "output": "Based on my research...",
  "steps": [
    {
      "type": "tool",
      "tool": "web-search",
      "input": "latest AI developments",
      "output": "..."
    }
  ],
  "cost": 0.02,
  "tokens": 500
}
```

### GET /agents/:id/executions

Get agent execution history.

**Response** (200 OK):
```json
{
  "executions": [
    {
      "id": "exec_123",
      "status": "completed",
      "input": "Research AI",
      "output": "...",
      "cost": 0.02,
      "duration": 5,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

## Deployment APIs

### GET /deployments

List deployments.

**Response** (200 OK):
```json
{
  "deployments": [
    {
      "id": "deployment_123",
      "name": "purchase-predictor-api",
      "modelId": "model_123",
      "status": "active",
      "url": "https://api.ransfordsnotes.com/v1/deployments/deployment_123/predict",
      "replicas": 2,
      "requests": 15000,
      "avgLatency": 45,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {...}
}
```

### GET /deployments/:id

Get deployment details.

**Response** (200 OK):
```json
{
  "id": "deployment_123",
  "name": "purchase-predictor-api",
  "modelId": "model_123",
  "status": "active",
  "target": "api",
  "url": "https://api.ransfordsnotes.com/v1/deployments/deployment_123/predict",
  "config": {
    "replicas": 2,
    "autoScaling": {
      "min": 1,
      "max": 10,
      "targetCPU": 70
    }
  },
  "metrics": {
    "requests": 15000,
    "avgLatency": 45,
    "p95Latency": 120,
    "p99Latency": 200,
    "errorRate": 0.001,
    "throughput": 100
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### POST /deployments/:id/scale

Scale deployment.

**Request Body**:
```json
{
  "replicas": 5
}
```

**Response** (200 OK):
```json
{
  "message": "Scaling initiated",
  "currentReplicas": 2,
  "targetReplicas": 5,
  "estimatedTime": 30
}
```

### GET /deployments/:id/metrics

Get deployment metrics.

**Query Parameters**:
- `start` (datetime): Start time
- `end` (datetime): End time
- `granularity` (string): 1m, 5m, 1h, 1d

**Response** (200 OK):
```json
{
  "metrics": {
    "requests": {
      "total": 15000,
      "perSecond": 100,
      "timeline": [...]
    },
    "latency": {
      "avg": 45,
      "p50": 40,
      "p95": 120,
      "p99": 200,
      "timeline": [...]
    },
    "errors": {
      "total": 15,
      "rate": 0.001,
      "timeline": [...]
    }
  },
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-01T23:59:59Z"
  }
}
```

### DELETE /deployments/:id

Delete deployment.

**Response** (200 OK):
```json
{
  "message": "Deployment deleted successfully"
}
```

---

## Compute APIs

### POST /compute/estimate

Estimate compute cost for a training job.

**Request Body**:
```json
{
  "type": "training",
  "model": {
    "type": "neural-network",
    "parameters": 1000000,
    "layers": 3
  },
  "dataset": {
    "size": 1048576,
    "rows": 10000
  },
  "config": {
    "epochs": 100,
    "batchSize": 32,
    "gpu": true
  }
}
```

**Response** (200 OK):
```json
{
  "estimatedCost": 0.50,
  "estimatedTime": 300,
  "breakdown": {
    "compute": 0.40,
    "storage": 0.05,
    "network": 0.05
  },
  "tier": "professional"
}
```

### GET /compute/usage

Get current usage statistics.

**Query Parameters**:
- `start` (datetime): Start date
- `end` (datetime): End date

**Response** (200 OK):
```json
{
  "period": {
    "start": "2024-01-01T00:00:00Z",
    "end": "2024-01-31T23:59:59Z"
  },
  "usage": {
    "computeHours": 5.2,
    "storageGB": 10.0,
    "requests": 15000
  },
  "cost": {
    "total": 2.60,
    "compute": 2.00,
    "storage": 0.50,
    "network": 0.10
  },
  "limits": {
    "computeHours": 10,
    "storageGB": 100,
    "requests": 100000
  }
}
```

### GET /compute/history

Get usage history.

**Response** (200 OK):
```json
{
  "history": [
    {
      "date": "2024-01-01",
      "computeHours": 0.5,
      "cost": 0.25
    },
    {
      "date": "2024-01-02",
      "computeHours": 1.2,
      "cost": 0.60
    }
  ],
  "total": {
    "computeHours": 5.2,
    "cost": 2.60
  }
}
```

---

## User & Account APIs

### GET /users/me

Get current user (same as /auth/me).

### PUT /users/me

Update user profile.

**Request Body**:
```json
{
  "name": "John Doe",
  "avatar": "https://...",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### GET /users/me/billing

Get billing information.

**Response** (200 OK):
```json
{
  "tier": "professional",
  "subscription": {
    "status": "active",
    "currentPeriodStart": "2024-01-01T00:00:00Z",
    "currentPeriodEnd": "2024-02-01T00:00:00Z",
    "cancelAtPeriodEnd": false
  },
  "paymentMethod": {
    "type": "card",
    "last4": "4242",
    "brand": "visa"
  },
  "invoices": [...]
}
```

### POST /users/me/upgrade

Upgrade subscription tier.

**Request Body**:
```json
{
  "tier": "professional",
  "paymentMethodId": "pm_123"
}
```

---

## Educational APIs

### GET /learning/paths

Get available learning paths.

**Response** (200 OK):
```json
{
  "paths": [
    {
      "id": "path_beginner",
      "title": "AI Fundamentals",
      "description": "Learn the basics of AI",
      "audience": "beginner",
      "duration": 1200,
      "modules": 10,
      "progress": 0.65
    }
  ]
}
```

### GET /learning/paths/:id

Get learning path details.

**Response** (200 OK):
```json
{
  "id": "path_beginner",
  "title": "AI Fundamentals",
  "modules": [
    {
      "id": "module_1",
      "title": "What is AI?",
      "type": "theory",
      "duration": 30,
      "completed": true
    }
  ],
  "progress": 0.65
}
```

### POST /learning/progress

Update learning progress.

**Request Body**:
```json
{
  "moduleId": "module_1",
  "completed": true,
  "score": 0.95
}
```

---

## WebSocket APIs

### Connection

**URL**: `wss://api.ransfordsnotes.com/v1/ws`

**Authentication**: Query parameter `token` or header `Authorization`

### Events

#### training:progress

Emitted during training.

```json
{
  "event": "training:progress",
  "data": {
    "jobId": "job_123",
    "epoch": 65,
    "progress": 0.65,
    "metrics": {
      "loss": 0.15,
      "accuracy": 0.92
    }
  }
}
```

#### job:status

Emitted when job status changes.

```json
{
  "event": "job:status",
  "data": {
    "jobId": "job_123",
    "status": "completed",
    "result": {...}
  }
}
```

#### agent:output

Emitted during agent execution (streaming).

```json
{
  "event": "agent:output",
  "data": {
    "executionId": "exec_123",
    "chunk": "Based on my research..."
  }
}
```

---

## Error Handling

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "reason": "Invalid email format"
    },
    "requestId": "req_123",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Error Codes

- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `COMPUTE_LIMIT_EXCEEDED`: Compute quota exceeded
- `STORAGE_LIMIT_EXCEEDED`: Storage quota exceeded
- `INTERNAL_ERROR`: Server error
- `SERVICE_UNAVAILABLE`: Service temporarily unavailable

---

## Rate Limiting

### Limits by Tier

- **Free**: 100 requests/hour
- **Starter**: 1,000 requests/hour
- **Professional**: 10,000 requests/hour
- **Enterprise**: Unlimited

### Headers

- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset time (Unix timestamp)

### Response (429 Too Many Requests)

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 3600
  }
}
```

---

*This is a comprehensive API specification. See implementation files for actual code.*

