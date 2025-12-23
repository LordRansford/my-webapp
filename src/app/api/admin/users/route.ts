import { NextResponse } from "next/server";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { listUsersAdminSafe, type UserSortKey } from "@/lib/admin/usersStore";
import { logAdminAction } from "@/lib/admin/audit";

function parseSortKey(v: string | null): UserSortKey {
  if (v === "created" || v === "lastActive" || v === "role") return v;
  return "created";
}

function parseDir(v: string | null) {
  return v === "asc" ? "asc" : "desc";
}

export async function GET(req: Request) {
  const auth = await requireAdminJson("VIEW_USERS");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = user.email || user.id;
  const limited = rateLimit(req, { keyPrefix: "admin-users-list", limit: 30, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const url = new URL(req.url);
  const search = (url.searchParams.get("search") || "").trim();
  const cursor = url.searchParams.get("cursor");
  const takeRaw = Number(url.searchParams.get("take") || "20");
  const take = Number.isFinite(takeRaw) ? Math.max(5, Math.min(50, takeRaw)) : 20;
  const sortKey = parseSortKey(url.searchParams.get("sort"));
  const sortDir = parseDir(url.searchParams.get("dir"));

  const out = await listUsersAdminSafe({ search, cursor, take, sortKey, sortDir });

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "VIEW_USERS_LIST",
    target: { targetType: "user", targetId: null },
    reason: "Admin users list view",
    req,
  });

  return NextResponse.json(out);
}


