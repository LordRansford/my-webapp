/**
 * AI Studio - Main Export File
 * 
 * Centralized exports for easy importing
 */

// API Client
export { apiClient, api, AIStudioApiClient } from "./api-client";
export type { ApiResponse, ApiError } from "./api-client";

// Error Handling
export { formatError, getErrorMessage, getErrorSeverity, isRetryableError, handleError } from "./errors";
export type { FormattedError } from "./errors";

// Validation
export {
  datasetSchema,
  modelSchema,
  trainingJobSchema,
  agentSchema,
  agentRunSchema,
  validateFileUpload,
  validateDatasetName,
  validateModelArchitecture,
  validateTrainingConfig,
  validateAgentConfig,
} from "./validation";

// Formatting
export {
  formatBytes,
  formatDuration,
  formatCost,
  formatPercentage,
  formatRelativeTime,
  getStatusColor,
  formatModelType,
  formatComputeType,
  truncate,
  formatNumber,
} from "./formatters";

// Compute
export { estimateComputeCost, formatCost as formatComputeCost, formatDuration as formatComputeDuration } from "./compute";
export type { ComputeEstimate, ComputeRequest } from "./compute";

// Storage
export {
  uploadFile,
  deleteFile,
  fileExists,
  listUserFiles,
  getFileMetadata,
  getSignedUrl,
  STORAGE_CONFIG,
} from "./storage";
export type { StorageConfig } from "./storage";

// Database
export {
  getDataset,
  createDataset,
  updateDataset,
  deleteDataset,
  listDatasets,
  getModel,
  createModel,
  updateModel,
  deleteModel,
  listModels,
  getTrainingJob,
  createTrainingJob,
  updateTrainingJob,
  listTrainingJobs,
  getAgent,
  createAgent,
  updateAgent,
  deleteAgent,
  listAgents,
} from "./db";

// Performance
export {
  debounce,
  throttle,
  memoize,
  batch,
  retryWithBackoff,
  ProcessingQueue,
  ResponseCache,
} from "./performance";

// Helpers
export {
  generateId,
  sleep,
  isEmpty,
  deepClone,
  deepMerge,
  sanitizeFileName,
  getFileExtension,
  isSupportedFileType,
  calculatePercentage,
  clamp,
  getPaginationInfo,
  createQueryString,
  parseQueryString,
  isValidEmail,
  isValidUrl,
  groupBy,
  sortBy,
  chunk,
  unique,
} from "./helpers";

// Configuration
export {
  DEFAULT_CONFIG,
  getConfig,
  isFeatureEnabled,
  isComputeEnabled,
  getMaxFileSize,
  getAllowedFileTypes,
} from "./config";
export type { AIStudioConfig } from "./config";

// Types
export type {
  Dataset,
  Model,
  TrainingJob,
  Agent,
  Deployment,
} from "./types";

// Constants
export {
  ERROR_MESSAGES,
} from "./errors";

