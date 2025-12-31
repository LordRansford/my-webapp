/**
 * Usage Analytics API
 * 
 * GET /api/account/usage?period=7d|30d|90d
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserIdFromSession } from "@/lib/studios/auth-gating";
import { readCreditAuditLog } from "@/lib/audit/creditAudit";
import { getToolDefinition } from "@/lib/tools/registry";

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "account-usage",
    limit: 30, // 30 requests per minute
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  try {
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const period = req.nextUrl.searchParams.get("period") || "30d";
    const validPeriods = ["7d", "30d", "90d"];
    if (!validPeriods.includes(period)) {
      return NextResponse.json(
        { error: "Invalid period", code: "INVALID_PERIOD" },
        { status: 400 }
      );
    }

    // Calculate date range
    const now = new Date();
    const days = period === "7d" ? 7 : period === "30d" ? 30 : 90;
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);

    // Get audit log entries
    const events = readCreditAuditLog({
      userId,
      startDate,
      endDate: now,
    });

    // Filter relevant events
    const toolExecutions = events.filter(
      (e) => e.type === "tool_execution_completed" && e.toolId && e.credits
    );
    const charges = events.filter((e) => e.type === "credit_charged" && e.credits);

    // Calculate statistics
    const totalCreditsUsed = charges.reduce((sum, e) => sum + (e.credits || 0), 0);
    const totalToolRuns = toolExecutions.length;
    const averageCreditsPerRun =
      totalToolRuns > 0 ? totalCreditsUsed / totalToolRuns : 0;

    // Tool breakdown
    const toolMap = new Map<string, { toolName: string; credits: number; runs: number }>();
    toolExecutions.forEach((event) => {
      if (!event.toolId || !event.credits) return;
      const tool = getToolDefinition(event.toolId);
      const toolName = tool?.title || event.toolId;
      const existing = toolMap.get(event.toolId) || { toolName, credits: 0, runs: 0 };
      toolMap.set(event.toolId, {
        toolName,
        credits: existing.credits + event.credits,
        runs: existing.runs + 1,
      });
    });

    const toolBreakdown = Array.from(toolMap.values())
      .sort((a, b) => b.credits - a.credits)
      .slice(0, 10); // Top 10 tools

    // Daily usage (simplified - group by date)
    const dailyMap = new Map<string, { credits: number; runs: number }>();
    toolExecutions.forEach((event) => {
      const date = new Date(event.timestamp).toISOString().split("T")[0];
      const existing = dailyMap.get(date) || { credits: 0, runs: 0 };
      dailyMap.set(date, {
        credits: existing.credits + (event.credits || 0),
        runs: existing.runs + 1,
      });
    });

    const dailyUsage = Array.from(dailyMap.entries())
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      period,
      totalCreditsUsed,
      totalToolRuns,
      averageCreditsPerRun,
      toolBreakdown,
      dailyUsage,
    });
  } catch (error) {
    console.error("Usage analytics API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
