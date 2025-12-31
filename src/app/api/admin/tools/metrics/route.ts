/**
 * Tool Performance Metrics API
 * 
 * Provides admin access to tool execution metrics and performance statistics.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getToolPerformanceStats, getUserToolStats } from "@/lib/studios/toolMetrics";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access (simplified - you may want more robust admin check)
    const user = session.user as any;
    if (user.adminRole !== "OWNER" && user.adminRole !== "ADMIN") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const toolId = searchParams.get("toolId") || undefined;
    const userId = searchParams.get("userId") || undefined;
    const startDate = searchParams.get("startDate")
      ? new Date(searchParams.get("startDate")!)
      : undefined;
    const endDate = searchParams.get("endDate")
      ? new Date(searchParams.get("endDate")!)
      : undefined;

    if (userId) {
      // Get user-specific stats
      const stats = getUserToolStats(userId, startDate, endDate);
      return NextResponse.json({ success: true, stats });
    }

    // Get tool performance stats
    const stats = getToolPerformanceStats(toolId, startDate, endDate);
    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error("Tool metrics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
