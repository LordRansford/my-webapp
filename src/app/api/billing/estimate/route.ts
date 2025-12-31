/**
 * Credit Estimation API
 * 
 * Returns authoritative server-side credit estimates for tool runs.
 * This is called before tool execution to show users the expected cost.
 */

import { NextRequest, NextResponse } from "next/server";
import { estimateCredits } from "@/lib/billing/credits";
import { getToolDefinition } from "@/lib/tools/registry";
import { requireAuthForServerTools } from "@/lib/studios/auth-gating";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserPlan } from "@/lib/billing/access";

export async function POST(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "billing-estimate",
    limit: 20, // 20 estimates per minute
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const { toolId, requestedLimits } = body;

    if (!toolId || typeof toolId !== "string") {
      return NextResponse.json(
        { error: "toolId is required", code: "TOOL_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // Check if tool exists
    const tool = getToolDefinition(toolId);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found", code: "TOOL_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Check auth requirements for server-side tools
    if (tool.executionMode !== "client_only") {
      const authCheck = await requireAuthForServerTools(toolId);
      if (authCheck instanceof NextResponse) {
        return authCheck; // Error response
      }
    }

    // Get user plan for context (optional, doesn't affect estimate)
    let userTier: "free" | "supporter" | "pro" | undefined;
    try {
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth/options");
      const session = await getServerSession(authOptions);
      if (session?.user?.id) {
        const plan = await getUserPlan(session.user.id);
        userTier = plan as "free" | "supporter" | "pro";
      }
    } catch {
      // Ignore auth errors for estimation
    }

    // Estimate credits
    const estimate = await estimateCredits(toolId, requestedLimits, userTier);

    if (!estimate) {
      return NextResponse.json(
        { error: "Failed to estimate credits", code: "ESTIMATE_FAILED" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      toolId,
      estimate,
      tool: {
        title: tool.title,
        executionMode: tool.executionMode,
        requiresAuth: tool.requiresAuth,
      },
    });
  } catch (error) {
    console.error("Credit estimation error:", error);
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
