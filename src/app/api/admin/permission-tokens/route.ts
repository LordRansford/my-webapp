import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { deletePermissionToken, listPermissionTokens, savePermissionToken } from "@/lib/templates/store";

const ADMIN_KEY = process.env.ADMIN_DASHBOARD_TOKEN;

async function isAuthorised() {
  if (!ADMIN_KEY) return false;
  const token = (await cookies()).get?.("admin_token")?.value;
  return token === ADMIN_KEY;
}

export async function POST(request: Request) {
  if (!(await isAuthorised())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const body = (await request.json().catch(() => ({}))) as any;
  const tokenId = body.tokenId || crypto.randomUUID();
  savePermissionToken({
    tokenId,
    userId: body.userId || null,
    anonymousUserId: body.anonymousUserId || null,
    templateId: body.templateId || null,
    scope: "commercial_remove_signature",
    issuedAt: new Date().toISOString(),
    expiresAt: body.expiresAt || null,
    issuedBy: "Ransford",
    notes: body.notes || null,
  });
  return NextResponse.json({ tokenId });
}

export async function DELETE(request: Request) {
  if (!(await isAuthorised())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { searchParams } = new URL(request.url);
  const tokenId = searchParams.get("tokenId");
  if (!tokenId) return NextResponse.json({ message: "tokenId required" }, { status: 400 });
  deletePermissionToken(tokenId);
  return NextResponse.json({ removed: tokenId });
}

export async function GET() {
  if (!(await isAuthorised())) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const tokens = listPermissionTokens(200);
  return NextResponse.json({ tokens });
}
