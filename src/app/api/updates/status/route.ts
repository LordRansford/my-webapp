/**
 * API route to check ingestion status
 */

import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

export async function GET() {
  try {
    const reportPath = join(process.cwd(), "data", "news", "report.json");
    const latestPath = join(process.cwd(), "data", "news", "latest.json");
    
    const fs = await import("fs");
    const { existsSync } = fs;
    
    let report: any = null;
    let latest: any = null;
    
    if (existsSync(reportPath)) {
      try {
        const reportData = readFileSync(reportPath, "utf8");
        report = JSON.parse(reportData);
      } catch {
        // Ignore parse errors
      }
    }
    
    if (existsSync(latestPath)) {
      try {
        const latestData = readFileSync(latestPath, "utf8");
        latest = JSON.parse(latestData);
      } catch {
        // Ignore parse errors
      }
    }
    
    return NextResponse.json({
      report,
      latest: latest && typeof latest === "object" && latest.metadata ? {
        item_count: latest.metadata.item_count || 0,
        generated_at: latest.metadata.generated_at,
        source_count: latest.metadata.source_count || 0,
      } : null,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error loading status:", error);
    return NextResponse.json(
      { error: "Failed to load status" },
      { status: 500 }
    );
  }
}
