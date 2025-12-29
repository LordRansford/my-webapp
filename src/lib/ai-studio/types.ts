/**
 * AI Studio Type Definitions
 * 
 * Centralized TypeScript types for AI Studio
 */

// User Tiers
export type UserTier = "free" | "starter" | "professional" | "enterprise";

// Dataset Types
export type DatasetType = "csv" | "json" | "jsonl" | "parquet" | "hdf5";

// Dataset Status
export type DatasetStatus =
  | "uploading"
  | "processing"
  | "verified"
  | "rejected"
  | "deleted";

// Model Types
export type ModelType =
  | "classification"
  | "regression"
  | "clustering"
  | "generation"
  | "other";

// Model Status
export type ModelStatus =
  | "created"
  | "training"
  | "trained"
  | "failed"
  | "deployed"
  | "archived";

// Training Job Status
export type TrainingJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

// Compute Type
export type ComputeType = "browser" | "backend";

// Agent Types
export type AgentType = "single" | "multi" | "hierarchical" | "collaborative";

// Agent Status
export type AgentStatus = "active" | "paused" | "archived";

// Agent Execution Status
export type AgentExecutionStatus =
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

// Deployment Target
export type DeploymentTarget = "api" | "browser" | "container" | "edge";

// Deployment Status
export type DeploymentStatus =
  | "deploying"
  | "active"
  | "scaling"
  | "failed"
  | "stopped";

// Validation Check Status
export type ValidationStatus = "pending" | "pass" | "fail" | "warning";

// Overall Validation Status
export type OverallValidationStatus =
  | "pending"
  | "validating"
  | "valid"
  | "invalid"
  | "needs-review";

// Layer Types
export type LayerType = "dense" | "dropout" | "conv2d" | "lstm" | "embedding";

// Activation Functions
export type ActivationFunction =
  | "relu"
  | "sigmoid"
  | "tanh"
  | "linear"
  | "softmax";

// Optimizers
export type Optimizer = "adam" | "sgd" | "rmsprop" | "adagrad";

// Loss Functions
export type LossFunction =
  | "binaryCrossentropy"
  | "categoricalCrossentropy"
  | "meanSquaredError"
  | "meanAbsoluteError";

// Metrics
export type Metric =
  | "accuracy"
  | "precision"
  | "recall"
  | "f1"
  | "mse"
  | "mae"
  | "rmse"
  | "r2";

// Interfaces
export interface Dataset {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: DatasetType;
  size: number;
  rows?: number;
  columns?: number;
  filePath: string;
  license: string;
  licenseVerified: boolean;
  status: DatasetStatus;
  schema?: DatasetSchema;
  statistics?: DatasetStatistics;
  qualityScore?: number;
  validationResult?: ValidationResult;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DatasetSchema {
  columns: Array<{
    name: string;
    type: string;
    nullable: boolean;
    min?: number;
    max?: number;
    mean?: number;
    categories?: string[];
    distribution?: Record<string, number>;
  }>;
}

export interface DatasetStatistics {
  missingValues: number;
  duplicates: number;
  qualityScore: number;
}

export interface ValidationResult {
  status: OverallValidationStatus;
  checks: {
    license: {
      status: ValidationStatus;
      detected: string | null;
      verified: boolean;
      message: string;
    };
    copyright: {
      status: ValidationStatus;
      watermarks: boolean;
      knownContent: boolean;
      message: string;
    };
    quality: {
      status: ValidationStatus;
      score: number;
      issues: string[];
      message: string;
    };
    pii: {
      status: ValidationStatus;
      detected: boolean;
      types: string[];
      message: string;
    };
  };
  warnings: string[];
  errors: string[];
}

export interface Model {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: ModelType;
  architecture: ModelArchitecture;
  status: ModelStatus;
  version: string;
  trainingDatasetId?: string;
  trainingConfig?: TrainingConfig;
  metrics?: ModelMetrics;
  modelPath?: string;
  modelSize?: number;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  trainedAt?: string;
  deletedAt?: string;
}

export interface ModelArchitecture {
  type: string;
  layers: Layer[];
}

export interface Layer {
  id: string;
  type: LayerType;
  config: LayerConfig;
}

export interface LayerConfig {
  units?: number;
  activation?: ActivationFunction;
  rate?: number;
  filters?: number;
  kernelSize?: number;
}

export interface TrainingConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  validationSplit: number;
  optimizer?: Optimizer;
  loss?: LossFunction;
  callbacks?: string[];
}

export interface ModelMetrics {
  accuracy?: number;
  precision?: number;
  recall?: number;
  f1?: number;
  mse?: number;
  mae?: number;
  rmse?: number;
  r2?: number;
  confusionMatrix?: ConfusionMatrix;
  perClass?: Record<string, ClassMetrics>;
}

export interface ConfusionMatrix {
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
}

export interface ClassMetrics {
  precision: number;
  recall: number;
  f1: number;
}

export interface TrainingJob {
  id: string;
  userId: string;
  modelId: string;
  datasetId: string;
  status: TrainingJobStatus;
  computeType: ComputeType;
  config: TrainingConfig;
  progress: number;
  currentEpoch?: number;
  totalEpochs?: number;
  metrics?: ModelMetrics;
  metricsHistory?: MetricsHistory;
  errorMessage?: string;
  workerId?: string;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  cost?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MetricsHistory {
  loss: number[];
  accuracy?: number[];
  valLoss?: number[];
  valAccuracy?: number[];
}

export interface Agent {
  id: string;
  userId: string;
  name: string;
  description?: string;
  type: AgentType;
  modelConfig: ModelConfig;
  tools: Tool[];
  memoryConfig?: MemoryConfig;
  systemPrompt?: string;
  workflow?: Workflow;
  status: AgentStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface ModelConfig {
  provider: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface Tool {
  type: string;
  config: Record<string, unknown>;
}

export interface MemoryConfig {
  type: "conversation" | "vector" | "episodic";
  maxTokens?: number;
}

export interface Workflow {
  agents: string[];
  connections: Array<{ from: string; to: string }>;
  conditions?: Array<{ condition: string; action: string }>;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  userId: string;
  input: string;
  output?: string;
  status: AgentExecutionStatus;
  steps?: ExecutionStep[];
  cost?: number;
  tokensUsed?: number;
  durationSeconds?: number;
  errorMessage?: string;
  startedAt: string;
  completedAt?: string;
}

export interface ExecutionStep {
  type: string;
  tool?: string;
  input?: string;
  output?: string;
  timestamp: string;
}

export interface Deployment {
  id: string;
  userId: string;
  modelId: string;
  name: string;
  target: DeploymentTarget;
  status: DeploymentStatus;
  url?: string;
  config: DeploymentConfig;
  replicas: number;
  metrics?: DeploymentMetrics;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DeploymentConfig {
  replicas: number;
  autoScaling?: AutoScalingConfig;
  environment?: string;
}

export interface AutoScalingConfig {
  min: number;
  max: number;
  targetCPU: number;
}

export interface DeploymentMetrics {
  requests: number;
  avgLatencyMs: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorCount: number;
  errorRate: number;
  throughputRps: number;
  cpuUsagePercent?: number;
  memoryUsageMb?: number;
}

export interface ComputeUsage {
  id: string;
  userId: string;
  jobId?: string;
  deploymentId?: string;
  agentExecutionId?: string;
  resourceType: "gpu" | "cpu" | "storage" | "network";
  quantity: number;
  unit: string;
  cost: number;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
}

