import { NextResponse } from "next/server";
import { analyzeFeedback } from "@/lib/feedback/summary";

export async function GET() {
  const enabled = process.env.FEEDBACK_SUMMARY_ENABLED === "true";
  if (!enabled) return NextResponse.json({ message: "Not available" }, { status: 404 });

  const summary = analyzeFeedback();
  return NextResponse.json(summary);
}


