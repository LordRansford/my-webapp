import { NextResponse } from "next/server";
import { getSafePlanSummaryForRequest } from "@/lib/billing/access";
import { PLANS } from "@/lib/billing/plans";
import { logWarn } from "@/lib/telemetry/log";

export async function GET() {
  try {
    const summary = await getSafePlanSummaryForRequest();
    return NextResponse.json(summary);
  } catch (err) {
    // If auth/billing resolution breaks (e.g. misconfigured NextAuth), never crash the app.
    logWarn("billing.summary_fallback", { message: String((err as any)?.message || "fallback").slice(0, 160) });
    return NextResponse.json(
      { plan: "free", features: [], limits: PLANS.free.limits },
      { status: 200 },
    );
  }
}


