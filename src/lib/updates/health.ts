/**
 * Health check utilities
 * 
 * Monitor ingestion pipeline health
 */

import type { NewsSnapshot, IngestionReport } from "./types";
import { readJsonFile } from "../storage/jsonFile";
import path from "path";

/**
 * Get ingestion report
 */
export function getIngestionReport(): IngestionReport | null {
  try {
    const reportPath = path.join(process.cwd(), "data", "news", "report.json");
    return readJsonFile(reportPath, null);
  } catch {
    return null;
  }
}

/**
 * Check pipeline health
 */
export function checkPipelineHealth(
  snapshot: NewsSnapshot | null,
  report: IngestionReport | null
): {
  healthy: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  if (!snapshot) {
    issues.push("No snapshot available");
    return { healthy: false, issues };
  }
  
  if (!snapshot.metadata.validation_passed) {
    issues.push("Snapshot validation failed");
  }
  
  if (report) {
    if (report.sources_failed > 0) {
      issues.push(`${report.sources_failed} source(s) failed`);
    }
    
    if (!report.validation_passed) {
      issues.push("Last ingestion validation failed");
    }
    
    // Check if last run was recent (within 24 hours)
    const lastRun = new Date(report.run_at);
    const hoursSinceRun = (Date.now() - lastRun.getTime()) / (1000 * 60 * 60);
    if (hoursSinceRun > 24) {
      issues.push(`Last ingestion was ${hoursSinceRun.toFixed(1)} hours ago`);
    }
  } else {
    issues.push("No ingestion report available");
  }
  
  return {
    healthy: issues.length === 0,
    issues,
  };
}
