export { SafeFetchBlockedError, SafeFetchTimeoutError, safeFetch } from "@/lib/net/safeFetch.core.js";

export type SafeFetchInit = RequestInit & {
  maxResponseBytes: number;
  overallTimeoutMs: number;
  /**
   * Allow plain HTTP in production for explicitly-audited endpoints.
   * Keep default false to avoid accidental downgrade to insecure transport.
   */
  allowHttp?: boolean;
  allowHttpInDev?: boolean;
  allowLocalhostInDev?: boolean;
};


