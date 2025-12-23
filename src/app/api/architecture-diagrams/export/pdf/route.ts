import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { sanitiseSvgStrict } from "@/lib/security/svgSanitise";
import { svgToPdf } from "@/lib/architecture-diagrams/export/pdf";

const BodySchema = z
  .object({
    svg: z.string().min(1),
    systemName: z.string().min(1).max(80),
    diagramType: z.string().min(1).max(40),
    variant: z.string().min(1).max(60),
    pageSize: z.enum(["A4", "A3"]),
    orientation: z.enum(["portrait", "landscape"]),
  })
  .strict();

function filename(systemName: string, diagramType: string, variant: string) {
  const slug = (v: string) =>
    String(v || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "diagram";
  const iso = new Date().toISOString().slice(0, 10);
  return `${slug(systemName)}-${slug(diagramType)}-${slug(variant)}-${iso}.pdf`;
}

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/architecture-diagrams/export/pdf" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limitedIp = rateLimit(req, {
      keyPrefix: "arch-pdf",
      limit: 12,
      windowMs: 60_000,
      message: "Too many PDF exports in a short time. Please wait and try again.",
    });
    if (limitedIp) return limitedIp;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    if (userId) {
      const limitedUser = rateLimit(req, {
        keyPrefix: "arch-pdf-user",
        keySuffix: userId,
        limit: 8,
        windowMs: 60_000,
        message: "Too many PDF exports in a short time. Please wait and try again.",
      });
      if (limitedUser) return limitedUser;
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch (err) {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request. Check inputs and try again." }, { status: 400 });
    }

    const { svg, systemName, diagramType, variant, pageSize, orientation } = parsed.data;

    // Re-sanitise server-side (do not trust client claims).
    const safeSvg = sanitiseSvgStrict(svg);
    if (!safeSvg.ok) {
      console.info("[arch-pdf] reject", { diagramType, pageSize, outcome: "reject" });
      return NextResponse.json({ error: safeSvg.reason }, { status: 400 });
    }

    const timeoutMs = 10_000;
    const started = Date.now();

    const result = await Promise.race([
      svgToPdf(safeSvg.svg, { systemName, diagramType, variant, pageSize, orientation }),
      new Promise<{ ok: false; reason: string }>((resolve) =>
        setTimeout(() => resolve({ ok: false, reason: "PDF export timed out. Please try again." }), timeoutMs)
      ),
    ]);

    const durationMs = Date.now() - started;

    if (!result.ok) {
      console.info("[arch-pdf] fail", { diagramType, pageSize, outcome: "fail", durationMs });
      return NextResponse.json({ error: result.reason }, { status: 400 });
    }

    console.info("[arch-pdf] ok", { diagramType, pageSize, outcome: "success", durationMs });

    return new NextResponse(Buffer.from(result.bytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename(systemName, diagramType, variant)}"`,
        "Cache-Control": "no-store",
      },
    });
  });
}


