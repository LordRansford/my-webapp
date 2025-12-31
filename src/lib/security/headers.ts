/**
 * Security Headers Middleware
 * 
 * Provides comprehensive security headers for API responses
 * to protect against common web vulnerabilities.
 */

import { NextResponse } from "next/server";

export interface SecurityHeadersOptions {
  /**
   * Content Security Policy
   * Controls which resources can be loaded
   */
  csp?: string;
  
  /**
   * Frame options
   * Prevents clickjacking attacks
   */
  frameOptions?: "DENY" | "SAMEORIGIN";
  
  /**
   * X-Content-Type-Options
   * Prevents MIME type sniffing
   */
  contentTypeNosniff?: boolean;
  
  /**
   * Referrer Policy
   * Controls referrer information
   */
  referrerPolicy?: string;
  
  /**
   * Permissions Policy (formerly Feature Policy)
   * Controls browser features
   */
  permissionsPolicy?: string;
  
  /**
   * Strict Transport Security
   * Forces HTTPS connections
   */
  hsts?: {
    maxAge: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
}

const DEFAULT_OPTIONS: SecurityHeadersOptions = {
  csp: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;",
  frameOptions: "DENY",
  contentTypeNosniff: true,
  referrerPolicy: "strict-origin-when-cross-origin",
  permissionsPolicy: "geolocation=(), microphone=(), camera=()",
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: false,
  },
};

/**
 * Apply security headers to a response
 */
export function applySecurityHeaders(
  response: NextResponse,
  options: Partial<SecurityHeadersOptions> = {}
): NextResponse {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Content Security Policy
  if (opts.csp) {
    response.headers.set("Content-Security-Policy", opts.csp);
  }

  // X-Frame-Options
  if (opts.frameOptions) {
    response.headers.set("X-Frame-Options", opts.frameOptions);
  }

  // X-Content-Type-Options
  if (opts.contentTypeNosniff) {
    response.headers.set("X-Content-Type-Options", "nosniff");
  }

  // Referrer-Policy
  if (opts.referrerPolicy) {
    response.headers.set("Referrer-Policy", opts.referrerPolicy);
  }

  // Permissions-Policy
  if (opts.permissionsPolicy) {
    response.headers.set("Permissions-Policy", opts.permissionsPolicy);
  }

  // Strict-Transport-Security
  if (opts.hsts) {
    let hstsValue = `max-age=${opts.hsts.maxAge}`;
    if (opts.hsts.includeSubDomains) {
      hstsValue += "; includeSubDomains";
    }
    if (opts.hsts.preload) {
      hstsValue += "; preload";
    }
    response.headers.set("Strict-Transport-Security", hstsValue);
  }

  // Additional security headers
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-DNS-Prefetch-Control", "off");
  response.headers.set("X-Download-Options", "noopen");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  return response;
}

/**
 * Create a middleware function that applies security headers
 */
export function withSecurityHeaders(
  handler: (req: Request) => Promise<NextResponse>,
  options?: Partial<SecurityHeadersOptions>
) {
  return async (req: Request): Promise<NextResponse> => {
    const response = await handler(req);
    return applySecurityHeaders(response, options);
  };
}
