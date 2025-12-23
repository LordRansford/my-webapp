import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { prisma } from "@/lib/db/prisma";

export async function GET(req: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const limited = rateLimit(req, { keyPrefix: "workspace-export", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const { projectId: rawId } = await context.params;
  const projectId = String(rawId || "").trim();
  if (!projectId) return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });

  const project = (prisma as any).project as { findUnique: (args: any) => Promise<any> };
  const p = await project.findUnique({
    where: { id: projectId },
    include: {
      runs: { orderBy: { startedAt: "asc" } },
      notes: { orderBy: { createdAt: "asc" } },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!p) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });

  const data = {
    project: {
      id: p.id,
      title: p.title,
      topic: p.topic,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    },
    runs: (p.runs || []).map((r: any) => ({
      id: r.id,
      toolId: r.toolId,
      status: r.status,
      startedAt: r.startedAt,
      finishedAt: r.finishedAt,
      inputJson: r.inputJson ?? null,
      outputJson: r.outputJson ?? null,
      metricsJson: r.metricsJson ?? null,
      errorJson: r.errorJson ?? null,
    })),
    notes: (p.notes || []).map((n: any) => ({
      id: n.id,
      runId: n.runId,
      content: String(n.content || ""),
      createdAt: n.createdAt,
    })),
    attachments: (p.attachments || []).map((a: any) => ({
      id: a.id,
      runId: a.runId,
      filename: a.filename,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      createdAt: a.createdAt,
    })),
  };

  return NextResponse.json({ ok: true, data });
}


