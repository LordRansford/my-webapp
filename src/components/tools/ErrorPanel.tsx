"use client";

import React from "react";

export interface ToolError {
  code: string;
  message: string;
  fixSuggestion?: string;
  limitExplanation?: string;
}

interface ErrorPanelProps {
  error: ToolError;
  onDismiss?: () => void;
}

/**
 * User-friendly error display for tool execution failures.
 * Shows: what failed, why it failed, what the user can do next.
 */
export default function ErrorPanel({ error, onDismiss }: ErrorPanelProps) {
  return (
    <div
      className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">
              !
            </span>
            <h3 className="text-base font-semibold text-red-900">Execution failed</h3>
          </div>
          <p className="mt-2 text-sm text-red-800">{error.message}</p>
          {error.limitExplanation && (
            <p className="mt-2 text-xs text-red-700">
              <strong>Limit:</strong> {error.limitExplanation}
            </p>
          )}
          {error.fixSuggestion && (
            <div className="mt-3 rounded-lg border border-red-200 bg-white p-3">
              <p className="text-xs font-semibold text-red-900">What you can do:</p>
              <p className="mt-1 text-xs text-red-800">{error.fixSuggestion}</p>
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="flex-shrink-0 rounded-lg p-1 text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            aria-label="Dismiss error"
          >
            <span className="sr-only">Dismiss</span>
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Helper to create error objects from tool contract failure modes
 */
export function createToolError(
  failureMode: string,
  toolId: string,
  details?: Record<string, unknown>
): ToolError {
  const errorMap: Record<string, Omit<ToolError, "code">> = {
    syntax_error: {
      message: "Your code contains a syntax error.",
      fixSuggestion: "Check for typos, missing brackets, or incorrect syntax. Review the error details above.",
    },
    runtime_error: {
      message: "Your code encountered a runtime error during execution.",
      fixSuggestion: "Review the error message above and fix the logic or data handling.",
    },
    timeout: {
      message: "Execution exceeded the time limit.",
      fixSuggestion: "Simplify your code, reduce input size, or break it into smaller operations.",
      limitExplanation: details?.limitMs ? `Max execution time: ${details.limitMs}ms` : undefined,
    },
    memory_exceeded: {
      message: "Execution exceeded the memory limit.",
      fixSuggestion: "Reduce input size, simplify data structures, or process data in smaller chunks.",
      limitExplanation: details?.limitMb ? `Max memory: ${details.limitMb}MB` : undefined,
    },
    resource_limit: {
      message: "Execution exceeded resource limits.",
      fixSuggestion: "Reduce input complexity or size to stay within limits.",
    },
    validation_error: {
      message: "Input validation failed.",
      fixSuggestion: "Check that all required fields are filled and values are within limits.",
    },
    invalid_input: {
      message: "The provided input is invalid.",
      fixSuggestion: "Review input format and constraints.",
    },
    file_too_large: {
      message: "The uploaded file exceeds the size limit.",
      fixSuggestion: "Compress or reduce the file size, or use a smaller sample.",
      limitExplanation: details?.limitKb ? `Max file size: ${details.limitKb}KB` : undefined,
    },
    unsupported_format: {
      message: "The file format is not supported.",
      fixSuggestion: "Use a supported format (check tool documentation).",
    },
    processing_error: {
      message: "An error occurred while processing your input.",
      fixSuggestion: "Try again with a different input or check if the service is available.",
    },
  };

  const error = errorMap[failureMode] || {
    message: `An error occurred: ${failureMode}`,
    fixSuggestion: "Please try again or contact support if the issue persists.",
  };

  return {
    code: failureMode,
    ...error,
  };
}

