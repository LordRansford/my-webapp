import { NextResponse } from "next/server";
import { getOwnerAnalyticsSummary } from "@/lib/analytics/store";
import { withRequestLogging } from "@/lib/security/requestLog";

function isAllowed(req: Request) {
  const expected = process.env.ADMIN_ANALYTICS_KEY || "";
  if (!expected) return false;
  const provided = req.headers.get("x-admin-analytics-key") || "";
  return provided && expected && provided === expected;
}

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/admin/analytics" }, async () => {
    if (!isAllowed(req)) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    return NextResponse.json(getOwnerAnalyticsSummary(), { status: 200 });
  });
}


