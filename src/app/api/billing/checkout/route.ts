/**
 * Create Stripe Checkout Session for Credit Purchase
 * 
 * POST /api/billing/checkout
 * Body: { packId: string }
 */

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { createCheckoutSession } from "@/lib/billing/payments";

export async function POST(req: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(req, {
    keyPrefix: "billing-checkout",
    limit: 10, // 10 checkout sessions per minute
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

    const { packId } = body;

    if (!packId || typeof packId !== "string") {
      return NextResponse.json(
        { error: "packId is required", code: "PACK_ID_REQUIRED" },
        { status: 400 }
      );
    }

    const result = await createCheckoutSession(packId);

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error, code: result.code },
        { status: result.code === "AUTH_REQUIRED" ? 401 : 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Checkout session creation error:", error);
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
