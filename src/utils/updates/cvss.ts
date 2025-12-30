/**
 * CVSS score utilities
 */

import type { CVEItem } from "@/lib/updates/types";

/**
 * Get numeric CVSS score from CVE item
 * Returns 0 if no valid score found
 */
export function getCVSSScore(cve?: CVEItem): number {
  if (!cve?.cvss) return 0;
  
  const v31 = cve.cvss.v31;
  const v3 = cve.cvss.v3;
  const v2 = cve.cvss.v2;
  
  // Prefer v3.1, then v3.0, then v2.0
  if (typeof v31 === "number") return v31;
  if (typeof v3 === "number") return v3;
  if (typeof v2 === "number") return v2;
  
  // Try parsing as string if needed
  if (typeof v31 === "string") {
    const parsed = parseFloat(v31);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof v3 === "string") {
    const parsed = parseFloat(v3);
    if (!isNaN(parsed)) return parsed;
  }
  if (typeof v2 === "string") {
    const parsed = parseFloat(v2);
    if (!isNaN(parsed)) return parsed;
  }
  
  return 0;
}

/**
 * Get severity level from CVSS score
 */
export function getSeverityLevel(score: number): "critical" | "high" | "medium" | "low" | "none" {
  if (score >= 9.0) return "critical";
  if (score >= 7.0) return "high";
  if (score >= 4.0) return "medium";
  if (score > 0) return "low";
  return "none";
}
