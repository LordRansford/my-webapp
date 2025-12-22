import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { handleAppRoute, jsonOk } from "@/server/http";
import { submitFeedback } from "@/services/feedbackService";

export async function POST(req: Request) {
  return handleAppRoute(req, { route: "POST /api/feedback" }, async ({ requestId }) => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "feedback-submit", limit: 5, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as any;
    const result = await submitFeedback(body);
    return jsonOk(result, { status: 200, requestId });
  });
}


