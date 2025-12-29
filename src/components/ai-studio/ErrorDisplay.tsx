"use client";

/**
 * Error Display Component
 * 
 * Displays formatted error messages with retry option
 */

import React from "react";
import { AlertCircle, RefreshCw, X } from "lucide-react";
import { formatError, type FormattedError } from "@/lib/ai-studio/errors";

interface ErrorDisplayProps {
  error: unknown;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export default function ErrorDisplay({
  error,
  onRetry,
  onDismiss,
  className = "",
}: ErrorDisplayProps) {
  const formatted: FormattedError = formatError(error);

  const getVariant = () => {
    switch (formatted.severity) {
      case "error":
        return "destructive";
      case "warning":
        return "warning";
      default:
        return "default";
    }
  };

  const getColorClasses = () => {
    switch (formatted.severity) {
      case "error":
        return "border-red-200 bg-red-50 text-red-900";
      case "warning":
        return "border-amber-200 bg-amber-50 text-amber-900";
      default:
        return "border-blue-200 bg-blue-50 text-blue-900";
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 ${getColorClasses()} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{formatted.message}</p>
          {formatted.code && (
            <p className="text-xs mt-1 opacity-75">Error code: {formatted.code}</p>
          )}
          {formatted.details && process.env.NODE_ENV !== "production" && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer opacity-75">Technical details</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {JSON.stringify(formatted.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {formatted.retryable && onRetry && (
            <button
              onClick={onRetry}
              className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              title="Retry"
              aria-label="Retry operation"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
              title="Dismiss"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

