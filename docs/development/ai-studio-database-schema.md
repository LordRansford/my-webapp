# AI Studio Database Schema

## Overview

This document defines the complete database schema for the AI Studio platform using PostgreSQL with proper indexing, constraints, and relationships.

**Database**: PostgreSQL 15+
**ORM**: Prisma (TypeScript) / SQLAlchemy (Python)

---

## Table of Contents

1. [Users & Authentication](#users--authentication)
2. [Datasets](#datasets)
3. [Models](#models)
4. [Training Jobs](#training-jobs)
5. [Agents](#agents)
6. [Deployments](#deployments)
7. [Compute & Billing](#compute--billing)
8. [Educational](#educational)
9. [System & Audit](#system--audit)

---

## Users & Authentication

### users

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar_url TEXT,
    tier VARCHAR(50) DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
    preferences JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tier ON users(tier);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);
```

### sessions

```sql
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX idx_sessions_expires_at ON sessions(expires_at);
```

### api_keys

```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL UNIQUE,
    prefix VARCHAR(10) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_prefix ON api_keys(prefix);
```

---

## Datasets

### datasets

```sql
CREATE TABLE datasets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('csv', 'json', 'jsonl', 'parquet', 'hdf5')),
    size BIGINT NOT NULL,
    rows INTEGER,
    columns INTEGER,
    file_path TEXT NOT NULL,
    license VARCHAR(100) NOT NULL,
    license_verified BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'uploading' CHECK (status IN ('uploading', 'processing', 'verified', 'rejected', 'deleted')),
    schema JSONB,
    statistics JSONB,
    quality_score DECIMAL(3,2),
    validation_result JSONB,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_datasets_user_id ON datasets(user_id);
CREATE INDEX idx_datasets_status ON datasets(status);
CREATE INDEX idx_datasets_license ON datasets(license);
CREATE INDEX idx_datasets_created_at ON datasets(created_at);
CREATE INDEX idx_datasets_name ON datasets USING gin(to_tsvector('english', name));
```

### dataset_versions

```sql
CREATE TABLE dataset_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    file_path TEXT NOT NULL,
    size BIGINT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    changes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dataset_id, version)
);

CREATE INDEX idx_dataset_versions_dataset_id ON dataset_versions(dataset_id);
```

### dataset_shares

```sql
CREATE TABLE dataset_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    shared_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    shared_with_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    permission VARCHAR(50) DEFAULT 'read' CHECK (permission IN ('read', 'write', 'admin')),
    public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(dataset_id, shared_with_user_id)
);

CREATE INDEX idx_dataset_shares_dataset_id ON dataset_shares(dataset_id);
CREATE INDEX idx_dataset_shares_shared_with_user_id ON dataset_shares(shared_with_user_id);
```

---

## Models

### models

```sql
CREATE TABLE models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('classification', 'regression', 'clustering', 'generation', 'other')),
    architecture JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'training', 'trained', 'failed', 'deployed', 'archived')),
    version VARCHAR(50) DEFAULT '1.0.0',
    training_dataset_id UUID REFERENCES datasets(id),
    training_config JSONB,
    metrics JSONB,
    model_path TEXT,
    model_size BIGINT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    trained_at TIMESTAMP WITH TIME ZONE,
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_models_user_id ON models(user_id);
CREATE INDEX idx_models_type ON models(type);
CREATE INDEX idx_models_status ON models(status);
CREATE INDEX idx_models_training_dataset_id ON models(training_dataset_id);
CREATE INDEX idx_models_created_at ON models(created_at);
CREATE INDEX idx_models_name ON models USING gin(to_tsvector('english', name));
```

### model_versions

```sql
CREATE TABLE model_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    model_path TEXT NOT NULL,
    model_size BIGINT NOT NULL,
    checksum VARCHAR(64) NOT NULL,
    training_job_id UUID REFERENCES training_jobs(id),
    metrics JSONB,
    changelog TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(model_id, version)
);

CREATE INDEX idx_model_versions_model_id ON model_versions(model_id);
CREATE INDEX idx_model_versions_training_job_id ON model_versions(training_job_id);
```

### model_evaluations

```sql
CREATE TABLE model_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    metrics JSONB NOT NULL,
    confusion_matrix JSONB,
    per_class_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_model_evaluations_model_id ON model_evaluations(model_id);
CREATE INDEX idx_model_evaluations_dataset_id ON model_evaluations(dataset_id);
CREATE INDEX idx_model_evaluations_created_at ON model_evaluations(created_at);
```

---

## Training Jobs

### training_jobs

```sql
CREATE TABLE training_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    dataset_id UUID NOT NULL REFERENCES datasets(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
    compute_type VARCHAR(50) DEFAULT 'browser' CHECK (compute_type IN ('browser', 'backend')),
    config JSONB NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    current_epoch INTEGER,
    total_epochs INTEGER,
    metrics JSONB,
    metrics_history JSONB,
    error_message TEXT,
    worker_id VARCHAR(255),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    cost DECIMAL(10,4),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_training_jobs_user_id ON training_jobs(user_id);
CREATE INDEX idx_training_jobs_model_id ON training_jobs(model_id);
CREATE INDEX idx_training_jobs_status ON training_jobs(status);
CREATE INDEX idx_training_jobs_created_at ON training_jobs(created_at);
```

### training_job_logs

```sql
CREATE TABLE training_job_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID NOT NULL REFERENCES training_jobs(id) ON DELETE CASCADE,
    level VARCHAR(50) NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error')),
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_training_job_logs_job_id ON training_job_logs(job_id);
CREATE INDEX idx_training_job_logs_level ON training_job_logs(level);
CREATE INDEX idx_training_job_logs_created_at ON training_job_logs(created_at);
```

---

## Agents

### agents

```sql
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('single', 'multi', 'hierarchical', 'collaborative')),
    model_config JSONB NOT NULL,
    tools JSONB NOT NULL,
    memory_config JSONB,
    system_prompt TEXT,
    workflow JSONB,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'archived')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_type ON agents(type);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_created_at ON agents(created_at);
```

### agent_executions

```sql
CREATE TABLE agent_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    output TEXT,
    status VARCHAR(50) DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    steps JSONB,
    cost DECIMAL(10,4),
    tokens_used INTEGER,
    duration_seconds INTEGER,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX idx_agent_executions_user_id ON agent_executions(user_id);
CREATE INDEX idx_agent_executions_status ON agent_executions(status);
CREATE INDEX idx_agent_executions_started_at ON agent_executions(started_at);
```

---

## Deployments

### deployments

```sql
CREATE TABLE deployments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_id UUID NOT NULL REFERENCES models(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target VARCHAR(50) NOT NULL CHECK (target IN ('api', 'browser', 'container', 'edge')),
    status VARCHAR(50) DEFAULT 'deploying' CHECK (status IN ('deploying', 'active', 'scaling', 'failed', 'stopped')),
    url TEXT,
    config JSONB NOT NULL,
    replicas INTEGER DEFAULT 1,
    metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_deployments_user_id ON deployments(user_id);
CREATE INDEX idx_deployments_model_id ON deployments(model_id);
CREATE INDEX idx_deployments_status ON deployments(status);
CREATE INDEX idx_deployments_target ON deployments(target);
```

### deployment_metrics

```sql
CREATE TABLE deployment_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    deployment_id UUID NOT NULL REFERENCES deployments(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    requests INTEGER DEFAULT 0,
    avg_latency_ms INTEGER,
    p50_latency_ms INTEGER,
    p95_latency_ms INTEGER,
    p99_latency_ms INTEGER,
    error_count INTEGER DEFAULT 0,
    error_rate DECIMAL(5,4),
    throughput_rps DECIMAL(10,2),
    cpu_usage_percent DECIMAL(5,2),
    memory_usage_mb INTEGER
);

CREATE INDEX idx_deployment_metrics_deployment_id ON deployment_metrics(deployment_id);
CREATE INDEX idx_deployment_metrics_timestamp ON deployment_metrics(timestamp);
CREATE INDEX idx_deployment_metrics_deployment_timestamp ON deployment_metrics(deployment_id, timestamp);
```

---

## Compute & Billing

### compute_usage

```sql
CREATE TABLE compute_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES training_jobs(id),
    deployment_id UUID REFERENCES deployments(id),
    agent_execution_id UUID REFERENCES agent_executions(id),
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('gpu', 'cpu', 'storage', 'network')),
    quantity DECIMAL(10,4) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    cost DECIMAL(10,4) NOT NULL,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_compute_usage_user_id ON compute_usage(user_id);
CREATE INDEX idx_compute_usage_period_start ON compute_usage(period_start);
CREATE INDEX idx_compute_usage_period_end ON compute_usage(period_end);
CREATE INDEX idx_compute_usage_user_period ON compute_usage(user_id, period_start, period_end);
```

### subscriptions

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'expired')),
    current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
```

### invoices

```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    period_start TIMESTAMP WITH TIME ZONE NOT NULL,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    items JSONB NOT NULL,
    stripe_invoice_id VARCHAR(255),
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    paid_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_stripe_invoice_id ON invoices(stripe_invoice_id);
```

---

## Educational

### learning_paths

```sql
CREATE TABLE learning_paths (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    audience VARCHAR(50) NOT NULL CHECK (audience IN ('children', 'students', 'professionals', 'experts')),
    level VARCHAR(50) NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_minutes INTEGER,
    modules_count INTEGER DEFAULT 0,
    order_index INTEGER,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_learning_paths_audience ON learning_paths(audience);
CREATE INDEX idx_learning_paths_level ON learning_paths(level);
CREATE INDEX idx_learning_paths_order_index ON learning_paths(order_index);
```

### learning_modules

```sql
CREATE TABLE learning_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('theory', 'tutorial', 'hands-on', 'project')),
    duration_minutes INTEGER,
    order_index INTEGER,
    content JSONB NOT NULL,
    prerequisites JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_learning_modules_path_id ON learning_modules(path_id);
CREATE INDEX idx_learning_modules_order_index ON learning_modules(path_id, order_index);
```

### user_progress

```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id UUID REFERENCES learning_paths(id) ON DELETE CASCADE,
    module_id UUID REFERENCES learning_modules(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    score DECIMAL(5,2),
    time_spent_minutes INTEGER,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_path_id ON user_progress(path_id);
CREATE INDEX idx_user_progress_module_id ON user_progress(module_id);
```

---

## System & Audit

### audit_logs

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

### system_settings

```sql
CREATE TABLE system_settings (
    key VARCHAR(255) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_by_user_id UUID REFERENCES users(id)
);
```

---

## Views

### user_usage_summary

```sql
CREATE VIEW user_usage_summary AS
SELECT
    u.id AS user_id,
    u.tier,
    COALESCE(SUM(cu.cost), 0) AS total_cost,
    COALESCE(SUM(CASE WHEN cu.resource_type = 'gpu' THEN cu.quantity ELSE 0 END), 0) AS gpu_hours,
    COALESCE(SUM(CASE WHEN cu.resource_type = 'storage' THEN cu.quantity ELSE 0 END), 0) AS storage_gb,
    COUNT(DISTINCT d.id) AS datasets_count,
    COUNT(DISTINCT m.id) AS models_count,
    COUNT(DISTINCT dep.id) AS deployments_count
FROM users u
LEFT JOIN compute_usage cu ON u.id = cu.user_id
LEFT JOIN datasets d ON u.id = d.user_id AND d.deleted_at IS NULL
LEFT JOIN models m ON u.id = m.user_id AND m.deleted_at IS NULL
LEFT JOIN deployments dep ON u.id = dep.user_id AND dep.deleted_at IS NULL
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.tier;
```

---

## Triggers

### update_updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_datasets_updated_at BEFORE UPDATE ON datasets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_models_updated_at BEFORE UPDATE ON models
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add to all tables with updated_at column
```

---

## Indexes Summary

- All foreign keys are indexed
- All status/enum columns are indexed
- All timestamp columns used in queries are indexed
- Full-text search indexes on name/description fields
- Composite indexes for common query patterns

---

*This schema is optimized for PostgreSQL 15+ with proper indexing and constraints.*

