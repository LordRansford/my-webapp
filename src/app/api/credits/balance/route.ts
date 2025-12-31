/**
 * Credit Balance API
 * 
 * Returns current credit balance and usage statistics for authenticated users.
 */

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getCreditBalance, getDailyCreditsConsumed, getMonthlyCreditsConsumed } from "@/lib/billing/creditStore";
import { getUserSpendLimits } from "@/lib/billing/credits";
import { getUserPlan } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";
import { rateLimit } from "@/lib/security/rateLimit";

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "credits-balance",
    limit: 30,
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      {
        error: "Authentication required",
        code: "AUTH_REQUIRED",
        action: "Sign in to view your credit balance",
        signInUrl: "/api/auth/signin",
      },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    const [balance, dailyUsed, monthlyUsed, plan] = await Promise.all([
      getCreditBalance(userId),
      getDailyCreditsConsumed(userId),
      getMonthlyCreditsConsumed(userId),
      getUserPlan(userId),
    ]);

    const limits = await getUserSpendLimits(userId);
    const planLimits = PLANS[plan].limits;

    return NextResponse.json({
      balance,
      usage: {
        daily: {
          used: dailyUsed,
          cap: limits.dailyCap,
          remaining: Math.max(0, limits.dailyCap - dailyUsed),
          percentage: Math.round((dailyUsed / limits.dailyCap) * 100),
        },
        monthly: {
          used: monthlyUsed,
          cap: limits.monthlyCap,
          remaining: Math.max(0, limits.monthlyCap - monthlyUsed),
          percentage: Math.round((monthlyUsed / limits.monthlyCap) * 100),
        },
      },
      plan: {
        key: plan,
        label: PLANS[plan].label,
        monthlyCredits: planLimits.monthlyCredits,
        dailyCap: planLimits.dailyCreditCap,
      },
      alerts: {
        daily: dailyUsed >= limits.dailyCap * 0.8,
        monthly: monthlyUsed >= limits.monthlyCap * 0.8,
      },
    });
  } catch (error) {
    console.error("Credit balance error:", error);
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
