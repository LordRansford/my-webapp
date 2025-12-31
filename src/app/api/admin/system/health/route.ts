/**
 * Detailed System Health Check (Admin Only)
 * 
 * Provides comprehensive system health information including
 * component status, metrics, and diagnostics.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getSystemHealth, getComponentHealth } from "@/lib/studios/systemHealth";
import { getCacheStats } from "@/lib/studios/responseCache";
import { getToolPerformanceStats } from "@/lib/studios/toolMetrics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const user = session.user as any;
    if (user.adminRole !== "OWNER" && user.adminRole !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const component = searchParams.get("component") as "database" | "storage" | "credits" | "tools" | null;

    if (component) {
      // Get specific component health
      const health = await getComponentHealth(component);
      return NextResponse.json({ success: true, component, health });
    }

    // Get full system health
    const health = await getSystemHealth();
    const cacheStats = getCacheStats();
    const toolStats = getToolPerformanceStats(undefined, undefined, undefined);

    return NextResponse.json({
      success: true,
      health,
      cache: cacheStats,
      tools: {
        totalExecutions: toolStats.totalExecutions,
        successRate: toolStats.totalExecutions > 0
          ? (toolStats.successfulExecutions / toolStats.totalExecutions) * 100
          : 0,
        averageDuration: toolStats.averageDurationMs,
      },
    });
  } catch (error) {
    console.error("System health API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
