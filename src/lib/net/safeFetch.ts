export { SafeFetchBlockedError, SafeFetchTimeoutError, safeFetch } from "@/lib/net/safeFetch.core.js";

export type SafeFetchInit = RequestInit & {
  maxResponseBytes: number;
  overallTimeoutMs: number;
  allowHttpInDev?: boolean;
  allowLocalhostInDev?: boolean;
};


