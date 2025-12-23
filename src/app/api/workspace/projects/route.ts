import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { WORKSPACE_COOKIE, getOrCreateWorkspaceSession, newWorkspaceTokenRaw, signWorkspaceToken, verifyWorkspaceToken } from "@/lib/workspace/session";
import { createProject, listProjects, type ProjectTopic } from "@/lib/workspace/store";

function getCookie(req: Request, name: string) {
  const raw = req.headers.get("cookie") || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx <= 0) continue;
    const k = p.slice(0, idx);
    const v = p.slice(idx + 1);
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

function setCookie(res: NextResponse, name: string, value: string, maxAgeSeconds: number) {
  res.headers.append(
    "set-cookie",
    `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`
  );
}

async function getIdentity(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;

  const signed = getCookie(req, WORKSPACE_COOKIE.name);
  const raw = signed ? verifyWorkspaceToken(signed) : null;
  const tokenRaw = raw || newWorkspaceTokenRaw();
  const workspaceSession = await getOrCreateWorkspaceSession({ tokenRaw });
  return { userId, workspaceSessionId: String(workspaceSession.id), tokenRaw, hadCookie: Boolean(raw) };
}

export async function GET(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "workspace-projects", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  const ident = await getIdentity(req);
  const projects = await listProjects({ ownerId: ident.userId, workspaceSessionId: ident.workspaceSessionId, q: q || undefined });

  const res = NextResponse.json({ ok: true, projects });
  if (!ident.hadCookie) {
    setCookie(res, WORKSPACE_COOKIE.name, signWorkspaceToken(ident.tokenRaw), WORKSPACE_COOKIE.maxAgeSeconds);
  }
  return res;
}

export async function POST(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "workspace-create-project", limit: 20, windowMs: 60_000 });
  if (limited) return limited;

  const ident = await getIdentity(req);
  const body = (await req.json().catch(() => null)) as { title?: string; topic?: ProjectTopic } | null;
  const title = typeof body?.title === "string" ? body.title.trim().slice(0, 80) : "";
  const topic = body?.topic;
  if (!title) return NextResponse.json({ ok: false, error: "Title is required." }, { status: 400 });
  if (topic !== "ai" && topic !== "cyber" && topic !== "software" && topic !== "data" && topic !== "digitalisation") {
    return NextResponse.json({ ok: false, error: "Invalid topic." }, { status: 400 });
  }

  const project = await createProject({
    ownerId: ident.userId,
    workspaceSessionId: ident.userId ? null : ident.workspaceSessionId,
    title,
    topic,
  });

  const res = NextResponse.json({ ok: true, project });
  if (!ident.hadCookie) {
    setCookie(res, WORKSPACE_COOKIE.name, signWorkspaceToken(ident.tokenRaw), WORKSPACE_COOKIE.maxAgeSeconds);
  }
  return res;
}


