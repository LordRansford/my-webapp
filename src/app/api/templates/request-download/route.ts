import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";
import { evaluateTemplateAccess, RequestedUse, SupportMethod } from "@/lib/templates/permissions";
import { getActivePermissionTokens, saveDownload } from "@/lib/templates/store";
import { qualifyDonation } from "@/lib/donations/qualify";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { runWithMetering } from "@/lib/tools/runWithMetering";

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
  const originBlock = requireSameOrigin(request);
  if (originBlock) return originBlock;
  const limited = rateLimit(request, { keyPrefix: "templates-request-download", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const body = (await request.json().catch(() => null)) as Body | null;

  if (!body?.templateId || !body?.requestedUse) {
    return NextResponse.json({ message: "Missing templateId or requestedUse" }, { status: 400 });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const authedUserId = session?.user?.id || null;

  const metered = await runWithMetering({
    req: request,
    userId: authedUserId,
    toolId: "templates-request-download",
    inputBytes: Buffer.byteLength(JSON.stringify(body)),
    requestedComplexityPreset: "light",
    execute: async () => {
      const anonymousUserId = await ensureAnonymousId();
      const userId = authedUserId; // real auth when available

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
        return {
          output: { allowed: false, message: result.uiMessage, reason: result.reason },
          outputBytes: Buffer.byteLength(result.uiMessage || ""),
        };
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

      const payload = {
        allowed: true,
        downloadId,
        signedUrl,
        mustKeepSignature: result.mustKeepSignature,
        message: result.uiMessage,
      };

      return { output: payload, outputBytes: Buffer.byteLength(JSON.stringify(payload)) };
    },
  });

  if (!metered.ok) return NextResponse.json({ message: metered.message, estimate: metered.estimate }, { status: metered.status });

  if ((metered.output as any)?.allowed === false) {
    return NextResponse.json({ ...(metered.output as any), receipt: metered.receipt }, { status: 403 });
  }

  return NextResponse.json({ ...(metered.output as any), receipt: metered.receipt }, { status: 200 });
}
