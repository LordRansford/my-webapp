# 🏢 Enterprise Sandbox Architecture & Security

## 🎯 Your Question: Storage Impact on Restrictions

**Short answer:** Storage architecture (Vercel Blob + PostgreSQL) **does impact** enterprise capabilities, but it's only **one piece** of the puzzle. You need **additional infrastructure** for true enterprise-grade sandboxes.

---

## 📊 Current State Analysis

### ✅ What You Have (Good Foundation)

1. **Storage Architecture:**
   - ✅ Vercel Blob for files (scalable, CDN-enabled)
   - ✅ PostgreSQL for metadata (relational, queryable)
   - ✅ Path-based isolation (`ai-studio/{userId}/...`)

2. **Basic Security:**
   - ✅ Authentication (NextAuth)
   - ✅ Rate limiting
   - ✅ Tier-based access (free, supporter, professional)
   - ✅ Server-side authorization checks

3. **Sandbox Execution:**
   - ✅ Client-side Web Workers (isolated)
   - ✅ WASM-based execution (Python, SQL)
   - ✅ Timeout limits
   - ✅ Output size limits

### ❌ What's Missing for Enterprise

1. **Compute Isolation:**
   - ❌ Server-side compute (currently all client-side)
   - ❌ Container-based isolation
   - ❌ Resource quotas (CPU, memory, GPU)
   - ❌ Network isolation

2. **Data Security:**
   - ❌ Encryption at rest (Vercel Blob has it, but need verification)
   - ❌ Encryption in transit (HTTPS only, need end-to-end)
   - ❌ Tenant isolation (data segregation)
   - ❌ Data residency controls

3. **Enterprise Features:**
   - ❌ SSO/SAML integration
   - ❌ Advanced RBAC (role-based access control)
   - ❌ Audit logging (comprehensive)
   - ❌ Compliance reporting (SOC2, GDPR, HIPAA)

4. **Advanced Compute:**
   - ❌ GPU access for ML workloads
   - ❌ Longer execution times
   - ❌ Larger datasets
   - ❌ Distributed computing

---

## 🏗️ Enterprise Architecture Requirements

### 1. **Storage Architecture Impact** ✅

**Your current setup (Vercel Blob + PostgreSQL) is GOOD, but needs enhancements:**

#### ✅ What Works:
- **Scalability**: Handles large files, scales to petabytes
- **Performance**: CDN-enabled, fast retrieval
- **Cost**: Efficient pricing model

#### ⚠️ What Needs Enhancement:

**A. Private Storage for Sensitive Data**
```typescript
// Current: Public access
const blob = await put(pathname, file, {
  access: "public", // ❌ Not suitable for sensitive corporate data
});

// Enterprise: Private with signed URLs
const blob = await put(pathname, file, {
  access: "private", // ✅ Encrypted, access-controlled
});

// Generate time-limited signed URLs
const signedUrl = await getSignedUrl(blob.url, {
  expiresIn: 3600, // 1 hour
});
```

**B. Tenant Isolation**
```typescript
// Current: User-based paths
const pathname = `ai-studio/${userId}/datasets/${file.name}`;

// Enterprise: Tenant-based isolation
const pathname = `enterprise/${tenantId}/${userId}/datasets/${file.name}`;

// Database: Add tenant_id to all tables
model Dataset {
  id        String   @id
  tenantId  String   // ✅ Tenant isolation
  userId    String
  // ...
  @@index([tenantId, userId]) // ✅ Efficient queries
}
```

**C. Encryption at Rest**
- ✅ Vercel Blob: Already encrypted (AWS S3 backend)
- ✅ PostgreSQL: Enable encryption (TLS + at-rest encryption)
- ⚠️ Application-level: Add field-level encryption for PII

**D. Data Residency**
- ⚠️ Vercel Blob: Global (may not meet EU-only requirements)
- ⚠️ PostgreSQL: Choose region-specific instance
- ✅ Solution: Use region-specific storage (e.g., EU-only Vercel deployment)

---

### 2. **Compute Isolation** (Critical for Enterprise)

**Current limitation:** All sandboxes run client-side (browser). For enterprise, you need **server-side compute isolation**.

#### Option A: Container-Based Isolation (Recommended)

```typescript
// Enterprise compute runner
import Docker from 'dockerode';

export async function runEnterpriseSandbox(
  code: string,
  language: 'python' | 'javascript' | 'sql',
  resources: {
    cpu: number;      // CPU cores
    memory: string;   // "2GB"
    timeout: number;  // seconds
    gpu?: boolean;    // GPU access
  }
) {
  const docker = new Docker();
  
  const container = await docker.createContainer({
    Image: `sandbox-${language}:latest`,
    Cmd: ['run', code],
    HostConfig: {
      Memory: parseMemory(resources.memory),
      CpuShares: resources.cpu * 1024,
      NetworkMode: 'none', // ✅ Network isolation
      ReadonlyRootfs: true, // ✅ Read-only filesystem
      CapDrop: ['ALL'], // ✅ Drop all capabilities
      SecurityOpt: ['no-new-privileges'], // ✅ Security hardening
    },
    Env: [
      `TIMEOUT=${resources.timeout}`,
      `USER_ID=${userId}`,
      `TENANT_ID=${tenantId}`,
    ],
  });

  // Execute with timeout
  const result = await Promise.race([
    container.start().then(() => container.wait()),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), resources.timeout * 1000)
    ),
  ]);

  // Cleanup
  await container.remove({ force: true });
  
  return result;
}
```

**Infrastructure needed:**
- Docker/Kubernetes cluster
- Resource quotas per tenant
- Network isolation (VPC)
- GPU nodes (for ML workloads)

#### Option B: Serverless Functions (Simpler, Limited)

```typescript
// Vercel Serverless Functions with isolation
export async function runEnterpriseCompute(
  code: string,
  tier: 'enterprise'
) {
  // Use Vercel Edge Functions or AWS Lambda
  // Limitations: 10s timeout, limited resources
  // Good for: Light compute, not heavy ML
  
  return await fetch('https://api.vercel.com/v1/functions', {
    method: 'POST',
    body: JSON.stringify({ code }),
    headers: {
      'Authorization': `Bearer ${process.env.VERCEL_TOKEN}`,
    },
  });
}
```

**Limitations:**
- ⚠️ Timeout limits (10s on Vercel)
- ⚠️ No GPU access
- ⚠️ Limited memory
- ✅ Good for: Simple scripts, not heavy compute

#### Option C: Dedicated Compute Cluster (Best for Enterprise)

**Architecture:**
```
┌─────────────────────────────────────────┐
│  Enterprise Tenant A                   │
│  ┌───────────────────────────────────┐ │
│  │  Dedicated Kubernetes Namespace   │ │
│  │  - Isolated network               │ │
│  │  - Resource quotas                │ │
│  │  - Private storage                │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Enterprise Tenant B                   │
│  ┌───────────────────────────────────┐ │
│  │  Dedicated Kubernetes Namespace   │ │
│  │  - Isolated network               │ │
│  │  - Resource quotas                │ │
│  │  - Private storage                │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Services:**
- **AWS EKS** / **Google GKE** / **Azure AKS**
- **Kubernetes** for orchestration
- **Network Policies** for isolation
- **Resource Quotas** per namespace

---

### 3. **Enhanced Security Features**

#### A. Audit Logging

```typescript
// Comprehensive audit log
model AuditLog {
  id          String   @id
  tenantId    String?  // Enterprise tenant
  userId      String
  action      String   // "sandbox_execute", "file_upload", "data_access"
  resource    String   // "dataset_123", "model_456"
  metadata    Json     // Additional context
  ipAddress   String?
  userAgent   String?
  timestamp   DateTime @default(now())
  
  @@index([tenantId, timestamp])
  @@index([userId, timestamp])
  @@index([action, timestamp])
}
```

#### B. Data Loss Prevention (DLP)

```typescript
// Scan uploaded files for sensitive data
import { scanForPII } from '@/lib/security/dlp';

export async function uploadEnterpriseFile(file: File, tenantId: string) {
  // Scan for PII, secrets, etc.
  const scanResult = await scanForPII(file);
  
  if (scanResult.hasSensitiveData) {
    throw new Error('File contains sensitive data. Please remove PII before uploading.');
  }
  
  // Proceed with upload
  return await uploadFile(file, tenantId);
}
```

#### C. Access Control Lists (ACL)

```typescript
// Fine-grained access control
model ResourceACL {
  id          String   @id
  resourceId  String   // Dataset, model, etc.
  resourceType String  // "dataset", "model", "project"
  tenantId    String
  permissions Json     // { read: [userId1, userId2], write: [userId3] }
  
  @@unique([resourceId, resourceType])
  @@index([tenantId])
}
```

---

### 4. **Enterprise Tier Configuration**

```typescript
// src/lib/billing/plans.ts - Add enterprise tier
export const PLANS: Record<PlanKey, Plan> = {
  // ... existing plans ...
  
  enterprise: {
    key: "enterprise",
    label: "Enterprise",
    description: "Dedicated infrastructure, advanced security, compliance",
    features: [
      "dedicated_compute",
      "gpu_access",
      "long_execution_times",
      "large_datasets",
      "private_storage",
      "sso_saml",
      "advanced_rbac",
      "audit_logging",
      "compliance_reporting",
      "data_residency",
      "sla_guarantee",
    ],
    limits: {
      maxUploadBytes: 10_000_000_000, // 10GB
      maxExportsPerDay: Infinity,
      monthlyCredits: Infinity,
      dailyCreditCap: Infinity,
      executionTimeout: 3600, // 1 hour (vs 10s for free)
      maxMemory: "32GB",
      gpuEnabled: true,
    },
  },
};
```

---

## 🚀 Implementation Roadmap

### Phase 1: Storage Enhancements (2-4 weeks)

1. **Private Storage:**
   - ✅ Switch to private Blob access
   - ✅ Implement signed URL generation
   - ✅ Add access control middleware

2. **Tenant Isolation:**
   - ✅ Add `tenantId` to Prisma schema
   - ✅ Update all queries to filter by tenant
   - ✅ Implement tenant-based path isolation

3. **Encryption:**
   - ✅ Verify Vercel Blob encryption
   - ✅ Enable PostgreSQL encryption
   - ✅ Add field-level encryption for PII

### Phase 2: Compute Isolation (4-8 weeks)

1. **Container Infrastructure:**
   - ✅ Set up Docker/Kubernetes cluster
   - ✅ Create sandbox container images
   - ✅ Implement resource quotas

2. **API Integration:**
   - ✅ Create compute API endpoints
   - ✅ Add tier-based resource allocation
   - ✅ Implement execution queue

3. **Monitoring:**
   - ✅ Add execution metrics
   - ✅ Resource usage tracking
   - ✅ Cost attribution per tenant

### Phase 3: Enterprise Features (6-12 weeks)

1. **SSO/SAML:**
   - ✅ Integrate with enterprise identity providers
   - ✅ Implement SAML 2.0
   - ✅ Add Just-In-Time (JIT) provisioning

2. **Advanced RBAC:**
   - ✅ Role-based permissions
   - ✅ Resource-level ACLs
   - ✅ Delegated administration

3. **Compliance:**
   - ✅ SOC2 Type II audit
   - ✅ GDPR compliance
   - ✅ HIPAA (if handling health data)
   - ✅ Compliance reporting dashboard

---

## 📋 Storage Architecture Impact Summary

### ✅ **Storage DOES Impact Enterprise Capabilities:**

1. **Data Isolation:**
   - ✅ Tenant-based paths enable multi-tenancy
   - ✅ Private storage prevents data leakage
   - ✅ Database isolation ensures query separation

2. **Security:**
   - ✅ Encryption at rest (Vercel Blob)
   - ✅ Access control (signed URLs)
   - ✅ Audit trails (database logs)

3. **Compliance:**
   - ✅ Data residency (region selection)
   - ✅ Retention policies (lifecycle management)
   - ✅ Backup/disaster recovery

### ⚠️ **Storage ALONE is NOT Enough:**

You also need:
1. **Compute Isolation** (containers, VMs, or serverless)
2. **Network Isolation** (VPC, network policies)
3. **Advanced Security** (DLP, encryption, audit logs)
4. **Enterprise Features** (SSO, RBAC, compliance)

---

## 🎯 Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Enterprise Tenant                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐         ┌──────────────┐            │
│  │   Storage    │         │   Compute    │            │
│  │              │         │              │            │
│  │ Vercel Blob  │◄───────►│ Kubernetes   │            │
│  │ (Private)    │         │ (Isolated)   │            │
│  │              │         │              │            │
│  │ PostgreSQL   │         │ Docker       │            │
│  │ (Encrypted)  │         │ Containers   │            │
│  └──────────────┘         └──────────────┘            │
│         │                        │                     │
│         └──────────┬─────────────┘                     │
│                    ▼                                    │
│         ┌──────────────────────┐                        │
│         │  Audit & Compliance  │                        │
│         │  - Logging           │                        │
│         │  - DLP               │                        │
│         │  - Reporting         │                        │
│         └──────────────────────┘                        │
└─────────────────────────────────────────────────────────┘
```

---

## 💰 Cost Considerations

### Storage (Current Setup):
- **Vercel Blob**: ~$0.15/GB/month ✅
- **PostgreSQL**: ~$25-100/month (depending on size) ✅
- **Total**: Very affordable ✅

### Compute (Enterprise Addition):
- **Kubernetes Cluster**: $200-2000/month (depending on size)
- **GPU Nodes**: $500-5000/month (if needed)
- **Monitoring/Logging**: $50-200/month
- **Total**: $750-7200/month (significant increase)

---

## ✅ Summary

**Your storage architecture (Vercel Blob + PostgreSQL) is excellent and DOES impact enterprise capabilities**, but you need **additional infrastructure** for:

1. ✅ **Compute Isolation** (containers/Kubernetes)
2. ✅ **Network Isolation** (VPC, network policies)
3. ✅ **Enhanced Security** (DLP, encryption, audit logs)
4. ✅ **Enterprise Features** (SSO, RBAC, compliance)

**Storage is the foundation, but compute isolation is the critical piece for enterprise sandboxes.**
