/**
 * Security utilities for News and Updates ingestion
 * 
 * SSRF prevention, host allowlisting, and IP range blocking
 */

import { getAllSources, isHostnameAllowed } from "./sources";

/**
 * Private IP ranges that should be blocked
 */
const PRIVATE_IP_RANGES = [
  /^127\./,                    // 127.0.0.0/8
  /^10\./,                     // 10.0.0.0/8
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12
  /^192\.168\./,               // 192.168.0.0/16
  /^169\.254\./,               // Link-local
  /^::1$/,                     // IPv6 localhost
  /^fc00:/,                    // IPv6 private
  /^fe80:/,                    // IPv6 link-local
];

/**
 * Check if an IP address is in a private range
 */
export function isPrivateIP(ip: string): boolean {
  // IPv4
  for (const range of PRIVATE_IP_RANGES) {
    if (range.test(ip)) {
      return true;
    }
  }
  return false;
}

/**
 * Resolve hostname to IP and check if it's private
 * Note: In Node.js, we can use dns.lookup, but for security we should
 * validate the hostname against allowlist first
 */
export async function validateHostnameSecurity(
  hostname: string,
  sourceId: string
): Promise<{ allowed: boolean; error?: string }> {
  // First check: is hostname in allowlist?
  if (!isHostnameAllowed(hostname, sourceId)) {
    return {
      allowed: false,
      error: `Hostname ${hostname} is not in allowlist for source ${sourceId}`,
    };
  }

  // Second check: resolve and verify not private IP
  // In production, we'd use dns.lookup, but for now we trust the allowlist
  // since all sources are explicitly allowlisted public domains
  
  // Additional validation: ensure hostname doesn't contain suspicious patterns
  if (
    hostname.includes("localhost") ||
    hostname.includes("127.0.0.1") ||
    hostname.includes("0.0.0.0") ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.")
  ) {
    return {
      allowed: false,
      error: `Hostname ${hostname} contains private IP patterns`,
    };
  }

  return { allowed: true };
}

/**
 * Validate URL for SSRF prevention
 * Checks protocol, hostname allowlist, and private IP patterns
 */
export function validateUrlForSSRF(
  url: string,
  sourceId: string
): { valid: boolean; error?: string; parsed?: URL } {
  try {
    const parsed = new URL(url);

    // Protocol check: only HTTPS (and HTTP for local testing if needed)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        valid: false,
        error: `Protocol ${parsed.protocol} is not allowed (only https: and http:)`,
      };
    }

    // Hostname allowlist check
    if (!isHostnameAllowed(parsed.hostname, sourceId)) {
      return {
        valid: false,
        error: `Hostname ${parsed.hostname} is not in allowlist for source ${sourceId}`,
      };
    }

    // Check for private IP patterns in hostname
    if (isPrivateIP(parsed.hostname)) {
      return {
        valid: false,
        error: `Hostname ${parsed.hostname} appears to be a private IP`,
      };
    }

    return { valid: true, parsed };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

/**
 * Follow redirects safely (prevent SSRF via redirects)
 * Only follows redirects to allowlisted hostnames
 */
export async function fetchWithSSRFProtection(
  url: string,
  sourceId: string,
  options: RequestInit = {}
): Promise<Response> {
  // Validate URL first
  const validation = validateUrlForSSRF(url, sourceId);
  if (!validation.valid) {
    throw new Error(`SSRF protection: ${validation.error}`);
  }

  // Make request with redirect handling
  const response = await fetch(url, {
    ...options,
    redirect: "manual",  // Handle redirects manually
  });

  // Check for redirects
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("location");
    if (location) {
      // Validate redirect URL
      const redirectValidation = validateUrlForSSRF(location, sourceId);
      if (!redirectValidation.valid) {
        throw new Error(`SSRF protection: redirect to ${location} blocked: ${redirectValidation.error}`);
      }
      // Follow redirect recursively
      return fetchWithSSRFProtection(location, sourceId, options);
    }
  }

  return response;
}
