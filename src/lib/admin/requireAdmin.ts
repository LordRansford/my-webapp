import { NextResponse } from "next/server";

// Deny by default. This guard is intentionally simple for now.
// Later phases will replace it with real authentication and RBAC.

export function requireAdmin(req: Request) {
  const enabled = process.env.ADMIN_ANALYTICS_ENABLED === "true";
  if (!enabled) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const expectedKey = process.env.ADMIN_ANALYTICS_KEY || "";
  if (!expectedKey) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const provided = req.headers.get("x-admin-analytics-key") || "";
  if (provided !== expectedKey) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  return null;
}


