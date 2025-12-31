/**
 * Verify Payment and Get Credits Granted
 * 
 * GET /api/billing/verify-payment?session_id=xxx
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getStripeClient } from "@/lib/stripe";
import { getStripeEnv } from "@/lib/stripe/config";
import { getUserIdFromSession } from "@/lib/studios/auth-gating";

export async function GET(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "billing-verify-payment",
    limit: 20, // 20 verifications per minute
    windowMs: 60_000,
  });
  if (rateLimitResult) return rateLimitResult;

  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json(
        { error: "session_id is required", code: "SESSION_ID_REQUIRED" },
        { status: 400 }
      );
    }

    // Verify user is authenticated
    const userId = await getUserIdFromSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required", code: "AUTH_REQUIRED" },
        { status: 401 }
      );
    }

    const stripeEnv = getStripeEnv();
    if (!stripeEnv) {
      // In development without Stripe, return mock data
      return NextResponse.json({
        sessionId,
        creditsGranted: 500, // Mock
        verified: true,
      });
    }

    try {
      const stripe = getStripeClient();
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Verify session belongs to current user
      if (session.metadata?.userId !== userId) {
        return NextResponse.json(
          { error: "Session does not belong to current user", code: "UNAUTHORIZED" },
          { status: 403 }
        );
      }

      // Check if this is a credit purchase
      if (session.metadata?.type !== "credit_purchase") {
        return NextResponse.json(
          { error: "Session is not a credit purchase", code: "INVALID_SESSION_TYPE" },
          { status: 400 }
        );
      }

      const creditsGranted = parseInt(session.metadata?.credits || "0", 10);

      return NextResponse.json({
        sessionId,
        creditsGranted,
        verified: true,
        paymentStatus: session.payment_status,
      });
    } catch (stripeError) {
      console.error("Stripe session retrieval failed:", stripeError);
      return NextResponse.json(
        {
          error: "Failed to verify payment session",
          code: "VERIFICATION_FAILED",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
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
