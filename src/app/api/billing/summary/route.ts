import { NextResponse } from "next/server";
import { getSafePlanSummaryForRequest } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";

export async function GET() {
  try {
    const summary = await getSafePlanSummaryForRequest();
    return NextResponse.json(summary);
  } catch (err) {
    // If auth/billing resolution breaks (e.g. misconfigured NextAuth), never crash the app.
    console.warn("[billing/summary] Falling back to free plan summary", err);
    return NextResponse.json(
      { plan: "free", features: [], limits: PLANS.free.limits },
      { status: 200 },
    );
  }
}


