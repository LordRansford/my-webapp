/**
 * Sanitization utilities for News and Updates
 * 
 * HTML stripping, text sanitization, and content cleaning
 * Reuses patterns from inputSanitizer.ts
 */

import { sanitizeText } from "@/lib/studios/security/inputSanitizer";
import sanitizeHtml from "sanitize-html";

/**
 * Strip all HTML tags and return plain text
 * More aggressive than sanitizeText - removes all HTML
 */
export function stripHtml(html: string): string {
  if (typeof html !== "string") {
    return "";
  }
  
  // Use sanitize-html to strip all tags, then clean
  const stripped = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
  
  // Decode HTML entities
  const decoded = stripped
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  
  return sanitizeText(decoded, 10000).trim();
}

/**
 * Sanitize text content for storage
 * Removes HTML, limits length, prevents XSS
 */
export function sanitizeContent(content: unknown, maxLength: number = 5000): string {
  if (typeof content !== "string") {
    return "";
  }
  
  // First strip HTML if present
  const withoutHtml = stripHtml(content);
  
  // Then apply standard sanitization
  return sanitizeText(withoutHtml, maxLength);
}

/**
 * Sanitize title (shorter max length)
 */
export function sanitizeTitle(title: unknown): string {
  return sanitizeContent(title, 500);
}

/**
 * Sanitize summary/description
 */
export function sanitizeSummary(summary: unknown): string {
  return sanitizeContent(summary, 2000);
}

/**
 * Sanitize array of strings (e.g., tags)
 */
export function sanitizeStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) {
    return [];
  }
  
  return arr
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitizeText(item, 100))
    .filter((item) => item.length > 0)
    .slice(0, 50);  // Limit to 50 items
}

/**
 * Sanitize URL (validate and clean)
 */
export function sanitizeUrl(url: unknown): string {
  if (typeof url !== "string") {
    return "";
  }
  
  try {
    const parsed = new URL(url);
    // Only allow https and http
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "";
    }
    return parsed.toString();
  } catch {
    return "";
  }
}

/**
 * Sanitize date string (ISO 8601)
 */
export function sanitizeDate(date: unknown): string {
  if (typeof date !== "string") {
    return new Date().toISOString();
  }
  
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }
    return parsed.toISOString();
  } catch {
    return new Date().toISOString();
  }
}

/**
 * Generate content hash (SHA-256) for integrity checking
 */
export async function generateContentHash(content: string): Promise<string> {
  // Use Web Crypto API (available in Node.js 15+)
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}
