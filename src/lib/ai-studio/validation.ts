/**
 * Validation Utilities for AI Studio
 * 
 * Centralized validation logic for datasets, models, agents, etc.
 */

import { z } from "zod";

/**
 * Dataset validation schema
 */
export const datasetSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["csv", "json", "jsonl", "parquet"]),
  size: z.number().min(1),
  filePath: z.string(),
  license: z.string().min(1),
});

/**
 * Model validation schema
 */
export const modelSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  type: z.enum(["transformer", "cnn", "rnn", "custom"]),
  architecture: z.record(z.string(), z.unknown()),
  version: z.string().optional(),
});

/**
 * Training job validation schema
 */
export const trainingJobSchema = z.object({
  modelId: z.string().uuid(),
  datasetId: z.string().uuid(),
  computeType: z.enum(["browser", "cpu", "gpu"]).optional(),
  config: z.object({
    epochs: z.number().min(1).max(1000).optional(),
    batchSize: z.number().min(1).max(1024).optional(),
    learningRate: z.number().min(0.0001).max(1).optional(),
    validationSplit: z.number().min(0).max(0.5).optional(),
  }),
});

/**
 * Agent validation schema
 */
export const agentSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  config: z.object({
    model: z.string(),
    tools: z.array(z.string()).optional(),
    memory: z.record(z.string(), z.unknown()).optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().min(1).max(100000).optional(),
  }),
});

/**
 * Agent run validation schema
 */
export const agentRunSchema = z.object({
  agentId: z.string().uuid(),
  input: z.string().min(1).max(100000),
  context: z.record(z.string(), z.unknown()).optional(),
});

/**
 * File upload validation
 */
export function validateFileUpload(file: File, options?: {
  maxSize?: number;
  allowedTypes?: string[];
}): { valid: boolean; error?: string } {
  const maxSize = options?.maxSize || 100 * 1024 * 1024; // 100MB default
  const allowedTypes = options?.allowedTypes || [".csv", ".json", ".jsonl", ".parquet"];

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxSize / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!allowedTypes.includes(`.${ext}`)) {
    return {
      valid: false,
      error: `File type .${ext} not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

/**
 * Validate dataset name
 */
export function validateDatasetName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Dataset name is required" };
  }

  if (name.length > 255) {
    return { valid: false, error: "Dataset name must be 255 characters or less" };
  }

  // Check for invalid characters
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return {
      valid: false,
      error: "Dataset name contains invalid characters: < > : \" / \\ | ? *",
    };
  }

  return { valid: true };
}

/**
 * Validate model architecture
 */
export function validateModelArchitecture(architecture: any): { valid: boolean; error?: string } {
  if (!architecture || typeof architecture !== "object") {
    return { valid: false, error: "Model architecture must be an object" };
  }

  // Check for required fields based on model type
  if (architecture.type === "transformer" && !architecture.layers) {
    return { valid: false, error: "Transformer models require 'layers' field" };
  }

  if (architecture.type === "cnn" && !architecture.convLayers) {
    return { valid: false, error: "CNN models require 'convLayers' field" };
  }

  return { valid: true };
}

/**
 * Validate training configuration
 */
export function validateTrainingConfig(config: any): { valid: boolean; error?: string } {
  if (!config || typeof config !== "object") {
    return { valid: false, error: "Training configuration must be an object" };
  }

  if (config.epochs !== undefined) {
    if (typeof config.epochs !== "number" || config.epochs < 1 || config.epochs > 1000) {
      return { valid: false, error: "Epochs must be between 1 and 1000" };
    }
  }

  if (config.batchSize !== undefined) {
    if (typeof config.batchSize !== "number" || config.batchSize < 1 || config.batchSize > 1024) {
      return { valid: false, error: "Batch size must be between 1 and 1024" };
    }
  }

  if (config.learningRate !== undefined) {
    if (
      typeof config.learningRate !== "number" ||
      config.learningRate < 0.0001 ||
      config.learningRate > 1
    ) {
      return { valid: false, error: "Learning rate must be between 0.0001 and 1" };
    }
  }

  if (config.validationSplit !== undefined) {
    if (
      typeof config.validationSplit !== "number" ||
      config.validationSplit < 0 ||
      config.validationSplit > 0.5
    ) {
      return { valid: false, error: "Validation split must be between 0 and 0.5" };
    }
  }

  return { valid: true };
}

/**
 * Validate agent configuration
 */
export function validateAgentConfig(config: any): { valid: boolean; error?: string } {
  if (!config || typeof config !== "object") {
    return { valid: false, error: "Agent configuration must be an object" };
  }

  if (!config.model || typeof config.model !== "string") {
    return { valid: false, error: "Agent configuration requires a 'model' field" };
  }

  if (config.temperature !== undefined) {
    if (typeof config.temperature !== "number" || config.temperature < 0 || config.temperature > 2) {
      return { valid: false, error: "Temperature must be between 0 and 2" };
    }
  }

  if (config.maxTokens !== undefined) {
    if (typeof config.maxTokens !== "number" || config.maxTokens < 1 || config.maxTokens > 100000) {
      return { valid: false, error: "Max tokens must be between 1 and 100000" };
    }
  }

  return { valid: true };
}
