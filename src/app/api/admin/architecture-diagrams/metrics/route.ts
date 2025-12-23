import { NextResponse } from "next/server";
import { withRequestLogging } from "@/lib/security/requestLog";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { getArchitectureMetrics } from "@/lib/architecture-diagrams/telemetry/store";
import { logAdminAction } from "@/lib/admin/audit";

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/admin/architecture-diagrams/metrics" }, async () => {
    const auth = await requireAdminJson("VIEW_SYSTEM");
    if (!auth.ok) return auth.response;
    const user = auth.session?.user;
    if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
    const limited = rateLimit(req, { keyPrefix: "admin-arch-metrics", limit: 30, windowMs: 60_000, keySuffix });
    if (limited) return limited;

    await logAdminAction({
      adminUser: { id: user.id, email: user.email || null },
      adminRole: auth.role,
      actionType: "VIEW_ARCHITECTURE_DIAGRAMS_METRICS",
      target: { targetType: "architecture-diagrams", targetId: null },
      reason: "Admin metrics view",
      req,
    });

    return NextResponse.json(getArchitectureMetrics());
  });
}


