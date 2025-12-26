import { NextResponse } from "next/server";
import crypto from "crypto";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import fs from "fs";
import path from "path";

type Body = {
  templateId?: string;
  licenseChoice?: "internal_use" | "commercial_use";
  keepSignature?: boolean;
  format?: "txt" | "json" | "markdown";
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

// Check if template is a CPD certificate (should remain restricted)
function isCpdCertificate(templateId: string): boolean {
  return templateId.toLowerCase().includes("cpd") || templateId.toLowerCase().includes("certificate");
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

    const limited = rateLimit(req, { keyPrefix: "templates-download", limit: 100, windowMs: 60_000 });
    if (limited) return limited;

    const body = (await req.json().catch(() => null)) as Body | null;
    const templateId = body?.templateId;
    const licenseChoice = body?.licenseChoice || "internal_use";
    const format = body?.format || "txt";

    if (!templateId) return NextResponse.json({ message: "Missing templateId" }, { status: 400 });

    // CPD certificates remain restricted - require authentication
    if (isCpdCertificate(templateId)) {
      const { getServerSession } = await import("next-auth");
      const { authOptions } = await import("@/lib/auth/options");
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json({ message: "Authentication required for certificate downloads" }, { status: 401 });
      }
    }

    // All other templates are freely downloadable
    let signaturePolicy: "kept" | "removed" = body?.keepSignature ? "kept" : "removed";
    if (licenseChoice === "commercial_use") {
      // For commercial use, signature should be kept by default
      signaturePolicy = "kept";
    }

    const content = buildTemplateText({ templateId, licenseChoice, signaturePolicy });
    const filename = `ransfords-notes-${safeFilename(templateId)}-${licenseChoice}-${signaturePolicy}.${format}`;

    return new NextResponse(content, {
      headers: {
        "content-type": format === "json" ? "application/json" : format === "markdown" ? "text/markdown" : "text/plain; charset=utf-8",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store",
      },
    });
  });
}
