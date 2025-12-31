/**
 * Response Caching Utilities
 * 
 * Provides intelligent caching for tool execution results
 * to improve performance and reduce credit costs for repeated queries.
 */

import crypto from "crypto";

interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
  hitCount: number;
}

// In-memory cache (for production, consider Redis or similar)
const cache = new Map<string, CacheEntry<unknown>>();

// Cache configuration
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 1000; // Maximum number of entries

/**
 * Generate cache key from tool ID and request body
 */
export function generateCacheKey(toolId: string, body: any): string {
  // Create a deterministic key from tool ID and normalized body
  const normalized = JSON.stringify(body, Object.keys(body || {}).sort());
  const hash = crypto.createHash("sha256").update(`${toolId}:${normalized}`).digest("hex").slice(0, 16);
  return `tool:${toolId}:${hash}`;
}

/**
 * Get cached value if available and not expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  
  if (!entry) {
    return null;
  }

  // Check if expired
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  // Update hit count
  entry.hitCount++;
  return entry.value;
}

/**
 * Set cache value with TTL
 */
export function setCached<T>(key: string, value: T, ttlMs: number = DEFAULT_TTL_MS): void {
  // Evict oldest entries if cache is full
  if (cache.size >= MAX_CACHE_SIZE) {
    const entries = Array.from(cache.entries());
    entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
    // Remove oldest 10% of entries
    const toRemove = Math.ceil(MAX_CACHE_SIZE * 0.1);
    for (let i = 0; i < toRemove; i++) {
      cache.delete(entries[i][0]);
    }
  }

  const now = Date.now();
  cache.set(key, {
    key,
    value,
    expiresAt: now + ttlMs,
    createdAt: now,
    hitCount: 0,
  });
}

/**
 * Invalidate cache entries for a tool
 */
export function invalidateToolCache(toolId: string): void {
  const prefix = `tool:${toolId}:`;
  const keysToDelete: string[] = [];
  
  cache.forEach((_, key) => {
    if (key.startsWith(prefix)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => cache.delete(key));
}

/**
 * Clear all cache entries
 */
export function clearCache(): void {
  cache.clear();
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  hitRate: number;
  totalHits: number;
  totalEntries: number;
} {
  let totalHits = 0;
  let totalEntries = 0;

  cache.forEach((entry) => {
    totalHits += entry.hitCount;
    totalEntries++;
  });

  return {
    size: cache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: totalEntries > 0 ? totalHits / totalEntries : 0,
    totalHits,
    totalEntries,
  };
}

/**
 * Determine if a tool result should be cached
 */
export function shouldCache(toolId: string, result: unknown): boolean {
  // Don't cache errors
  if (result && typeof result === "object" && "error" in result) {
    return false;
  }

  // Don't cache results that contain sensitive data
  if (result && typeof result === "object") {
    const resultStr = JSON.stringify(result);
    const sensitivePatterns = [
      /password/i,
      /token/i,
      /secret/i,
      /key/i,
      /credential/i,
      /auth/i,
    ];
    
    if (sensitivePatterns.some((pattern) => pattern.test(resultStr))) {
      return false;
    }
  }

  // Cache successful results for read-only tools
  const readOnlyTools = [
    "data-studio-schema",
    "data-studio-catalog",
    "cyber-studio-vulnerability-scanner",
  ];

  return readOnlyTools.includes(toolId);
}
