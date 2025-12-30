/**
 * Export utilities for News and Updates
 */

import type { NormalisedItem } from "@/lib/updates/types";
import { getCVSSScore, getSeverityLevel } from "./cvss";

export function exportToJSON(items: NormalisedItem[]): string {
  return JSON.stringify(items, null, 2);
}

export function exportToCSV(items: NormalisedItem[]): string {
  if (items.length === 0) {
    return "";
  }

  const headers = [
    "Title",
    "Publisher",
    "Published Date",
    "Source",
    "URL",
    "Tags",
    "CVE ID",
    "Severity",
    "KEV",
  ];

  const rows = items.map((item) => {
    const score = getCVSSScore(item.cve);
    const severityLevel = getSeverityLevel(score);
    const severity = severityLevel === "none" ? "" : severityLevel.charAt(0).toUpperCase() + severityLevel.slice(1);

    return [
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.publisher.replace(/"/g, '""')}"`,
      item.published_at,
      item.source_id,
      item.url,
      `"${(item.topic_tags || []).join(", ").replace(/"/g, '""')}"`,
      item.cve?.cve_id || "",
      severity,
      item.cve?.kev ? "Yes" : "No",
    ];
  });

  return [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
