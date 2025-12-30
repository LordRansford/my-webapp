/**
 * Error Handler for Studios
 * 
 * Centralized error handling with proper logging and user-friendly messages.
 */

"use client";

import { auditLogger, AuditActions } from "./auditLogger";

export interface StudioError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

class StudioErrorHandler {
  /**
   * Handle and log errors
   */
  handleError(error: unknown, context: string, studio: string): StudioError {
    const timestamp = Date.now();
    let code = "UNKNOWN_ERROR";
    let message = "An unexpected error occurred. Please try again.";
    let details: unknown = undefined;

    if (error instanceof Error) {
      code = error.name || "ERROR";
      message = error.message || message;
      details = {
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        name: error.name
      };
    } else if (typeof error === "string") {
      message = error;
      code = "STRING_ERROR";
    } else {
      details = error;
    }

    const studioError: StudioError = {
      code,
      message,
      details,
      timestamp
    };

    // Log error for audit
    auditLogger.log(AuditActions.ERROR_OCCURRED, studio, {
      context,
      error: studioError
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[Studio Error] ${studio} - ${context}:`, studioError);
    }

    return studioError;
  }

  /**
   * Create user-friendly error message
   */
  getUserFriendlyMessage(error: StudioError): string {
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      "FILE_TOO_LARGE": "The file is too large. Please choose a smaller file.",
      "INVALID_FILE_TYPE": "This file type is not supported. Please choose a different file.",
      "NETWORK_ERROR": "Unable to connect to the server. Please check your internet connection and try again.",
      "VALIDATION_ERROR": "The information you entered is not valid. Please check and try again.",
      "PERMISSION_DENIED": "You do not have permission to perform this action.",
      "RATE_LIMIT_EXCEEDED": "Too many requests. Please wait a moment and try again.",
      "SERVER_ERROR": "The server encountered an error. Please try again later.",
      "UNKNOWN_ERROR": "An unexpected error occurred. Please try again."
    };

    return errorMessages[error.code] || error.message || errorMessages["UNKNOWN_ERROR"];
  }

  /**
   * Check if error is retryable
   */
  isRetryable(error: StudioError): boolean {
    const retryableCodes = [
      "NETWORK_ERROR",
      "SERVER_ERROR",
      "RATE_LIMIT_EXCEEDED"
    ];

    return retryableCodes.includes(error.code);
  }
}

export const studioErrorHandler = new StudioErrorHandler();



