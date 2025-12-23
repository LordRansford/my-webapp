import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { getProject } from "@/lib/workspace/store";
import { attachWorkspaceCookie, getWorkspaceIdentity } from "@/lib/workspace/request";

export async function GET(req: NextRequest, context: { params: Promise<{ projectId: string }> }) {
  const limited = rateLimit(req, { keyPrefix: "workspace-project", limit: 120, windowMs: 60_000 });
  if (limited) return limited;

  const { projectId: rawId } = await context.params;
  const projectId = String(rawId || "").trim();
  if (!projectId) return NextResponse.json({ ok: false, error: "Missing projectId" }, { status: 400 });

  const ident = await getWorkspaceIdentity(req);
  const project = await getProject({ projectId });
  if (!project) return NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });

  const allowed = ident.userId ? project.ownerId === ident.userId : project.ownerId == null && project.workspaceSessionId === ident.workspaceSessionId;
  if (!allowed) {
    const res = NextResponse.json({ ok: false, error: "Project not found" }, { status: 404 });
    return attachWorkspaceCookie(res, ident.setCookieValue);
  }

  // Redact internal linkage fields
  const safe = {
    id: project.id,
    title: project.title,
    topic: project.topic,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    runs: (project.runs || []).map((r: any) => ({
      id: r.id,
      toolId: r.toolId,
      status: r.status,
      startedAt: r.startedAt,
      finishedAt: r.finishedAt,
      metricsJson: r.metricsJson,
      inputJson: r.inputJson ?? null,
      outputJson: r.outputJson ?? null,
      errorJson: r.errorJson ?? null,
    })),
    notes: (project.notes || []).map((n: any) => ({
      id: n.id,
      runId: n.runId,
      content: String(n.content || ""),
      createdAt: n.createdAt,
    })),
  };

  const res = NextResponse.json({ ok: true, project: safe });
  return attachWorkspaceCookie(res, ident.setCookieValue);
}


