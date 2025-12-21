import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import crypto from "crypto";
import { addTemplateDownload } from "@/lib/billing/store";
import { getUserPlan } from "@/lib/billing/access";
import { assertEntitlementOrThrow } from "@/lib/billing/entitlements";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import fs from "fs";
import path from "path";

type Body = {
  templateId?: string;
  licenseChoice?: "internal_use" | "commercial_use";
  keepSignature?: boolean;
};

function safeFilename(input: string) {
  const cleaned = input.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return cleaned || "template";
}

function getTemplateGatingLevel(templateId: string): "none" | "donation" | "permission" {
  try {
    const registryPath = path.join(process.cwd(), "content", "templates", "registry.json");
    const raw = fs.readFileSync(registryPath, "utf8");
    const entries = JSON.parse(raw) as Array<{ id: string; gatingLevel?: string }>;
    const match = entries.find((e) => e.id === templateId);
    const gating = (match?.gatingLevel || "none").toLowerCase();
    if (gating === "donation") return "donation";
    if (gating === "permission") return "permission";
    return "none";
  } catch {
    return "none";
  }
}

function buildTemplateText(params: { templateId: string; licenseChoice: "internal_use" | "commercial_use"; signaturePolicy: "kept" | "removed" }) {
  const { templateId, licenseChoice, signaturePolicy } = params;
  const lines = [
    "Ransford's Notes template",
    `Template ID: ${templateId}`,
    `License choice: ${licenseChoice === "internal_use" ? "Internal use" : "Commercial use"}`,
    `Attribution: ${signaturePolicy === "kept" ? "Kept" : "Removed"}`,
    "",
    "This is a generated template export.",
    "It is intended as a planning aid, not legal advice.",
    "Only use it where you have permission to operate.",
    "",
  ];
  if (signaturePolicy === "kept") {
    lines.push("Template by Ransford's Notes");
  }
  return lines.join("\n");
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/templates/download" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "templates-download", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Sign in required" }, { status: 401 });
  }

  const body = (await req.json().catch(() => null)) as Body | null;
  const templateId = body?.templateId;
  const licenseChoice = body?.licenseChoice || "internal_use";

  if (!templateId) return NextResponse.json({ message: "Missing templateId" }, { status: 400 });

  const plan = await getUserPlan(session.user.id);
  const gatingLevel = getTemplateGatingLevel(templateId);

  // Premium template downloads require the templates_download entitlement.
  if (gatingLevel === "donation" || gatingLevel === "permission") {
    try {
      await assertEntitlementOrThrow("templates_download");
    } catch (e: any) {
      console.info("access:denied", { route: "POST /api/templates/download", feature: "templates_download", plan });
      return NextResponse.json({ message: "Professional tier required for this download" }, { status: e?.status || 403 });
    }
  }

  // License rules:
  // - Internal use: signature can be removed.
  // - Commercial use: requires supporter, signature must stay.
  let signaturePolicy: "kept" | "removed" = body?.keepSignature ? "kept" : "removed";
  if (licenseChoice === "commercial_use") {
    try {
      await assertEntitlementOrThrow("templates_download");
    } catch (e: any) {
      console.info("access:denied", { route: "POST /api/templates/download", feature: "templates_download", plan });
      return NextResponse.json({ message: "Professional tier required for commercial use downloads" }, { status: e?.status || 403 });
    }
    signaturePolicy = "kept";
  }

  const content = buildTemplateText({ templateId, licenseChoice, signaturePolicy });
  const filename = `ransfords-notes-${safeFilename(templateId)}-${licenseChoice}-${signaturePolicy}.txt`;

  addTemplateDownload({
    id: crypto.randomUUID(),
    userId: session.user.id,
    templateId,
    licenseChoice,
    signaturePolicyApplied: signaturePolicy,
    timestamp: new Date().toISOString(),
    metadata: { plan, gatingLevel },
  });

    return new NextResponse(content, {
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  });
}


