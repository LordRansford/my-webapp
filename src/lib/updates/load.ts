/**
 * Client-side snapshot loader with failover
 * 
 * Loads latest.json, falls back to last-good.json if validation fails
 */

import { NewsSnapshotSchema } from "./schema";
import type { NewsSnapshot } from "./types";

export interface LoadResult {
  success: boolean;
  snapshot?: NewsSnapshot;
  isFallback: boolean;
  error?: string;
}

/**
 * Load snapshot from API route or static file
 */
export async function loadSnapshot(): Promise<LoadResult> {
  try {
    // Try loading latest.json
    const latestResponse = await fetch("/api/updates/latest");
    
    if (!latestResponse.ok) {
      throw new Error(`Failed to load latest snapshot: ${latestResponse.status}`);
    }
    
    const latestData = await latestResponse.json();
    
    // Validate
    const validation = NewsSnapshotSchema.safeParse(latestData);
    if (validation.success) {
      return {
        success: true,
        snapshot: validation.data,
        isFallback: false,
      };
    }
    
    // Validation failed, try last-good.json
    console.warn("Latest snapshot validation failed, trying last-good snapshot");
    
    const lastGoodResponse = await fetch("/api/updates/last-good");
    if (!lastGoodResponse.ok) {
      throw new Error(`Failed to load last-good snapshot: ${lastGoodResponse.status}`);
    }
    
    const lastGoodData = await lastGoodResponse.json();
    const lastGoodValidation = NewsSnapshotSchema.safeParse(lastGoodData);
    
    if (lastGoodValidation.success) {
      return {
        success: true,
        snapshot: lastGoodValidation.data,
        isFallback: true,
      };
    }
    
    return {
      success: false,
      isFallback: false,
      error: "Both latest and last-good snapshots failed validation",
    };
  } catch (error) {
    return {
      success: false,
      isFallback: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
