/**
 * API Designer Tool Execution
 * 
 * Hybrid tool: client-side design, server-side save/share.
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getToolDefinition } from "@/lib/tools/registry";
import { estimateCredits, computeAuthoritativeCharge, validateSpendLimits, getUserSpendLimits, hasSufficientCredits } from "@/lib/billing/credits";
import { getCreditBalance, consumeCredits } from "@/lib/billing/creditStore";
import { getUserIdFromSession } from "@/lib/studios/auth-gating";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const toolId = "dev-studio-api-designer";
  const startTime = Date.now();

  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: `tool-${toolId}`,
    limit: 10,
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  try {
    const tool = getToolDefinition(toolId);
    if (!tool) {
      return NextResponse.json(
        { error: "Tool not found", code: "TOOL_NOT_FOUND" },
        { status: 404 }
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const { action, apiDesign } = body;

    // Client-side actions (view, edit) don't require server or credits
    if (action === "view" || action === "edit") {
      return NextResponse.json({
        success: true,
        message: "Client-side operation, no credits required",
        result: { apiDesign },
      });
    }

    // Server-side actions (save, share, export) require auth and credits
    if (action === "save" || action === "share" || action === "export") {
      const userId = await getUserIdFromSession();
      if (!userId) {
        return NextResponse.json(
          {
            error: "Authentication required",
            code: "AUTH_REQUIRED",
            reason: "Save/share/export requires an account",
            action: "Sign in to continue",
            signInUrl: "/api/auth/signin",
          },
          { status: 401 }
        );
      }

      // Estimate credits (save/share operations are cheap)
      const estimate = await estimateCredits(toolId);
      if (!estimate) {
        return NextResponse.json(
          { error: "Failed to estimate credits", code: "ESTIMATE_FAILED" },
          { status: 500 }
        );
      }

      // Check credits and limits
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

      // Execute action (save/share/export)
      const runId = crypto.randomUUID();
      let result: unknown = null;
      const actualUsage = { cpuMs: 100, memMb: 50, durationMs: 100 }; // Light operation

      try {
        // TODO: Implement actual save/share/export logic
        result = {
          success: true,
          action,
          saved: action === "save",
          shared: action === "share",
          exported: action === "export",
        };
      } catch (error) {
        return NextResponse.json(
          {
            error: "Operation failed",
            code: "OPERATION_FAILED",
            message: error instanceof Error ? error.message : "Unknown error",
          },
          { status: 500 }
        );
      }

      // Charge credits
      const chargeResult = computeAuthoritativeCharge(toolId, actualUsage, false);
      if (chargeResult.charge > 0) {
        await consumeCredits(userId, chargeResult.charge, toolId, runId, {
          action,
          estimated: estimate.typical,
          actual: chargeResult.charge,
        });
      }

      const balance = await getCreditBalance(userId);

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
    }

    return NextResponse.json(
      { error: "Invalid action", code: "INVALID_ACTION" },
      { status: 400 }
    );
  } catch (error) {
    console.error("API Designer execution error:", error);
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
