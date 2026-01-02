/**
 * Utility functions for Sentry error reporting
 * This file is designed to gracefully handle the case where @sentry/nextjs is not installed
 * 
 * NOTE: This uses Function constructor to create dynamic imports that bundlers cannot
 * statically analyze. This allows the build to succeed even if @sentry/nextjs is not installed.
 */

let sentryModule: any = null;
let sentryLoadAttempted = false;

async function loadSentry() {
  if (sentryLoadAttempted) return sentryModule;
  sentryLoadAttempted = true;
  
  try {
    // Use eval to create import that cannot be statically analyzed by bundlers
    // This prevents Turbopack/webpack from trying to resolve the module at build time
    // The string is constructed at runtime to avoid static analysis
    const moduleName = '@' + 'sentry' + '/' + 'nextjs';
    // eslint-disable-next-line no-eval
    sentryModule = await eval(`import('${moduleName}')`);
    return sentryModule;
  } catch {
    // Module not installed or failed to load
    sentryModule = null;
    return null;
  }
}

export async function captureException(error: Error, context?: any) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  
  try {
    const Sentry = await loadSentry();
    if (Sentry?.captureException) {
      Sentry.captureException(error, context);
    }
  } catch {
    // Silently ignore - Sentry not available or error in Sentry itself
  }
}

// Synchronous version for use in error boundaries and immediate error handling
export function captureExceptionSync(error: Error, context?: any) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  
  try {
    // Try to use the standard Sentry import if available (for server-side)
    if (typeof window === 'undefined') {
      // Server-side: try direct import
      const Sentry = require('@sentry/nextjs');
      if (Sentry?.captureException) {
        Sentry.captureException(error, context);
      }
    } else {
      // Client-side: use async version
      captureException(error, context);
    }
  } catch {
    // Fallback to async version
    captureException(error, context);
  }
}
