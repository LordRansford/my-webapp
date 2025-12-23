import { NextResponse } from "next/server";
import dns from "dns";
import net from "net";
import { z } from "zod";
import { assertToolRunAllowed } from "@/lib/billing/toolUsage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { getWorkspaceIdentity, attachWorkspaceCookie } from "@/lib/workspace/request";
import { createNote, createRun, getProject, updateRun } from "@/lib/workspace/store";

const limiter = new Map();
const windowMs = 60 * 1000;
const maxRequests = 20;

const schema = z.object({
  target: z.string().trim().min(1),
  projectId: z.string().trim().optional(),
  note: z.string().optional(),
});

const isPrivate = (value) => {
  const ip = net.isIP(value) ? value : null;
  if (!ip) return false;
  const segments = ip.split(".").map((n) => parseInt(n, 10));
  if (segments[0] === 10) return true;
  if (segments[0] === 172 && segments[1] >= 16 && segments[1] <= 31) return true;
  if (segments[0] === 192 && segments[1] === 168) return true;
  if (segments[0] === 127) return true;
  return false;
};

const isHostLike = (value) => /^[a-zA-Z0-9.-]+$/.test(value) && value.includes(".");

const rateLimit = (ip) => {
  const now = Date.now();
  const entry = limiter.get(ip) || { count: 0, start: now };
  if (now - entry.start > windowMs) {
    limiter.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  limiter.set(ip, entry);
  return true;
};

const withTimeout = (promise, ms = 5000) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timed out")), ms)),
  ]);

export async function POST(req) {
  const started = Date.now();
  const ip = req.headers.get("x-forwarded-for") || "anon";
  if (!rateLimit(ip)) return NextResponse.json({ message: "Rate limit exceeded" }, { status: 429 });
  try {
    await assertToolRunAllowed("dns-lookup");
  } catch (e) {
    return NextResponse.json({ message: e.message || "Limit reached" }, { status: e.status || 429 });
  }

  let parsed;
  try {
    parsed = schema.parse(await req.json());
  } catch {
    return NextResponse.json({ message: "Invalid input" }, { status: 400 });
  }

  const target = parsed.target.trim().toLowerCase();
  const projectId = typeof parsed?.projectId === "string" ? parsed.projectId.trim() : "";
  const note = typeof parsed?.note === "string" ? String(parsed.note).slice(0, 8000) : "";
  if (!isHostLike(target) || isPrivate(target)) {
    return NextResponse.json({ message: "Provide a valid public hostname" }, { status: 400 });
  }

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;
  const ws = await getWorkspaceIdentity(req);

  let runId = null;
  if (projectId) {
    const p = await getProject({ projectId });
    const allowed = userId ? p?.ownerId === userId : p?.ownerId == null && p?.workspaceSessionId === ws.workspaceSessionId;
    if (p && allowed) {
      const run = await createRun({ projectId, toolId: "dns-lookup", status: "running", inputJson: { target } });
      runId = String(run.id);
    }
  }

  try {
    const records = await withTimeout(dns.promises.resolveAny(target)).catch(() => null);
    if (!records) {
      const payload = {
        fallback: true,
        message: "Could not resolve. Use external DNS tools or verify the domain exists.",
      };
      if (runId && projectId) {
        await updateRun({
          runId,
          status: "succeeded",
          outputJson: payload,
          metricsJson: { durationMs: Date.now() - started, chargedCredits: 0 },
        }).catch(() => null);
        if (note.trim()) await createNote({ projectId, runId, content: note.trim() }).catch(() => null);
      }
      const res = NextResponse.json(payload);
      return attachWorkspaceCookie(res, ws.setCookieValue);
    }
    const payload = { target, records };
    if (runId && projectId) {
      await updateRun({
        runId,
        status: "succeeded",
        outputJson: payload,
        metricsJson: { durationMs: Date.now() - started, chargedCredits: 0 },
      }).catch(() => null);
      if (note.trim()) await createNote({ projectId, runId, content: note.trim() }).catch(() => null);
    }
    const res = NextResponse.json(payload);
    return attachWorkspaceCookie(res, ws.setCookieValue);
  } catch (error) {
    if (runId && projectId) {
      await updateRun({
        runId,
        status: "failed",
        outputJson: null,
        metricsJson: { durationMs: Date.now() - started, chargedCredits: 0 },
        errorJson: { code: "DNS_LOOKUP_FAILED", message: String(error?.message || "Lookup failed").slice(0, 500) },
      }).catch(() => null);
      if (note.trim()) await createNote({ projectId, runId, content: note.trim() }).catch(() => null);
    }
    const res = NextResponse.json({ message: error.message || "Lookup failed" }, { status: 500 });
    return attachWorkspaceCookie(res, ws.setCookieValue);
  }
}
