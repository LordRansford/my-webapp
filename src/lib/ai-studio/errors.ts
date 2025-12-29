/**
 * Error Handling Utilities for AI Studio
 * 
 * Centralized error handling and user-friendly error messages
 */

import { AIStudioApiError } from "./api-client";

/**
 * Error codes and their user-friendly messages
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // Authentication errors
  UNAUTHORIZED: "Please sign in to continue",
  FORBIDDEN: "You don't have permission to perform this action",
  
  // Validation errors
  VALIDATION_ERROR: "Please check your input and try again",
  INVALID_FILE_TYPE: "This file type is not supported",
  FILE_TOO_LARGE: "File size exceeds the maximum limit",
  
  // Resource errors
  NOT_FOUND: "The requested resource was not found",
  ALREADY_EXISTS: "This resource already exists",
  
  // Server errors
  INTERNAL_ERROR: "An internal error occurred. Please try again later",
  SERVICE_UNAVAILABLE: "The service is temporarily unavailable",
  TIMEOUT: "The request timed out. Please try again",
  
  // Network errors
  NETWORK_ERROR: "Network connection failed. Please check your internet",
  UPLOAD_ERROR: "File upload failed. Please try again",
  
  // Training errors
  TRAINING_FAILED: "Model training failed. Please check your configuration",
  INSUFFICIENT_CREDITS: "Insufficient credits. Please upgrade your plan",
  
  // Agent errors
  AGENT_ERROR: "Agent execution failed. Please check the configuration",
  
  // Unknown
  UNKNOWN_ERROR: "An unexpected error occurred",
};

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AIStudioApiError) {
    return ERROR_MESSAGES[error.code] || error.message || ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  if (error instanceof Error) {
    // Check if error message matches any known patterns
    for (const [code, message] of Object.entries(ERROR_MESSAGES)) {
      if (error.message.toLowerCase().includes(code.toLowerCase())) {
        return message;
      }
    }
    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Get error severity level
 */
export function getErrorSeverity(error: unknown): "error" | "warning" | "info" {
  if (error instanceof AIStudioApiError) {
    if (error.status >= 500) return "error";
    if (error.status >= 400) return "warning";
    return "info";
  }

  return "error";
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof AIStudioApiError) {
    // Retry on 5xx errors or network errors
    return error.status >= 500 || error.code === "NETWORK_ERROR" || error.code === "TIMEOUT";
  }

  return false;
}

/**
 * Format error for display
 */
export interface FormattedError {
  message: string;
  severity: "error" | "warning" | "info";
  code?: string;
  retryable: boolean;
  details?: any;
}

export function formatError(error: unknown): FormattedError {
  const message = getErrorMessage(error);
  const severity = getErrorSeverity(error);
  const retryable = isRetryableError(error);

  if (error instanceof AIStudioApiError) {
    return {
      message,
      severity,
      code: error.code,
      retryable,
      details: error.details,
    };
  }

  return {
    message,
    severity,
    retryable,
  };
}

/**
 * Error boundary helper
 */
export function handleError(error: unknown, context?: string): void {
  const formatted = formatError(error);
  
  console.error(`[AI Studio${context ? ` - ${context}` : ""}]`, {
    message: formatted.message,
    code: formatted.code,
    severity: formatted.severity,
    retryable: formatted.retryable,
    details: formatted.details,
    original: error,
  });

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry.captureException(error, { tags: { context } });
  }
}

