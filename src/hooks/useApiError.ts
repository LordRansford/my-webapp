/**
 * Custom Hook: API Error Handling
 * 
 * Provides consistent error handling for API operations
 */

import { useState, useCallback } from "react";
import { formatError, type FormattedError } from "@/lib/ai-studio/errors";
import { AIStudioApiError } from "@/lib/ai-studio/api-client";

export function useApiError() {
  const [error, setError] = useState<FormattedError | null>(null);

  const handleError = useCallback((err: unknown) => {
    const formatted = formatError(err);
    setError(formatted);
    return formatted;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const retry = useCallback(async <T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T | null> => {
    let lastError: unknown = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (err) {
        lastError = err;
        const formatted = formatError(err);

        // Don't retry if error is not retryable
        if (!formatted.retryable) {
          handleError(err);
          throw err;
        }

        // Wait before retry (exponential backoff)
        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
        }
      }
    }

    // All retries failed
    handleError(lastError);
    throw lastError;
  }, [handleError]);

  return {
    error,
    handleError,
    clearError,
    retry,
  };
}

