/**
 * AI Studio Constants
 * 
 * Centralized constants and configuration
 */

// License Types
export const PERMISSIVE_LICENSES = [
  "MIT",
  "Apache-2.0",
  "BSD-3-Clause",
  "BSD-2-Clause",
  "ISC",
  "CC0",
  "CC-BY",
  "user-owned",
  "public-domain",
] as const;

// Dataset Limits by Tier
export const DATASET_LIMITS = {
  free: {
    maxSize: 10 * 1024 * 1024, // 10MB
    maxRows: 10000,
    maxDatasets: 5,
  },
  starter: {
    maxSize: 100 * 1024 * 1024, // 100MB
    maxRows: 100000,
    maxDatasets: 20,
  },
  professional: {
    maxSize: 1024 * 1024 * 1024, // 1GB
    maxRows: 1000000,
    maxDatasets: 100,
  },
  enterprise: {
    maxSize: 10 * 1024 * 1024 * 1024, // 10GB
    maxRows: Infinity,
    maxDatasets: Infinity,
  },
} as const;

// Compute Limits by Tier
export const COMPUTE_LIMITS = {
  free: {
    gpuHours: 0,
    cpuHours: 0,
    requestsPerHour: 100,
  },
  starter: {
    gpuHours: 1,
    cpuHours: 10,
    requestsPerHour: 1000,
  },
  professional: {
    gpuHours: 10,
    cpuHours: 100,
    requestsPerHour: 10000,
  },
  enterprise: {
    gpuHours: Infinity,
    cpuHours: Infinity,
    requestsPerHour: Infinity,
  },
} as const;

// Model Types
export const MODEL_TYPES = [
  "classification",
  "regression",
  "clustering",
  "generation",
  "other",
] as const;

// Training Status
export const TRAINING_STATUS = [
  "queued",
  "running",
  "completed",
  "failed",
  "cancelled",
] as const;

// Agent Types
export const AGENT_TYPES = [
  "single",
  "multi",
  "hierarchical",
  "collaborative",
] as const;

// Deployment Targets
export const DEPLOYMENT_TARGETS = [
  "api",
  "browser",
  "container",
  "edge",
] as const;

// Default Training Config
export const DEFAULT_TRAINING_CONFIG = {
  learningRate: 0.001,
  batchSize: 32,
  epochs: 100,
  validationSplit: 0.2,
} as const;

// Cost Per Unit (USD)
export const COST_PER_UNIT = {
  gpuHour: 0.50,
  cpuHour: 0.05,
  storageGB: 0.10,
  networkGB: 0.05,
  inference: 0.001,
  agentExecution: 0.02,
} as const;

// Quality Score Thresholds
export const QUALITY_THRESHOLDS = {
  excellent: 0.9,
  good: 0.8,
  acceptable: 0.7,
  poor: 0.6,
} as const;

