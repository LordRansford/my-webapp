/**
 * Core fetch logic with delta support, ETags, and If-Modified-Since
 * 
 * Implements exponential backoff, rate limiting, and caching headers
 */

import { fetchWithSSRFProtection } from "../../src/lib/updates/security";
import type { SourceRegistryEntry } from "../../src/lib/updates/types";

export interface FetchOptions {
  source: SourceRegistryEntry;
  url: string;
  etag?: string;
  lastModified?: string;
  timeout?: number;
}

export interface FetchResult {
  success: boolean;
  data?: unknown;
  etag?: string;
  lastModified?: string;
  statusCode?: number;
  error?: string;
  notModified?: boolean;
}

/**
 * Exponential backoff with jitter
 */
async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function jitter(base: number): number {
  return base + Math.random() * base * 0.5;
}

/**
 * Fetch with retry logic and rate limiting
 */
export async function fetchWithRetry(
  options: FetchOptions,
  maxRetries: number = 3
): Promise<FetchResult> {
  const { source, url, etag, lastModified, timeout = 30000 } = options;
  
  let lastError: Error | undefined;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Rate limiting: check if we need to wait
      if (source.rate_limit_policy?.requests_per_minute) {
        // Simple rate limiting: wait if needed
        // In production, you'd track requests per minute more carefully
        const waitMs = source.rate_limit_policy.backoff_seconds
          ? source.rate_limit_policy.backoff_seconds * 1000
          : 1000;
        await sleep(waitMs);
      }
      
      // Build headers
      const headers: HeadersInit = {
        "User-Agent": "RansfordsNotes-NewsIngest/1.0",
        "Accept": "application/json, application/xml, text/xml, */*",
      };
      
      if (etag) {
        headers["If-None-Match"] = etag;
      }
      
      if (lastModified) {
        headers["If-Modified-Since"] = lastModified;
      }
      
      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      try {
        const response = await fetchWithSSRFProtection(url, source.id, {
          method: "GET",
          headers,
          signal: controller.signal,
        });
        
        clearTimeout(timeoutId);
        
        // Handle 304 Not Modified
        if (response.status === 304) {
          return {
            success: true,
            notModified: true,
            statusCode: 304,
          };
        }
        
        // Handle errors
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Get ETag and Last-Modified from response
        const responseEtag = response.headers.get("ETag");
        const responseLastModified = response.headers.get("Last-Modified");
        
        // Parse response based on content type
        const contentType = response.headers.get("Content-Type") || "";
        let data: unknown;
        
        if (contentType.includes("application/json")) {
          data = await response.json();
        } else if (contentType.includes("application/xml") || contentType.includes("text/xml")) {
          // For XML, return as text - parsing happens in adapters
          data = await response.text();
        } else {
          // Default to text
          data = await response.text();
        }
        
        return {
          success: true,
          data,
          etag: responseEtag || undefined,
          lastModified: responseLastModified || undefined,
          statusCode: response.status,
        };
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on abort (timeout) or 4xx errors
      if (
        error instanceof Error &&
        (error.name === "AbortError" || error.message.includes("HTTP 4"))
      ) {
        return {
          success: false,
          error: lastError.message,
        };
      }
      
      // Exponential backoff with jitter
      if (attempt < maxRetries) {
        const backoffMs = jitter(1000 * Math.pow(2, attempt));
        await sleep(backoffMs);
      }
    }
  }
  
  return {
    success: false,
    error: lastError?.message || "Max retries exceeded",
  };
}
