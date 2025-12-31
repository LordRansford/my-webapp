/**
 * Project Builder Tool Execution
 * 
 * Example implementation of a tool execution route with credit enforcement.
 * This pattern should be followed for all server-side tools.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireAuthForServerTools, getUserIdFromSession } from "@/lib/studios/auth-gating";
import { getToolDefinition, isClientSideOnly } from "@/lib/tools/registry";
import { estimateCredits, computeAuthoritativeCharge, validateSpendLimits, getUserSpendLimits, hasSufficientCredits } from "@/lib/billing/credits";
import { getCreditBalance, consumeCredits, refundCredits } from "@/lib/billing/creditStore";
import { getUserPlan } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";

export async function POST(req: NextRequest) {
  const toolId = "dev-studio-projects";
  const startTime = Date.now();

  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: `tool-${toolId}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  try {
    // Check if tool exists
    const tool = getToolDefinition(toolId);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found", code: "TOOL_NOT_FOUND" },
        { status: 404 }
      );
    }

    // Client-side only tools don't need server execution
    if (isClientSideOnly(toolId)) {
      return NextResponse.json(
        {
          error: "This tool runs client-side only",
          code: "CLIENT_SIDE_ONLY",
          message: "No server execution needed for this tool",
        },
        { status: 400 }
      );
    }

    // Check auth requirements
    const authCheck = await requireAuthForServerTools(toolId);
    if (authCheck instanceof NextResponse) {
      return authCheck; // Error response
    }

    const userId = authCheck.userId!;
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    // Estimate credits before execution
    const estimate = await estimateCredits(toolId, body.requestedLimits);
    if (!estimate) {
      return NextResponse.json(
        { error: "Failed to estimate credits", code: "ESTIMATE_FAILED" },
        { status: 500 }
      );
    }

    // Check if user has sufficient credits
    const creditCheck = await hasSufficientCredits(userId, estimate.max);
    if (!creditCheck.sufficient) {
      return NextResponse.json(
        {
          error: "Insufficient credits",
          code: "INSUFFICIENT_CREDITS",
          balance: creditCheck.balance,
          required: estimate.max,
          shortfall: creditCheck.shortfall,
          action: "Purchase credits or upgrade your plan",
          purchaseUrl: "/account/credits",
        },
        { status: 402 }
      );
    }

    // Validate spend limits
    const plan = await getUserPlan(userId);
    const limits = await getUserSpendLimits(userId);
    const spendCheck = await validateSpendLimits(userId, estimate.max, limits);
    if (!spendCheck.allowed) {
      return NextResponse.json(
        {
          error: "Spend limit exceeded",
          code: "SPEND_LIMIT_EXCEEDED",
          reason: spendCheck.reason,
          action: spendCheck.action,
        },
        { status: 429 }
      );
    }

    // Execute tool (placeholder - implement actual tool logic)
    let platformError = false;
    let actualUsage = { cpuMs: 0, memMb: 0, durationMs: 0 };
    let result: unknown = null;
    let error: Error | null = null;

    try {
      // TODO: Implement actual tool execution
      // For now, simulate execution
      const executionStart = Date.now();
      
      // Simulate tool work
      await new Promise((resolve) => setTimeout(resolve, 100));
      
      actualUsage = {
        cpuMs: Date.now() - executionStart,
        memMb: 100, // Estimated
        durationMs: Date.now() - executionStart,
      };

      // Simulate result
      result = {
        success: true,
        projectStructure: {
          // Tool-specific output
        },
      };
    } catch (execError) {
      error = execError instanceof Error ? execError : new Error("Execution failed");
      platformError = true; // Platform error = refund
    }

    // Calculate authoritative charge
    const chargeResult = computeAuthoritativeCharge(toolId, actualUsage, platformError);
    const runId = crypto.randomUUID();

    // Charge or refund credits
    if (chargeResult.refunded) {
      // This shouldn't happen for new runs, but handle it
      return NextResponse.json(
        {
          error: "Platform error",
          code: "PLATFORM_ERROR",
          message: chargeResult.reason,
          refunded: true,
        },
        { status: 500 }
      );
    }

    if (chargeResult.charge > 0) {
      try {
        const { consumeCredits } = await import("@/lib/billing/creditStore");
        await consumeCredits(userId, chargeResult.charge, toolId, runId, {
          estimated: estimate.typical,
          actual: chargeResult.charge,
          usage: actualUsage,
        });
      } catch (creditError) {
        // If credit consumption fails, this is a platform error - refund
        return NextResponse.json(
          {
            error: "Credit processing failed",
            code: "CREDIT_PROCESSING_ERROR",
            message: "Your credits were not charged. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    // Get updated balance
    const { getCreditBalance } = await import("@/lib/billing/creditStore");
    const balance = await getCreditBalance(userId);

    // Return result
    return NextResponse.json({
      success: true,
      runId,
      result,
      credits: {
        estimated: estimate.typical,
        charged: chargeResult.charge,
        balance,
      },
      executionTime: Date.now() - startTime,
    });
  } catch (error) {
    console.error("Tool execution error:", error);
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
