/**
 * Credit Settings API
 * 
 * GET: Retrieve user's credit settings
 * PUT: Update user's credit settings
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getUserIdFromSession } from "@/lib/studios/auth-gating";
import { getUserPlan } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";
import { getUserCredits, updateUserPlanLimits } from "@/lib/billing/creditStore";
import { getCreditSettings, updateCreditSettings } from "@/lib/billing/creditSettings";

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "account-settings-credits",
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

    // Get user plan and limits
    const plan = await getUserPlan(userId);
    const planLimits = PLANS[plan].limits;

    // Get user's custom settings (from creditStore)
    const userCredits = getUserCredits(userId);
    const customLimits = userCredits
      ? {
          maxDailyCredits: userCredits.dailyCap !== planLimits.dailyCreditCap ? userCredits.dailyCap : null,
          maxMonthlyCredits:
            userCredits.monthlyAllocation !== planLimits.monthlyCredits
              ? userCredits.monthlyAllocation
              : null,
        }
      : { maxDailyCredits: null, maxMonthlyCredits: null };

    // Retrieve alert thresholds and notification preferences
    const creditSettings = getCreditSettings(userId);
    const controls = {
      maxDailyCredits: customLimits.maxDailyCredits,
      maxMonthlyCredits: customLimits.maxMonthlyCredits,
      perRunMaxCredits: null, // Not implemented yet
      alertThresholds: creditSettings.alertThresholds,
      notifications: creditSettings.notifications,
    };

    return NextResponse.json({
      controls,
      planLimits: {
        maxDailyCredits: planLimits.dailyCreditCap,
        maxMonthlyCredits: planLimits.monthlyCredits,
      },
    });
  } catch (error) {
    console.error("Credit settings API error:", error);
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

export async function PUT(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "account-settings-credits-update",
    limit: 10, // 10 updates per minute
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

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || !body.controls) {
      return NextResponse.json(
        { error: "Invalid request body", code: "INVALID_BODY" },
        { status: 400 }
      );
    }

    const { controls } = body;

    // Validate limits
    const plan = await getUserPlan(userId);
    const planLimits = PLANS[plan].limits;

    if (controls.maxDailyCredits !== null && controls.maxDailyCredits !== undefined) {
      if (controls.maxDailyCredits < 0) {
        return NextResponse.json(
          { error: "Daily limit must be non-negative", code: "INVALID_LIMIT" },
          { status: 400 }
        );
      }
      if (controls.maxDailyCredits > planLimits.dailyCreditCap * 2) {
        return NextResponse.json(
          { error: "Daily limit cannot exceed 2x your plan limit", code: "LIMIT_TOO_HIGH" },
          { status: 400 }
        );
      }
    }

    if (controls.maxMonthlyCredits !== null && controls.maxMonthlyCredits !== undefined) {
      if (controls.maxMonthlyCredits < 0) {
        return NextResponse.json(
          { error: "Monthly limit must be non-negative", code: "INVALID_LIMIT" },
          { status: 400 }
        );
      }
      if (controls.maxMonthlyCredits > planLimits.monthlyCredits * 2) {
        return NextResponse.json(
          { error: "Monthly limit cannot exceed 2x your plan limit", code: "LIMIT_TOO_HIGH" },
          { status: 400 }
        );
      }
    }

    // Update user limits
    const dailyCap = controls.maxDailyCredits ?? planLimits.dailyCreditCap;
    const monthlyAllocation = controls.maxMonthlyCredits ?? planLimits.monthlyCredits;

    updateUserPlanLimits(userId, monthlyAllocation, dailyCap);

    // Save alert thresholds and notification preferences
    if (controls.alertThresholds || controls.notifications) {
      updateCreditSettings(userId, {
        ...(controls.alertThresholds && { alertThresholds: controls.alertThresholds }),
        ...(controls.notifications && { notifications: controls.notifications }),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Settings saved successfully",
    });
  } catch (error) {
    console.error("Credit settings update error:", error);
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
