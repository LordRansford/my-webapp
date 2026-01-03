import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/admin/requireAdmin";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";

function clean(input: unknown, maxLen: number) {
  const raw = typeof input === "string" ? input : "";
  return raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, maxLen);
}

export async function GET(req: Request) {
  const adminBlock = requireAdmin(req);
  if (adminBlock) return adminBlock;

  const originBlock = requireSameOrigin(req);
  if (originBlock) return originBlock;

  const limited = rateLimit(req, { keyPrefix: "admin-feedback-triage", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const url = new URL(req.url);
  const limit = Math.min(200, Math.max(10, Number(url.searchParams.get("limit") || 80)));

  try {
    const rows = await prisma.feedbackSubmission.findMany({
      orderBy: { submittedAt: "desc" },
      take: limit,
      select: { id: true, category: true, pageUrl: true, pageTitle: true, message: true, submittedAt: true },
    });

    const totals: Record<string, number> = {};
    const samples: Record<string, any[]> = {};

    for (const r of rows) {
      const c = clean(r.category || "general", 40) || "general";
      totals[c] = (totals[c] || 0) + 1;
      if (!samples[c]) samples[c] = [];
      if (samples[c].length < 8) {
        samples[c].push({
          id: r.id,
          pageUrl: r.pageUrl,
          pageTitle: r.pageTitle,
          submittedAt: r.submittedAt,
          messagePreview: clean(r.message, 180),
        });
      }
    }

    return NextResponse.json({ totals, samples }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Not available" }, { status: 503 });
  }
}

