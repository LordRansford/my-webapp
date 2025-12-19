import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { evaluateTemplateAccess, RequestedUse, SupportMethod } from "@/lib/templates/permissions";
import { getActivePermissionTokens, saveDownload } from "@/lib/templates/store";
import { qualifyDonation } from "@/lib/donations/qualify";

type Body = {
  templateId?: string;
  requestedUse?: RequestedUse;
  fileVariantId?: string;
  message?: string;
};

const ANON_COOKIE = "rn_anonymous_id";

async function ensureAnonymousId() {
  const jar = await cookies();
  const existing = jar.get?.(ANON_COOKIE)?.value;
  if (existing) return existing;
  const generated = crypto.randomUUID();
  jar.set?.(ANON_COOKIE, generated, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 * 2 });
  return generated;
}

function buildSignedUrl(templateId: string, variant: string) {
  const payload = Buffer.from(JSON.stringify({ templateId, variant, ts: Date.now() })).toString("base64url");
  return `/api/templates/download?token=${payload}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as Body | null;

  if (!body?.templateId || !body?.requestedUse) {
    return NextResponse.json({ message: "Missing templateId or requestedUse" }, { status: 400 });
  }

  const anonymousUserId = await ensureAnonymousId();
  const userId = null; // hook to real auth when available

  const permissionTokens = getActivePermissionTokens({ userId, anonymousUserId, templateId: body.templateId });
  const donationQualification = qualifyDonation({ userId, anonymousUserId });

  const result = evaluateTemplateAccess({
    templateId: body.templateId,
    requestedUse: body.requestedUse,
    userId,
    anonymousUserId,
    permissionTokens,
    donationQualification,
  });

  if (!result.allowed) {
    return NextResponse.json({ allowed: false, message: result.uiMessage, reason: result.reason }, { status: 403 });
  }

  const supportMethod: SupportMethod =
    result.appliedSupportMethod ||
    (donationQualification.qualifying ? "donation" : permissionTokens.length ? "written_permission" : "none");

  const signaturePolicyApplied = result.mustKeepSignature ? "kept" : "removed";
  const downloadId = crypto.randomUUID();

  saveDownload({
    downloadId,
    templateId: body.templateId,
    fileVariantId: body.fileVariantId || (result.mustKeepSignature ? "signed" : "unsigned"),
    userId,
    anonymousUserId,
    requestedUse: body.requestedUse,
    supportMethod,
    donationId: donationQualification.donationId || null,
    permissionTokenId: permissionTokens[0]?.tokenId || null,
    issuedAt: new Date().toISOString(),
    signaturePolicyApplied,
  });

  const signedUrl = buildSignedUrl(body.templateId, body.fileVariantId || "signed");

  return NextResponse.json({
    allowed: true,
    downloadId,
    signedUrl,
    mustKeepSignature: result.mustKeepSignature,
    message: result.uiMessage,
  });
}
