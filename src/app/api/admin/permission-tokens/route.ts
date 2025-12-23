import { NextResponse } from "next/server";
import crypto from "crypto";
import { deletePermissionToken, listPermissionTokens, savePermissionToken } from "@/lib/templates/store";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { logAdminAction } from "@/lib/admin/audit";

export async function POST(request: Request) {
  const originBlock = requireSameOrigin(request);
  if (originBlock) return originBlock;
  const auth = await requireAdminJson("MANAGE_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
  const limited = rateLimit(request, { keyPrefix: "admin-permission-tokens", limit: 15, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const body = (await request.json().catch(() => ({}))) as any;
  const reason = String(body.reason || "").trim();
  if (!reason) return NextResponse.json({ message: "reason required" }, { status: 400 });

  const tokenId = body.tokenId || crypto.randomUUID();
  savePermissionToken({
    tokenId,
    userId: body.userId || null,
    anonymousUserId: body.anonymousUserId || null,
    templateId: body.templateId || null,
    scope: "commercial_remove_signature",
    issuedAt: new Date().toISOString(),
    expiresAt: body.expiresAt || null,
    issuedBy: user.email || user.id,
    notes: body.notes || null,
  });

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_PERMISSION_TOKEN_CREATE",
    target: { targetType: "permission-token", targetId: tokenId },
    reason,
    req: request,
  });
  return NextResponse.json({ tokenId });
}

export async function DELETE(request: Request) {
  const originBlock = requireSameOrigin(request);
  if (originBlock) return originBlock;
  const auth = await requireAdminJson("MANAGE_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
  const limited = rateLimit(request, { keyPrefix: "admin-permission-tokens", limit: 15, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("tokenId");
  if (!tokenId) return NextResponse.json({ message: "tokenId required" }, { status: 400 });
  const reason = (searchParams.get("reason") || "").trim();
  if (!reason) return NextResponse.json({ message: "reason required" }, { status: 400 });
  deletePermissionToken(tokenId);

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "MANAGE_PERMISSION_TOKEN_DELETE",
    target: { targetType: "permission-token", targetId: tokenId },
    reason,
    req: request,
  });
  return NextResponse.json({ removed: tokenId });
}

export async function GET(request: Request) {
  const auth = await requireAdminJson("VIEW_SUPPORT");
  if (!auth.ok) return auth.response;
  const user = auth.session?.user;
  if (!user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = auth.session?.user?.email || auth.session?.user?.id || "";
  const limited = rateLimit(request, { keyPrefix: "admin-permission-tokens", limit: 20, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const tokens = listPermissionTokens(200);

  await logAdminAction({
    adminUser: { id: user.id, email: user.email || null },
    adminRole: auth.role,
    actionType: "VIEW_PERMISSION_TOKENS",
    target: { targetType: "permission-token", targetId: null },
    reason: "Admin support tooling view",
    req: request,
  });
  return NextResponse.json({ tokens });
}
