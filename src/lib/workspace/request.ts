import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { WORKSPACE_COOKIE, getOrCreateWorkspaceSession, newWorkspaceTokenRaw, signWorkspaceToken, verifyWorkspaceToken } from "@/lib/workspace/session";
import { NextResponse } from "next/server";

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

export async function getWorkspaceIdentity(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;

  let workspaceSessionId: string | null = null;
  let setCookieValue: string | null = null;
  if (!userId) {
    const signed = getCookie(req, WORKSPACE_COOKIE.name);
    const raw = signed ? verifyWorkspaceToken(signed) : null;
    const tokenRaw = raw || newWorkspaceTokenRaw();
    try {
      const ws = await getOrCreateWorkspaceSession({ tokenRaw });
      workspaceSessionId = String(ws.id);
    } catch {
      // DB may be unavailable/misconfigured (e.g. CI or local smoke tests). Treat as anonymous without persistence.
      workspaceSessionId = null;
    }
    if (!raw) setCookieValue = signWorkspaceToken(tokenRaw);
  }

  return { userId, workspaceSessionId, setCookieValue };
}

export function attachWorkspaceCookie(res: NextResponse, signedValue: string | null) {
  if (!signedValue) return res;
  res.headers.append(
    "set-cookie",
    `${WORKSPACE_COOKIE.name}=${encodeURIComponent(signedValue)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${WORKSPACE_COOKIE.maxAgeSeconds}`
  );
  return res;
}


