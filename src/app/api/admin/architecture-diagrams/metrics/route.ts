import { NextResponse } from "next/server";
import { withRequestLogging } from "@/lib/security/requestLog";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { getArchitectureMetrics } from "@/lib/architecture-diagrams/telemetry/store";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/admin/architecture-diagrams/metrics" }, async () => {
    const auth = await requireAdminJson();
    if (!auth.ok) return auth.response;

    const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
    const limited = rateLimit(req, { keyPrefix: "admin-arch-metrics", limit: 60, windowMs: 60_000, keySuffix });
    if (limited) return limited;

    return NextResponse.json(getArchitectureMetrics());
  });
}


