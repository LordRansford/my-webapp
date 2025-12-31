/**
 * Circuit Breaker Pattern Implementation
 * 
 * Provides fault tolerance for external dependencies and expensive operations
 * by preventing cascading failures and allowing services to recover.
 */

interface CircuitState {
  state: "closed" | "open" | "half-open";
  failures: number;
  successes: number;
  lastFailureTime: number | null;
  nextAttemptTime: number | null;
}

interface CircuitBreakerOptions {
  failureThreshold: number; // Number of failures before opening
  successThreshold: number; // Number of successes in half-open to close
  timeoutMs: number; // Time to wait before attempting half-open
  resetTimeoutMs: number; // Time to wait before resetting failure count
}

const DEFAULT_OPTIONS: CircuitBreakerOptions = {
  failureThreshold: 5,
  successThreshold: 2,
  timeoutMs: 60000, // 1 minute
  resetTimeoutMs: 300000, // 5 minutes
};

// In-memory circuit breaker state (for production, consider Redis)
const circuits = new Map<string, CircuitState>();

/**
 * Circuit Breaker class
 */
export class CircuitBreaker {
  private key: string;
  private options: CircuitBreakerOptions;
  private state: CircuitState;

  constructor(key: string, options: Partial<CircuitBreakerOptions> = {}) {
    this.key = key;
    this.options = { ...DEFAULT_OPTIONS, ...options };
    
    // Get or create state
    const existing = circuits.get(key);
    this.state = existing || {
      state: "closed",
      failures: 0,
      successes: 0,
      lastFailureTime: null,
      nextAttemptTime: null,
    };
    
    if (!existing) {
      circuits.set(key, this.state);
    }
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    this.updateState();

    if (this.state.state === "open") {
      throw new CircuitBreakerOpenError(
        `Circuit breaker is open for ${this.key}. Retry after ${this.getRetryAfter()}ms`
      );
    }

    try {
      const result = await fn();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  /**
   * Check if circuit is open (non-blocking)
   */
  isOpen(): boolean {
    this.updateState();
    return this.state.state === "open";
  }

  /**
   * Get retry-after time in milliseconds
   */
  getRetryAfter(): number {
    if (this.state.state !== "open" || !this.state.nextAttemptTime) {
      return 0;
    }
    return Math.max(0, this.state.nextAttemptTime - Date.now());
  }

  /**
   * Get current state
   */
  getState(): "closed" | "open" | "half-open" {
    this.updateState();
    return this.state.state;
  }

  /**
   * Get statistics
   */
  getStats() {
    this.updateState();
    return {
      state: this.state.state,
      failures: this.state.failures,
      successes: this.state.successes,
      lastFailureTime: this.state.lastFailureTime,
      nextAttemptTime: this.state.nextAttemptTime,
    };
  }

  /**
   * Reset circuit breaker
   */
  reset(): void {
    this.state = {
      state: "closed",
      failures: 0,
      successes: 0,
      lastFailureTime: null,
      nextAttemptTime: null,
    };
    circuits.set(this.key, this.state);
  }

  private updateState(): void {
    const now = Date.now();

    // Reset failure count if enough time has passed
    if (
      this.state.lastFailureTime &&
      now - this.state.lastFailureTime > this.options.resetTimeoutMs
    ) {
      this.state.failures = 0;
      this.state.lastFailureTime = null;
    }

    // Transition from open to half-open
    if (
      this.state.state === "open" &&
      this.state.nextAttemptTime &&
      now >= this.state.nextAttemptTime
    ) {
      this.state.state = "half-open";
      this.state.successes = 0;
      this.state.nextAttemptTime = null;
    }
  }

  private recordSuccess(): void {
    if (this.state.state === "half-open") {
      this.state.successes++;
      if (this.state.successes >= this.options.successThreshold) {
        // Close the circuit
        this.state.state = "closed";
        this.state.failures = 0;
        this.state.successes = 0;
      }
    } else if (this.state.state === "closed") {
      // Reset failure count on success
      this.state.failures = Math.max(0, this.state.failures - 1);
    }
  }

  private recordFailure(): void {
    this.state.failures++;
    this.state.lastFailureTime = Date.now();

    if (this.state.state === "half-open") {
      // Open immediately on failure in half-open
      this.state.state = "open";
      this.state.nextAttemptTime = Date.now() + this.options.timeoutMs;
      this.state.successes = 0;
    } else if (this.state.state === "closed") {
      if (this.state.failures >= this.options.failureThreshold) {
        // Open the circuit
        this.state.state = "open";
        this.state.nextAttemptTime = Date.now() + this.options.timeoutMs;
      }
    }
  }
}

/**
 * Circuit breaker error
 */
export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CircuitBreakerOpenError";
  }
}

/**
 * Get or create a circuit breaker instance
 */
export function getCircuitBreaker(
  key: string,
  options?: Partial<CircuitBreakerOptions>
): CircuitBreaker {
  return new CircuitBreaker(key, options);
}

/**
 * Get all circuit breaker statistics
 */
export function getAllCircuitStats(): Record<string, ReturnType<CircuitBreaker["getStats"]>> {
  const stats: Record<string, ReturnType<CircuitBreaker["getStats"]>> = {};
  circuits.forEach((_, key) => {
    const breaker = new CircuitBreaker(key);
    stats[key] = breaker.getStats();
  });
  return stats;
}

/**
 * Reset all circuit breakers
 */
export function resetAllCircuits(): void {
  circuits.clear();
}
