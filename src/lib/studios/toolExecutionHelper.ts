/**
 * Tool Execution Route Helper
 * 
 * Provides a reusable pattern for creating tool execution API routes
 * with credit enforcement, auth gating, error handling, and comprehensive observability.
 * 
 * Features:
 * - Structured logging with request IDs
 * - Performance metrics and timing
 * - Timeout handling
 * - Error categorization and recovery
 * - Credit audit trail
 * - Request/response logging
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
import { logCreditEvent } from "@/lib/audit/creditAudit";
import { logger } from "@/server/logger";
import { recordToolMetric } from "@/lib/studios/toolMetrics";
import { generateCacheKey, getCached, setCached, shouldCache } from "@/lib/studios/responseCache";
import { applySecurityHeaders } from "@/lib/security/headers";
import { getCircuitBreaker } from "@/lib/studios/circuitBreaker";

export interface ToolExecutionOptions {
  toolId: string;
  executeTool: (userId: string, body: any) => Promise<{
    result: unknown;
    actualUsage: { cpuMs: number; memMb: number; durationMs: number };
    platformError?: boolean;
  }>;
  rateLimitKey?: string;
  rateLimitWindow?: number;
  timeoutMs?: number; // Execution timeout (default: 30s)
  enableRetry?: boolean; // Enable retry for transient failures
  maxRetries?: number; // Maximum retry attempts (default: 1)
}

interface ExecutionMetrics {
  requestId: string;
  toolId: string;
  userId: string;
  startTime: number;
  endTime?: number;
  durationMs?: number;
  phase: "rate_limit" | "auth" | "credit_check" | "execution" | "charging" | "complete" | "error";
  phaseStartTime: number;
  phaseDurations: Record<string, number>;
  creditEstimate?: number;
  creditCharged?: number;
  errorType?: string;
  errorCode?: string;
}

function createMetrics(requestId: string, toolId: string, userId: string): ExecutionMetrics {
  const now = Date.now();
  return {
    requestId,
    toolId,
    userId,
    startTime: now,
    phase: "rate_limit",
    phaseStartTime: now,
    phaseDurations: {},
  };
}

function recordPhase(metrics: ExecutionMetrics, phase: ExecutionMetrics["phase"]): void {
  const now = Date.now();
  const duration = now - metrics.phaseStartTime;
  metrics.phaseDurations[metrics.phase] = duration;
  metrics.phase = phase;
  metrics.phaseStartTime = now;
}

function finalizeMetrics(metrics: ExecutionMetrics): void {
  metrics.endTime = Date.now();
  metrics.durationMs = metrics.endTime - metrics.startTime;
  recordPhase(metrics, metrics.phase); // Record final phase
}

function logExecutionMetrics(metrics: ExecutionMetrics, success: boolean): void {
  const logCtx = {
    requestId: metrics.requestId,
    route: `/api/tools/${metrics.toolId}`,
  };

  const logPayload = {
    toolId: metrics.toolId,
    userId: metrics.userId,
    durationMs: metrics.durationMs,
    phaseDurations: metrics.phaseDurations,
    creditEstimate: metrics.creditEstimate,
    creditCharged: metrics.creditCharged,
    success,
    errorType: metrics.errorType,
    errorCode: metrics.errorCode,
  };

  if (success) {
    logger.info("tool_execution_completed", logCtx, logPayload);
  } else {
    logger.error("tool_execution_failed", logCtx, logPayload);
  }
}

/**
 * Execute with timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${errorMessage} (timeout: ${timeoutMs}ms)`)), timeoutMs)
    ),
  ]);
}

/**
 * Retry logic for transient failures
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  retryDelayMs: number = 100
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Don't retry on non-transient errors
      const errorMessage = lastError.message.toLowerCase();
      if (
        errorMessage.includes("invalid") ||
        errorMessage.includes("not found") ||
        errorMessage.includes("unauthorized") ||
        errorMessage.includes("forbidden") ||
        errorMessage.includes("insufficient") ||
        errorMessage.includes("limit exceeded")
      ) {
        throw lastError;
      }
      
      // Last attempt, throw the error
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs * (attempt + 1)));
    }
  }
  
  throw lastError || new Error("Retry failed");
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
    const {
      toolId,
      executeTool,
      rateLimitKey,
      rateLimitWindow,
      timeoutMs = 30_000, // 30s default
      enableRetry = false,
      maxRetries = 1,
    } = options;
    
    const requestId = crypto.randomUUID();
    const startTime = Date.now();
    let metrics: ExecutionMetrics | null = null;
    let userId: string | null = null;

    // Rate limiting
    const rateLimitResult = rateLimit(req, {
      keyPrefix: rateLimitKey || `tool-${toolId}`,
      limit: 10,
      windowMs: rateLimitWindow || 60_000,
    });
    if (rateLimitResult) {
      logger.warn("rate_limit_exceeded", { requestId, route: `/api/tools/${toolId}` }, {
        toolId,
        ip: req.headers.get("x-forwarded-for") || "unknown",
      });
      return rateLimitResult;
    }

    try {
      // Check if tool exists
      const tool = getToolDefinition(toolId);
      if (!tool) {
        logger.error("tool_not_found", { requestId, route: `/api/tools/${toolId}` }, { toolId });
        return applySecurityHeaders(NextResponse.json(
          { error: "Tool not found", code: "TOOL_NOT_FOUND", requestId },
          { status: 404 }
        ));
      }

      // Client-side only tools don't need server execution
      if (isClientSideOnly(toolId)) {
        logger.warn("client_side_only_tool", { requestId, route: `/api/tools/${toolId}` }, { toolId });
        return applySecurityHeaders(NextResponse.json(
          {
            error: "This tool runs client-side only",
            code: "CLIENT_SIDE_ONLY",
            message: "No server execution needed for this tool",
            requestId,
          },
          { status: 400 }
        ));
      }

      // Check auth requirements
      const authCheck = await requireAuthForServerTools(toolId);
      if (authCheck instanceof NextResponse) {
        logger.warn("auth_required", { requestId, route: `/api/tools/${toolId}` }, { toolId });
        return authCheck; // Error response
      }

      userId = authCheck.userId!;
      metrics = createMetrics(requestId, toolId, userId);
      
      const body = await req.json().catch(() => null);
      
      // Check cache for read-only operations
      const cacheKey = generateCacheKey(toolId, body);
      const cachedResult = getCached(cacheKey);
      if (cachedResult) {
        logger.info("cache_hit", { requestId, route: `/api/tools/${toolId}` }, {
          toolId,
          userId,
          cacheKey,
        });
        
        return applySecurityHeaders(NextResponse.json({
          success: true,
          runId: crypto.randomUUID(),
          requestId,
          result: cachedResult,
          credits: {
            estimated: 0,
            charged: 0,
            balance: await getCreditBalance(userId),
          },
          executionTime: Date.now() - startTime,
          cached: true,
        }));
      }
      
      recordPhase(metrics, "credit_check");
      if (!body || typeof body !== "object") {
        if (metrics) {
          metrics.errorType = "validation";
          metrics.errorCode = "INVALID_BODY";
          finalizeMetrics(metrics);
          logExecutionMetrics(metrics, false);
        }
        logger.warn("invalid_request_body", { requestId, route: `/api/tools/${toolId}` }, { toolId });
        return applySecurityHeaders(NextResponse.json(
          { error: "Invalid request body", code: "INVALID_BODY", requestId },
          { status: 400 }
        ));
      }

      // Estimate credits before execution
      const estimate = await estimateCredits(toolId, body.requestedLimits);
      if (!estimate) {
        if (metrics) {
          metrics.errorType = "system";
          metrics.errorCode = "ESTIMATE_FAILED";
          finalizeMetrics(metrics);
          logExecutionMetrics(metrics, false);
        }
        logger.error("credit_estimate_failed", { requestId, route: `/api/tools/${toolId}` }, { toolId, userId });
        return applySecurityHeaders(NextResponse.json(
          { error: "Failed to estimate credits", code: "ESTIMATE_FAILED", requestId },
          { status: 500 }
        ));
      }

      if (metrics) {
        metrics.creditEstimate = estimate.typical;
      }

      // Audit log: estimate requested
      logCreditEvent({
        type: "credit_estimate_requested",
        userId,
        toolId,
        credits: estimate.typical,
        metadata: { min: estimate.min, max: estimate.max, explanation: estimate.explanation },
      });

      // Check if user has sufficient credits
      const creditCheck = await hasSufficientCredits(userId, estimate.max);
      if (!creditCheck.sufficient) {
        // Audit log: insufficient credits
        logCreditEvent({
          type: "insufficient_credits",
          userId,
          toolId,
          credits: estimate.max,
          balance: creditCheck.balance,
          metadata: { shortfall: creditCheck.shortfall },
        });

        return applySecurityHeaders(NextResponse.json(
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
        ));
      }

      // Validate spend limits
      const limits = await getUserSpendLimits(userId);
      const spendCheck = await validateSpendLimits(userId, estimate.max, limits);
      if (!spendCheck.allowed) {
        // Audit log: spend limit exceeded
        logCreditEvent({
          type: "spend_limit_exceeded",
          userId,
          toolId,
          credits: estimate.max,
          metadata: { reason: spendCheck.reason, limits },
        });

        return applySecurityHeaders(NextResponse.json(
          {
            error: "Spend limit exceeded",
            code: "SPEND_LIMIT_EXCEEDED",
            reason: spendCheck.reason,
            action: spendCheck.action,
          },
          { status: 429 }
        ));
      }

      // Audit log: tool execution allowed
      logCreditEvent({
        type: "tool_execution_allowed",
        userId,
        toolId,
        credits: estimate.typical,
        metadata: { estimatedMax: estimate.max },
      });

      // Execute tool with timeout and optional retry
      recordPhase(metrics!, "execution");
      let platformError = false;
      let actualUsage = { cpuMs: 0, memMb: 0, durationMs: 0 };
      let result: unknown = null;

      // userId is guaranteed to be non-null at this point due to auth check
      if (!userId) {
        throw new Error("User ID is required but was not found");
      }

      try {
        // Use circuit breaker for tool execution
        const circuitBreaker = getCircuitBreaker(`tool:${toolId}`, {
          failureThreshold: 5,
          timeoutMs: 60000, // 1 minute before attempting half-open
        });

        const executionFn = () => circuitBreaker.execute(() =>
          withTimeout(
            executeTool(userId!, body),
            timeoutMs,
            `Tool execution exceeded timeout`
          )
        );

        let executionResult;
        try {
          executionResult = enableRetry
            ? await withRetry(executionFn, maxRetries)
            : await executionFn();
        } catch (circuitError: any) {
          // Handle circuit breaker errors
          if (circuitError.name === "CircuitBreakerOpenError") {
            if (metrics) {
              metrics.errorType = "system";
              metrics.errorCode = "CIRCUIT_BREAKER_OPEN";
              finalizeMetrics(metrics);
              logExecutionMetrics(metrics, false);
            }
            logger.warn("circuit_breaker_open", { requestId, route: `/api/tools/${toolId}` }, {
              toolId,
              userId,
            });
            return applySecurityHeaders(NextResponse.json(
              {
                error: "Service temporarily unavailable",
                code: "CIRCUIT_BREAKER_OPEN",
                message: circuitError.message,
                requestId,
                retryAfter: Math.ceil(circuitBreaker.getRetryAfter() / 1000),
              },
              {
                status: 503,
                headers: {
                  "Retry-After": String(Math.ceil(circuitBreaker.getRetryAfter() / 1000)),
                },
              }
            ));
          }
          throw circuitError;
        }

        result = executionResult.result;
        actualUsage = executionResult.actualUsage;
        platformError = executionResult.platformError || false;
      } catch (execError) {
        platformError = true; // Platform error = refund
        
        const errorMessage = execError instanceof Error ? execError.message : "Unknown error";
        const isTimeout = errorMessage.includes("timeout");
        
        if (metrics) {
          metrics.errorType = isTimeout ? "timeout" : "execution";
          metrics.errorCode = isTimeout ? "EXECUTION_TIMEOUT" : "EXECUTION_FAILED";
          finalizeMetrics(metrics);
          
          // Record failed metric
          recordToolMetric({
            toolId,
            userId,
            requestId,
            success: false,
            durationMs: metrics.durationMs || Date.now() - startTime,
            phaseDurations: metrics.phaseDurations,
            creditEstimate: estimate.typical,
            creditCharged: 0,
            errorType: metrics.errorType,
            errorCode: metrics.errorCode,
            timeout: isTimeout,
          });
        }
        
        // Audit log: tool execution failed
        logCreditEvent({
          type: "tool_execution_failed",
          userId,
          toolId,
          metadata: {
            error: errorMessage,
            timeout: isTimeout,
            requestId,
          },
        });
        
        logger.error("tool_execution_error", { requestId, route: `/api/tools/${toolId}` }, {
          toolId,
          userId,
          error: errorMessage,
          isTimeout,
        });
        
        throw execError;
      }

      // Calculate authoritative charge
      recordPhase(metrics!, "charging");
      const chargeResult = computeAuthoritativeCharge(toolId, actualUsage, platformError);
      const runId = crypto.randomUUID();

      if (metrics) {
        metrics.creditCharged = chargeResult.charge;
      }

      // Charge or refund credits
      if (chargeResult.refunded) {
        if (metrics) {
          metrics.errorType = "platform";
          metrics.errorCode = "PLATFORM_ERROR";
          finalizeMetrics(metrics);
          logExecutionMetrics(metrics, false);
        }
        logger.error("platform_error_refund", { requestId, route: `/api/tools/${toolId}` }, {
          toolId,
          userId,
          reason: chargeResult.reason,
        });
        return applySecurityHeaders(NextResponse.json(
          {
            error: "Platform error",
            code: "PLATFORM_ERROR",
            message: chargeResult.reason,
            refunded: true,
            requestId,
          },
          { status: 500 }
        ));
      }

      if (chargeResult.charge > 0) {
        try {
          await consumeCredits(userId, chargeResult.charge, toolId, runId, {
            estimated: estimate.typical,
            actual: chargeResult.charge,
            usage: actualUsage,
            requestId,
          });
        } catch (creditError) {
          // If credit consumption fails, this is a platform error - refund
          if (metrics) {
            metrics.errorType = "system";
            metrics.errorCode = "CREDIT_PROCESSING_ERROR";
            finalizeMetrics(metrics);
            logExecutionMetrics(metrics, false);
          }
          logCreditEvent({
            type: "tool_execution_failed",
            userId,
            toolId,
            runId,
            metadata: {
              error: "Credit processing failed",
              requestId,
            },
          });
          logger.error("credit_processing_failed", { requestId, route: `/api/tools/${toolId}` }, {
            toolId,
            userId,
            runId,
            error: creditError instanceof Error ? creditError.message : "Unknown error",
          });
          return applySecurityHeaders(NextResponse.json(
            {
              error: "Credit processing failed",
              code: "CREDIT_PROCESSING_ERROR",
              message: "Your credits were not charged. Please try again.",
              requestId,
            },
            { status: 500 }
          ));
        }
      }

      // Get updated balance
      const balance = await getCreditBalance(userId);

      // Audit log: tool execution completed
      logCreditEvent({
        type: "tool_execution_completed",
        userId,
        toolId,
        runId,
        credits: chargeResult.charge,
        balance,
        metadata: {
          usage: actualUsage,
          estimated: estimate.typical,
          requestId,
          durationMs: Date.now() - startTime,
        },
      });

      // Finalize metrics and log
      recordPhase(metrics!, "complete");
      finalizeMetrics(metrics!);
      logExecutionMetrics(metrics!, true);

      // Record performance metric
      recordToolMetric({
        toolId,
        userId,
        requestId,
        success: true,
        durationMs: metrics!.durationMs!,
        phaseDurations: metrics!.phaseDurations,
        creditEstimate: estimate.typical,
        creditCharged: chargeResult.charge,
      });

      // Cache result if appropriate (for read-only tools)
      if (shouldCache(toolId, result)) {
        setCached(cacheKey, result, 5 * 60 * 1000); // 5 minute TTL
        logger.debug("cache_set", { requestId, route: `/api/tools/${toolId}` }, {
          toolId,
          cacheKey,
        });
      }

      // Return result with security headers
      return applySecurityHeaders(NextResponse.json({
        success: true,
        runId,
        requestId,
        result,
        credits: {
          estimated: estimate.typical,
          charged: chargeResult.charge,
          balance,
        },
        executionTime: Date.now() - startTime,
        metrics: {
          phaseDurations: metrics!.phaseDurations,
          totalDuration: metrics!.durationMs,
        },
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      const errorCode = error instanceof Error && (error as any).code ? (error as any).code : "INTERNAL_ERROR";
      
      if (metrics) {
        metrics.errorType = "unhandled";
        metrics.errorCode = errorCode;
        finalizeMetrics(metrics);
        logExecutionMetrics(metrics, false);
      }
      
      logger.error("tool_execution_unhandled_error", { requestId, route: `/api/tools/${toolId}` }, {
        toolId,
        userId: userId || "unknown",
        error: errorMessage,
        errorCode,
      });
      
      return applySecurityHeaders(NextResponse.json(
        {
          error: "Internal server error",
          code: errorCode,
          message: errorMessage,
          requestId,
        },
        { status: error instanceof Error && (error as any).status ? (error as any).status : 500 }
      ));
    }
  };
}
