import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { handleAppRoute, jsonOk } from "@/server/http";
import { type InternalToolEventPayload, isInternalToolEvent } from "@/lib/analytics/internalEvents";
import { appendInternalToolEvent } from "@/lib/analytics/internalStore";

// Internal observability only. No persistence yet.
// Events are validated and logged in a structured way for future aggregation.

export async function POST(req: Request) {
  return handleAppRoute(req, { route: "POST /api/analytics" }, async ({ requestId }) => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "analytics", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as InternalToolEventPayload | null;
    const event = body?.event;

    if (!body || body.v !== 1 || !event || !isInternalToolEvent(event)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Avoid logging any unexpected large fields.
    const safe = {
      type: event.type,
      toolId: String(event.toolId).slice(0, 80),
      timestamp: String(event.timestamp).slice(0, 40),
      sessionId: String(event.sessionId).slice(0, 80),
      durationMs: typeof event.durationMs === "number" ? Math.round(event.durationMs) : undefined,
      success: typeof event.success === "boolean" ? event.success : undefined,
    };

    // Structured log for later ingestion. Includes requestId for correlation only.
    console.info("internal_analytics_event", { requestId, ...safe });
    appendInternalToolEvent(event);

    return jsonOk({ success: true }, { status: 200, requestId });
  });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}


