import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { addToolRun } from "@/lib/billing/store";
import { getUserPlan } from "@/lib/billing/access";
import { estimateCredits, getUserSpendLimits, validateSpendLimits, hasSufficientCredits } from "@/lib/billing/credits";
import { getCreditBalance } from "@/lib/billing/creditStore";

/**
 * Assert that a tool run is allowed based on credit-based limits
 * 
 * This replaces the old tool run counting system with proper credit checks:
 * - Verifies user has sufficient credit balance
 * - Checks daily credit cap limits
 * - Still tracks tool runs for analytics
 */
export async function assertToolRunAllowed(toolId: string) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || null;
  if (!userId) {
    const err = new Error("Sign in required");
    (err as any).status = 401;
    throw err;
  }

  const plan = await getUserPlan(userId);

  // Estimate credits for this tool run
  const estimate = await estimateCredits(toolId);
  if (!estimate) {
    const err = new Error("Failed to estimate credits for tool");
    (err as any).status = 500;
    throw err;
  }

  // Check if user has sufficient credit balance
  const creditCheck = await hasSufficientCredits(userId, estimate.max);
  if (!creditCheck.sufficient) {
    const err = new Error("Insufficient credits");
    (err as any).status = 402;
    (err as any).code = "INSUFFICIENT_CREDITS";
    (err as any).balance = creditCheck.balance;
    (err as any).required = estimate.max;
    (err as any).shortfall = creditCheck.shortfall;
    throw err;
  }

  // Get user's spend limits (daily/monthly caps)
  const limits = await getUserSpendLimits(userId);

  // Validate spend limits (checks daily cap)
  const spendCheck = await validateSpendLimits(userId, estimate.max, limits);
  if (!spendCheck.allowed) {
    const err = new Error("Daily credit limit reached");
    (err as any).status = 429;
    (err as any).code = "SPEND_LIMIT_EXCEEDED";
    (err as any).reason = spendCheck.reason;
    (err as any).action = spendCheck.action;
    (err as any).limit = limits.dailyCap;
    throw err;
  }

  // Get current balance and daily usage for return value
  const balance = await getCreditBalance(userId);
  const { getDailyCreditsConsumed } = await import("@/lib/billing/creditStore");
  const dailyUsed = await getDailyCreditsConsumed(userId);
  const remainingDailyCap = Math.max(0, limits.dailyCap - dailyUsed);

  // Track tool run for analytics (not used for limits anymore)
  addToolRun({
    id: crypto.randomUUID(),
    userId: userId || null,
    anonymousUserId: null,
    toolId,
    timestamp: new Date().toISOString(),
  });

  return {
    plan,
    balance,
    estimatedCredits: estimate.typical,
    dailyCap: limits.dailyCap,
    dailyUsed,
    remainingDailyCap,
  };
}


