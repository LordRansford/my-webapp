/**
 * Retry Utility with Exponential Backoff
 * 
 * Provides robust retry logic for async operations with exponential backoff,
 * jitter, and configurable retry policies.
 */

export interface RetryOptions {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  jitter?: boolean;
  retryable?: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

export interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: unknown;
  attempts: number;
}

/**
 * Default retryable error checker
 */
function isRetryableError(error: unknown): boolean {
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes("network") || error.message.includes("fetch")) {
      return true;
    }
    // Timeout errors
    if (error.message.includes("timeout") || error.name === "TimeoutError") {
      return true;
    }
    // Rate limit errors (with backoff)
    if (error.message.includes("rate limit") || error.message.includes("429")) {
      return true;
    }
  }
  
  // Check for specific error codes
  if (typeof error === "object" && error !== null) {
    const err = error as { code?: string; status?: number };
    if (err.code === "ECONNRESET" || err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") {
      return true;
    }
    if (err.status === 429 || err.status === 503 || err.status === 502) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate delay with exponential backoff and optional jitter
 */
function calculateDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  backoffMultiplier: number,
  jitter: boolean
): number {
  const exponentialDelay = initialDelayMs * Math.pow(backoffMultiplier, attempt - 1);
  const delay = Math.min(exponentialDelay, maxDelayMs);
  
  if (jitter) {
    // Add random jitter (±20%) to prevent thundering herd
    const jitterAmount = delay * 0.2;
    const jitterValue = (Math.random() * 2 - 1) * jitterAmount;
    return Math.max(0, delay + jitterValue);
  }
  
  return delay;
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry an async function with exponential backoff
 * 
 * @param fn - The async function to retry
 * @param options - Retry configuration options
 * @returns Promise with retry result
 * 
 * @example
 * ```typescript
 * const result = await retryWithBackoff(
 *   () => fetch('/api/data'),
 *   {
 *     maxAttempts: 3,
 *     initialDelayMs: 1000,
 *     onRetry: (attempt, error) => console.log(`Retry ${attempt}:`, error)
 *   }
 * );
 * 
 * if (result.success) {
 *   console.log('Data:', result.data);
 * } else {
 *   console.error('Failed after', result.attempts, 'attempts:', result.error);
 * }
 * ```
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<RetryResult<T>> {
  const {
    maxAttempts = 3,
    initialDelayMs = 1000,
    maxDelayMs = 30000,
    backoffMultiplier = 2,
    jitter = true,
    retryable = isRetryableError,
    onRetry
  } = options;

  let lastError: unknown;
  let attempts = 0;

  for (attempts = 1; attempts <= maxAttempts; attempts++) {
    try {
      const data = await fn();
      return {
        success: true,
        data,
        attempts
      };
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempts >= maxAttempts) {
        break;
      }

      // Don't retry if error is not retryable
      if (!retryable(error)) {
        break;
      }

      // Calculate delay and wait before retrying
      const delay = calculateDelay(
        attempts,
        initialDelayMs,
        maxDelayMs,
        backoffMultiplier,
        jitter
      );

      if (onRetry) {
        onRetry(attempts, error);
      }

      await sleep(delay);
    }
  }

  return {
    success: false,
    error: lastError,
    attempts
  };
}

/**
 * Retry a fetch request with exponential backoff
 * 
 * @param url - The URL to fetch
 * @param init - Fetch options
 * @param options - Retry configuration options
 * @returns Promise with fetch result
 */
export async function retryFetch<T = unknown>(
  url: string,
  init?: RequestInit,
  options: RetryOptions = {}
): Promise<RetryResult<Response>> {
  return retryWithBackoff(
    async () => {
      const response = await fetch(url, init);
      
      // Treat non-2xx responses as errors for retry logic
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as { status?: number }).status = response.status;
        throw error;
      }
      
      return response;
    },
    {
      ...options,
      retryable: (error) => {
        // Use custom retryable if provided
        if (options.retryable) {
          return options.retryable(error);
        }
        
        // Default: retry on network errors and 5xx/429 status codes
        if (error instanceof Error) {
          const err = error as { status?: number };
          if (err.status === 429 || err.status === 502 || err.status === 503 || err.status === 504) {
            return true;
          }
        }
        
        return isRetryableError(error);
      }
    }
  );
}

/**
 * Create a retryable function wrapper
 * 
 * @param fn - The function to wrap
 * @param options - Retry configuration options
 * @returns Wrapped function that automatically retries
 */
export function withRetry<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: RetryOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    const result = await retryWithBackoff(
      () => fn(...args),
      options
    );
    
    if (result.success) {
      return result.data;
    }
    
    throw result.error;
  }) as T;
}



