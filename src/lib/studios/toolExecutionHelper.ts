/**
 * Tool Execution Route Helper
 * 
 * Provides a reusable pattern for creating tool execution API routes
 * with credit enforcement, auth gating, and error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireAuthForServerTools, getUserIdFromSession } from "@/lib/studios/auth-gating";
import { getToolDefinition, isClientSideOnly } from "@/lib/tools/registry";
import {
  estimateCredits,
  computeAuthoritativeCharge,
  validateSpendLimits,
  getUserSpendLimits,
  hasSufficientCredits,
} from "@/lib/billing/credits";
import { getCreditBalance, consumeCredits } from "@/lib/billing/creditStore";

export interface ToolExecutionOptions {
  toolId: string;
  executeTool: (userId: string, body: any) => Promise<{
    result: unknown;
    actualUsage: { cpuMs: number; memMb: number; durationMs: number };
    platformError?: boolean;
  }>;
  rateLimitKey?: string;
  rateLimitWindow?: number;
}

/**
 * Create a tool execution route handler
 * 
 * This helper encapsulates the common pattern:
 * 1. Rate limiting
 * 2. Tool validation
 * 3. Auth gating
 * 4. Credit estimation
 * 5. Balance & limit checks
 * 6. Tool execution
 * 7. Credit charging
 * 8. Response formatting
 */
export function createToolExecutionHandler(options: ToolExecutionOptions) {
  return async function handler(req: NextRequest) {
    const { toolId, executeTool, rateLimitKey, rateLimitWindow } = options;
    const startTime = Date.now();

    // Rate limiting
    const rateLimitResult = rateLimit(req, {
      keyPrefix: rateLimitKey || `tool-${toolId}`,
      limit: 10,
      windowMs: rateLimitWindow || 60_000,
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

      // Execute tool
      let platformError = false;
      let actualUsage = { cpuMs: 0, memMb: 0, durationMs: 0 };
      let result: unknown = null;

      try {
        const executionResult = await executeTool(userId, body);
        result = executionResult.result;
        actualUsage = executionResult.actualUsage;
        platformError = executionResult.platformError || false;
      } catch (execError) {
        platformError = true; // Platform error = refund
        throw execError;
      }

      // Calculate authoritative charge
      const chargeResult = computeAuthoritativeCharge(toolId, actualUsage, platformError);
      const runId = crypto.randomUUID();

      // Charge or refund credits
      if (chargeResult.refunded) {
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
      console.error(`Tool execution error (${toolId}):`, error);
      return NextResponse.json(
        {
          error: "Internal server error",
          code: "INTERNAL_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  };
}
