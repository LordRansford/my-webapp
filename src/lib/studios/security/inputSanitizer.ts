/**
 * Input Sanitization for Studios
 * 
 * Provides utilities to sanitize and validate user inputs across all studios
 * to prevent XSS, injection attacks, and data corruption.
 */

/**
 * Sanitize text input to prevent XSS attacks
 * Removes HTML tags and limits length
 */
export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, "");

  // Remove potentially dangerous characters
  sanitized = sanitized.replace(/[<>\"']/g, "");

  // Trim whitespace
  sanitized = sanitized.trim();

  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  return sanitized;
}

/**
 * Sanitize file name to prevent path traversal and other attacks
 */
export function sanitizeFileName(fileName: string): string {
  if (!fileName || typeof fileName !== "string") {
    return "file";
  }

  // Remove path separators and dangerous characters
  let sanitized = fileName
    .replace(/[\/\\]/g, "_") // Replace path separators
    .replace(/[<>:"|?*]/g, "_") // Replace Windows reserved characters
    .replace(/\.\./g, "_") // Prevent path traversal
    .trim();

  // Remove leading dots (hidden files)
  sanitized = sanitized.replace(/^\.+/, "");

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.split(".").pop();
    const name = sanitized.slice(0, 255 - (ext ? ext.length + 1 : 0));
    sanitized = ext ? `${name}.${ext}` : name;
  }

  // Ensure it's not empty
  if (!sanitized) {
    sanitized = "file";
  }

  return sanitized;
}

/**
 * Validate and sanitize JSON input
 */
export function sanitizeJson(input: unknown): { valid: boolean; data: any; error?: string } {
  if (typeof input !== "string") {
    return { valid: false, data: null, error: "Input must be a string" };
  }

  try {
    const parsed = JSON.parse(input);
    
    // Check for circular references and limit depth
    const sanitized = sanitizeObject(parsed, 0, 10);
    
    return { valid: true, data: sanitized };
  } catch (error) {
    return { valid: false, data: null, error: "Invalid JSON format" };
  }
}

/**
 * Recursively sanitize object to prevent prototype pollution
 */
function sanitizeObject(obj: any, depth: number, maxDepth: number): any {
  if (depth > maxDepth) {
    return null;
  }

  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return typeof obj === "string" ? sanitizeText(obj, 10000) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item, depth + 1, maxDepth));
  }

  const sanitized: any = {};
  for (const key in obj) {
    // Prevent prototype pollution
    if (!Object.prototype.hasOwnProperty.call(obj, key)) {
      continue;
    }

    // Sanitize key
    const safeKey = sanitizeText(key, 100);
    if (!safeKey || safeKey.startsWith("__proto__") || safeKey.startsWith("constructor")) {
      continue;
    }

    sanitized[safeKey] = sanitizeObject(obj[key], depth + 1, maxDepth);
  }

  return sanitized;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  if (typeof email !== "string") {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

/**
 * Validate URL format and prevent SSRF
 */
export function validateUrl(url: string, allowedProtocols: string[] = ["https:", "http:"]): { valid: boolean; url?: URL; error?: string } {
  if (typeof url !== "string") {
    return { valid: false, error: "URL must be a string" };
  }

  try {
    const parsed = new URL(url);

    // Check protocol
    if (!allowedProtocols.includes(parsed.protocol)) {
      return { valid: false, error: `Protocol ${parsed.protocol} is not allowed` };
    }

    // Prevent localhost and private IPs (basic SSRF protection)
    const hostname = parsed.hostname.toLowerCase();
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.startsWith("192.168.") ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("172.17.") ||
      hostname.startsWith("172.18.") ||
      hostname.startsWith("172.19.") ||
      hostname.startsWith("172.20.") ||
      hostname.startsWith("172.21.") ||
      hostname.startsWith("172.22.") ||
      hostname.startsWith("172.23.") ||
      hostname.startsWith("172.24.") ||
      hostname.startsWith("172.25.") ||
      hostname.startsWith("172.26.") ||
      hostname.startsWith("172.27.") ||
      hostname.startsWith("172.28.") ||
      hostname.startsWith("172.29.") ||
      hostname.startsWith("172.30.") ||
      hostname.startsWith("172.31.")
    ) {
      return { valid: false, error: "Local and private IP addresses are not allowed" };
    }

    return { valid: true, url: parsed };
  } catch (error) {
    return { valid: false, error: "Invalid URL format" };
  }
}

/**
 * Validate file type by MIME type and extension
 */
export function validateFileType(file: File, allowedTypes: string[], allowedExtensions: string[]): { valid: boolean; error?: string } {
  // Check MIME type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  // Check extension
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (allowedExtensions.length > 0 && !allowedExtensions.includes(extension)) {
    return { valid: false, error: `File extension ${extension} is not allowed` };
  }

  return { valid: true };
}



