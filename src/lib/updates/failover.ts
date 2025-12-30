/**
 * Failover utilities
 * 
 * Client-side failover logic for snapshot loading
 */

import { NewsSnapshotSchema } from "./schema";
import type { NewsSnapshot } from "./types";

/**
 * Validate snapshot and return fallback if invalid
 */
export function validateWithFallback(
  latest: unknown,
  lastGood: unknown
): { snapshot: NewsSnapshot; isFallback: boolean } | null {
  // Try latest first
  const latestValidation = NewsSnapshotSchema.safeParse(latest);
  if (latestValidation.success) {
    return {
      snapshot: latestValidation.data,
      isFallback: false,
    };
  }
  
  // Fall back to last-good
  const lastGoodValidation = NewsSnapshotSchema.safeParse(lastGood);
  if (lastGoodValidation.success) {
    return {
      snapshot: lastGoodValidation.data,
      isFallback: true,
    };
  }
  
  return null;
}

/**
 * Check if snapshot is stale
 */
export function isSnapshotStale(snapshot: NewsSnapshot, maxAgeHours: number = 12): boolean {
  const generatedAt = new Date(snapshot.metadata.generated_at);
  const hoursSinceUpdate = (Date.now() - generatedAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceUpdate > maxAgeHours;
}
