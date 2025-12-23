import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { WORKSPACE_COOKIE, getOrCreateWorkspaceSession, newWorkspaceTokenRaw, signWorkspaceToken, verifyWorkspaceToken } from "@/lib/workspace/session";
import { claimWorkspace } from "@/lib/workspace/store";

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
  res.headers.append("set-cookie", `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`);
}

export async function POST(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "workspace-claim", limit: 10, windowMs: 60_000 });
  if (limited) return limited;

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;
  if (!userId) return NextResponse.json({ ok: false, error: "Sign in required." }, { status: 401 });

  const signed = getCookie(req, WORKSPACE_COOKIE.name);
  const raw = signed ? verifyWorkspaceToken(signed) : null;
  const tokenRaw = raw || newWorkspaceTokenRaw();
  const workspaceSession = await getOrCreateWorkspaceSession({ tokenRaw });

  const updated = await claimWorkspace({ ownerId: userId, workspaceSessionId: String(workspaceSession.id) });
  const res = NextResponse.json({ ok: true, claimed: updated?.count ?? 0 });
  if (!raw) setCookie(res, WORKSPACE_COOKIE.name, signWorkspaceToken(tokenRaw), WORKSPACE_COOKIE.maxAgeSeconds);
  return res;
}


