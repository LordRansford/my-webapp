/**
 * Credit Engine
 * 
 * Handles credit estimation, authoritative charging, spend limit validation,
 * and refund rules.
 */

import { getToolDefinition, type ToolDefinition } from "@/lib/tools/registry";
import { getUserPlan } from "@/lib/billing/access";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export interface CreditEstimate {
  min: number;
  typical: number;
  max: number;
  explanation: string;
}

export interface ActualUsage {
  cpuMs: number;
  memMb: number;
  durationMs: number;
}

export interface SpendLimits {
  dailyCap: number;
  monthlyCap: number;
  perRunMax?: number; // User override within tool cap
}

/**
 * Estimate credits for a tool run
 * 
 * Returns min, typical, and max credit estimates based on tool limits
 * and requested parameters.
 */
export async function estimateCredits(
  toolId: string,
  requestedLimits?: Partial<{
    cpuMs: number;
    memMb: number;
    durationMs: number;
  }>,
  userTier?: "free" | "supporter" | "pro"
): Promise<CreditEstimate | null> {
  const tool = getToolDefinition(toolId);
  if (!tool) return null;

  // Client-side only tools cost 0 credits
  if (tool.executionMode === "client_only") {
    return {
      min: 0,
      typical: 0,
      max: 0,
      explanation: "Client-side tool: no credits required",
    };
  }

  const { pricing, limits } = tool;
  const { baseCreditsPerRun, cpuMsPerCredit, memMbMsPerCredit, minCreditsPerRun, maxCreditsPerRun } = pricing;

  // Use requested limits or tool defaults
  const cpuMs = requestedLimits?.cpuMs ?? limits.cpuMsMax;
  const memMb = requestedLimits?.memMb ?? limits.memMbMax;
  const durationMs = requestedLimits?.durationMs ?? Math.max(cpuMs, limits.timeoutMs);

  // Calculate compute costs
  const cpuCredits = Math.ceil(cpuMs / cpuMsPerCredit);
  const memCredits = Math.ceil((memMb * durationMs) / memMbMsPerCredit);

  // Base + compute
  const rawTotal = baseCreditsPerRun + cpuCredits + memCredits;

  // Apply min/max caps
  const min = Math.max(minCreditsPerRun, baseCreditsPerRun); // At least base fee
  const typical = Math.max(minCreditsPerRun, Math.min(maxCreditsPerRun, Math.ceil(rawTotal * 0.7))); // 70% of max
  const max = Math.min(maxCreditsPerRun, Math.max(minCreditsPerRun, rawTotal));

  // Build explanation
  const parts: string[] = [];
  if (baseCreditsPerRun > 0) {
    parts.push(`${baseCreditsPerRun} base fee`);
  }
  if (cpuCredits > 0) {
    parts.push(`${cpuCredits} for CPU time (${Math.round(cpuMs / 1000)}s)`);
  }
  if (memCredits > 0) {
    parts.push(`${memCredits} for memory (${memMb}MB × ${Math.round(durationMs / 1000)}s)`);
  }
  const explanation = parts.length > 0
    ? `Estimated: ${parts.join(" + ")} = ${typical} credits (range: ${min}-${max})`
    : "No credits required";

  return {
    min,
    typical,
    max,
    explanation,
  };
}

/**
 * Compute authoritative charge based on actual usage
 * 
 * This is called after tool execution to calculate the final charge.
 * Enforces min/max caps and applies refund rules if needed.
 */
export function computeAuthoritativeCharge(
  toolId: string,
  actualUsage: ActualUsage,
  platformError?: boolean // true if platform fault before execution
): { charge: number; refunded: boolean; reason?: string } {
  const tool = getToolDefinition(toolId);
  if (!tool) {
    return { charge: 0, refunded: false, reason: "Tool not found" };
  }

  // Client-side only: no charge
  if (tool.executionMode === "client_only") {
    return { charge: 0, refunded: false };
  }

  // Refund rule: platform error before execution
  if (platformError) {
    return {
      charge: 0,
      refunded: true,
      reason: "Platform error before execution - automatic refund",
    };
  }

  const { pricing } = tool;
  const { baseCreditsPerRun, cpuMsPerCredit, memMbMsPerCredit, minCreditsPerRun, maxCreditsPerRun } = pricing;

  // Calculate compute costs
  const cpuCredits = Math.ceil(actualUsage.cpuMs / cpuMsPerCredit);
  const memCredits = Math.ceil((actualUsage.memMb * actualUsage.durationMs) / memMbMsPerCredit);

  // Base + compute
  const rawTotal = baseCreditsPerRun + cpuCredits + memCredits;

  // Apply min/max caps
  const charge = Math.max(
    minCreditsPerRun,
    Math.min(maxCreditsPerRun, rawTotal)
  );

  return { charge, refunded: false };
}

/**
 * Validate spend limits before execution
 * 
 * Checks daily cap, monthly cap, and per-run cap.
 * Returns validation result with actionable error messages.
 */
export async function validateSpendLimits(
  userId: string,
  estimatedMaxCharge: number,
  limits: SpendLimits
): Promise<{ allowed: boolean; reason?: string; action?: string }> {
  const {
    getDailyCreditsConsumed,
    getMonthlyCreditsConsumed,
  } = await import("@/lib/billing/creditStore");

  const dailyUsed = await getDailyCreditsConsumed(userId);
  const monthlyUsed = await getMonthlyCreditsConsumed(userId);

  // Check daily cap
  if (dailyUsed + estimatedMaxCharge > limits.dailyCap) {
    return {
      allowed: false,
      reason: `Daily credit limit reached (${limits.dailyCap} credits/day, used ${dailyUsed})`,
      action: "Upgrade plan or wait until tomorrow",
    };
  }

  // Check monthly cap
  if (monthlyUsed + estimatedMaxCharge > limits.monthlyCap) {
    return {
      allowed: false,
      reason: `Monthly credit limit reached (${limits.monthlyCap} credits/month, used ${monthlyUsed})`,
      action: "Upgrade plan or purchase top-up credits",
    };
  }

  // Check per-run cap (if set)
  if (limits.perRunMax && estimatedMaxCharge > limits.perRunMax) {
    return {
      allowed: false,
      reason: `Per-run limit exceeded (max ${limits.perRunMax} credits)`,
      action: "Adjust tool parameters or increase per-run limit",
    };
  }

  return { allowed: true };
}

/**
 * Get user's spend limits based on plan
 */
export async function getUserSpendLimits(userId: string): Promise<SpendLimits> {
  const plan = await getUserPlan(userId);
  
  // These match the plan definitions in plans.ts
  const planLimits: Record<string, SpendLimits> = {
    free: {
      dailyCap: 30,
      monthlyCap: 300,
    },
    supporter: {
      dailyCap: 300,
      monthlyCap: 3000,
    },
    pro: {
      dailyCap: 2000,
      monthlyCap: 12000,
    },
  };

  return planLimits[plan] || planLimits.free;
}

/**
 * Get current credit balance for user
 */
export async function getCreditBalance(userId: string): Promise<number> {
  const { getCreditBalance: getBalance } = await import("@/lib/billing/creditStore");
  return getBalance(userId);
}

/**
 * Check if user has sufficient credits for estimated charge
 */
export async function hasSufficientCredits(
  userId: string,
  estimatedMaxCharge: number
): Promise<{ sufficient: boolean; balance: number; shortfall?: number }> {
  const balance = await getCreditBalance(userId);
  const sufficient = balance >= estimatedMaxCharge;
  
  return {
    sufficient,
    balance,
    shortfall: sufficient ? undefined : estimatedMaxCharge - balance,
  };
}
