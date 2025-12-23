import { NextResponse } from "next/server";
import { runWorkerTick } from "@/lib/jobs/worker";
import { rateLimit } from "@/lib/security/rateLimit";
import { logInfo } from "@/lib/telemetry/log";

export async function POST(req: Request) {
  const limited = rateLimit(req, { keyPrefix: "admin-worker-tick", limit: 30, windowMs: 60_000 });
  if (limited) return limited;

  const secret = process.env.ADMIN_WORKER_SECRET || "";
  const provided = req.headers.get("x-admin-worker-secret") || "";
  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as any;
  const limit = typeof body?.limit === "number" ? body.limit : 10;

  const out = await runWorkerTick({ limit });
  logInfo("admin.worker_tick", {
    processedCount: out.processedCount,
    requestId: req.headers.get("x-request-id") || null,
  });

  return NextResponse.json(out, { status: 200 });
}


