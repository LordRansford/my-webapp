/**
 * React Hook for Retry Logic
 * 
 * Provides a React hook for retrying async operations with exponential backoff
 */

"use client";

import { useState, useCallback } from "react";
import { retryWithBackoff, RetryOptions, RetryResult } from "@/lib/studios/utils/retry";

interface UseRetryReturn<T> {
  execute: () => Promise<RetryResult<T>>;
  isRetrying: boolean;
  attempts: number;
  lastError: unknown | null;
  reset: () => void;
}

/**
 * Hook for retrying async operations
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Object with execute function and retry state
 * 
 * @example
 * ```typescript
 * const { execute, isRetrying, attempts, lastError } = useRetry(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   {
 *     maxAttempts: 3,
 *     initialDelayMs: 1000
 *   }
 * );
 * 
 * // Use in component
 * const handleClick = async () => {
 *   const result = await execute();
 *   if (result.success) {
 *     console.log('Data:', result.data);
 *   }
 * };
 * ```
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): UseRetryReturn<T> {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lastError, setLastError] = useState<unknown | null>(null);

  const execute = useCallback(async (): Promise<RetryResult<T>> => {
    setIsRetrying(true);
    setAttempts(0);
    setLastError(null);

    const result = await retryWithBackoff(fn, {
      ...options,
      onRetry: (attempt, error) => {
        setAttempts(attempt);
        setLastError(error);
        if (options.onRetry) {
          options.onRetry(attempt, error);
        }
      }
    });

    setIsRetrying(false);
    setAttempts(result.attempts);
    
    if (!result.success) {
      setLastError(result.error);
    }

    return result;
  }, [fn, options]);

  const reset = useCallback(() => {
    setIsRetrying(false);
    setAttempts(0);
    setLastError(null);
  }, []);

  return {
    execute,
    isRetrying,
    attempts,
    lastError,
    reset
  };
}



