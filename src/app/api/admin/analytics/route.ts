import { NextResponse } from "next/server";
import { aggregateInternalToolEvents, windowToSinceMs, type TimeWindow } from "@/lib/analytics/aggregate";
import { getInternalToolEventsSince } from "@/lib/analytics/internalStore";
import { withRequestLogging } from "@/lib/security/requestLog";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { logAdminAction } from "@/lib/admin/audit";

function parseWindow(req: Request): TimeWindow {
  try {
    const url = new URL(req.url);
    const w = (url.searchParams.get("window") || "").toLowerCase();
    if (w === "hour" || w === "day" || w === "7d") return w;
  } catch {
    // ignore
  }
  return "7d";
}

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/admin/analytics" }, async () => {
    const auth = await requireAdminJson("VIEW_SYSTEM");
    if (!auth.ok) return auth.response;
    const user = auth.session?.user;
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
    const limited = rateLimit(req, { keyPrefix: "admin-analytics", limit: 20, windowMs: 60_000, keySuffix });
    if (limited) return limited;

    const window = parseWindow(req);
    const sinceMs = windowToSinceMs(window);
    const events = getInternalToolEventsSince(sinceMs);
    const agg = aggregateInternalToolEvents(events, window, sinceMs);

    await logAdminAction({
      adminUser: { id: user.id, email: user.email || null },
      adminRole: auth.role,
      actionType: "VIEW_INTERNAL_ANALYTICS",
      target: { targetType: "analytics", targetId: window },
      reason: "Admin analytics view",
      req,
    });

    return NextResponse.json(agg, { status: 200 });
  });
}


