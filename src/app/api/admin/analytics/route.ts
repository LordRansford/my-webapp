import { NextResponse } from "next/server";
import { aggregateInternalToolEvents, windowToSinceMs, type TimeWindow } from "@/lib/analytics/aggregate";
import { getInternalToolEventsSince } from "@/lib/analytics/internalStore";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { withRequestLogging } from "@/lib/security/requestLog";

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
    const blocked = requireAdmin(req);
    if (blocked) return blocked;

    const window = parseWindow(req);
    const sinceMs = windowToSinceMs(window);
    const events = getInternalToolEventsSince(sinceMs);
    const agg = aggregateInternalToolEvents(events, window, sinceMs);

    return NextResponse.json(agg, { status: 200 });
  });
}


