import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { addFeedback, hasFeedbackForSession } from "@/lib/feedback/store";

const HEARD_OPTIONS = ["Family", "Friend", "Work colleague", "Other"] as const;

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/feedback" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "feedback-submit", limit: 5, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as any;
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
    const heardFrom = typeof body?.heardFrom === "string" ? body.heardFrom : "";
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const rateClarity = Number.isFinite(body?.rateClarity) ? Number(body.rateClarity) : undefined;
    const rateUsefulness = Number.isFinite(body?.rateUsefulness) ? Number(body.rateUsefulness) : undefined;
    const url = typeof body?.url === "string" ? body.url.trim().slice(0, 400) : "";
    const sessionId = typeof body?.sessionId === "string" ? body.sessionId.slice(0, 64) : "";

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "precheck",
        hypothesisId: "h1",
        location: "api/feedback/route.ts:entry",
        message: "feedback received",
        data: { sessionIdPresent: !!sessionId, heardFrom, messageLength: message.length, rateClarity, rateUsefulness },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    if (!HEARD_OPTIONS.includes(heardFrom as any)) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "precheck",
          hypothesisId: "h2",
          location: "api/feedback/route.ts:invalid_source",
          message: "invalid heardFrom",
          data: { heardFrom },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return NextResponse.json({ message: "Invalid source" }, { status: 400 });
    }
    if (!sessionId) {
      return NextResponse.json({ message: "Session missing" }, { status: 400 });
    }
    if (hasFeedbackForSession(sessionId)) {
      // #region agent log
      fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: "debug-session",
          runId: "precheck",
          hypothesisId: "h3",
          location: "api/feedback/route.ts:duplicate",
          message: "duplicate session",
          data: { sessionId },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return NextResponse.json({ message: "Feedback already submitted in this session." }, { status: 409 });
    }
    if (!message || message.length < 4 || message.length > 1500) {
      return NextResponse.json({ message: "Feedback must be between 4 and 1500 characters." }, { status: 400 });
    }
    if (rateClarity !== undefined && (rateClarity < 1 || rateClarity > 5)) {
      return NextResponse.json({ message: "Invalid clarity rating." }, { status: 400 });
    }
    if (rateUsefulness !== undefined && (rateUsefulness < 1 || rateUsefulness > 5)) {
      return NextResponse.json({ message: "Invalid usefulness rating." }, { status: 400 });
    }

    addFeedback({
      sessionId,
      name: name || undefined,
      heardFrom: heardFrom as any,
      message,
      rateClarity,
      rateUsefulness,
      url: url || "/feedback",
    });

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/912cc721-944f-4c31-a38a-92b015cfe804", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "precheck",
        hypothesisId: "h4",
        location: "api/feedback/route.ts:success",
        message: "feedback stored",
        data: { messageLength: message.length, rateClarity, rateUsefulness },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return NextResponse.json({ ok: true });
  });
}


