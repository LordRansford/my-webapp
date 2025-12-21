export function reportError(err: unknown, context: Record<string, unknown> = {}) {
  const message = err instanceof Error ? err.message : String(err);
  // Intentionally avoid logging tokens, headers, cookies, or raw request bodies.
  console.error("app:error", { message, ...context });
}


