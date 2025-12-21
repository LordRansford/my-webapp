import { NextResponse } from "next/server";
import { getSafePlanSummaryForRequest } from "@/lib/billing/access";

export async function GET() {
  const summary = await getSafePlanSummaryForRequest();
  return NextResponse.json(summary);
}


