import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { anonKeyFromRequest } from "@/lib/jobs/identity";
import { rateLimit } from "@/lib/security/rateLimit";
import { getAdminRole } from "@/lib/admin/rbac";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const limited = rateLimit(req, { keyPrefix: "jobs-get", limit: 60, windowMs: 60_000 });
  if (limited) return limited;

  const { id } = await ctx.params;
  const jobId = String(id || "").trim();
  if (!jobId) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || null;
  const adminRole = getAdminRole(session?.user || null);
  const anonKey = userId ? null : anonKeyFromRequest(req);

  const jobModel = (prisma as any).job as { findUnique: (args: any) => Promise<any> };
  const eventModel = (prisma as any).jobEvent as { findMany: (args: any) => Promise<any[]> };

  const job = await jobModel.findUnique({
    where: { id: jobId },
    select: {
      id: true,
      toolId: true,
      status: true,
      userId: true,
      anonKey: true,
      inputBytes: true,
      startedAt: true,
      finishedAt: true,
      durationMs: true,
      estimatedCostCredits: true,
      chargedCredits: true,
      freeTierAppliedMs: true,
      errorCode: true,
      errorMessage: true,
      outputRef: true,
      resultJson: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const isOwner = userId && job.userId && userId === job.userId;
  const isAnonOwner = !userId && anonKey && job.anonKey && anonKey === job.anonKey;
  const isAdmin = Boolean(adminRole);

  if (!isOwner && !isAnonOwner && !isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const events = await eventModel.findMany({
    where: { jobId },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { createdAt: true, level: true, message: true },
  });

  return NextResponse.json(
    {
      job,
      events,
    },
    { status: 200 }
  );
}


