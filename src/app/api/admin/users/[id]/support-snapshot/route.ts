import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { requireAdminJson } from "@/lib/security/adminAuth";
import { rateLimit } from "@/lib/security/rateLimit";
import { logAdminAction } from "@/lib/admin/audit";

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminJson("VIEW_USERS");
  if (!auth.ok) return auth.response;
  const admin = auth.session?.user;
  if (!admin?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keySuffix = admin.email || admin.id;
  const limited = rateLimit(req, { keyPrefix: "admin-user-support-snapshot", limit: 60, windowMs: 60_000, keySuffix });
  if (limited) return limited;

  const { id } = await ctx.params;

  const user = await (prisma as any).userIdentity
    .findUnique({
      where: { id },
      select: { id: true, email: true, provider: true, providerAccountId: true, createdAt: true, lastLoginAt: true, lastActiveAt: true, adminRole: true, accountStatus: true },
    })
    .catch(() => null as any);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [credits, lots, purchases, entitlements, certificates, issuances, learnerProfile, attempts] = await Promise.all([
    (prisma as any).credits.findUnique({ where: { userId: id } }).catch(() => null as any),
    (prisma as any).creditLot.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => [] as any[]),
    (prisma as any).purchase.findMany({ where: { userId: id }, orderBy: { createdAt: "desc" }, take: 20 }).catch(() => [] as any[]),
    (prisma as any).certificateEntitlement.findMany({ where: { userId: id }, orderBy: { updatedAt: "desc" }, take: 20 }).catch(() => [] as any[]),
    (prisma as any).certificate.findMany({ where: { userId: id }, orderBy: { issuedAt: "desc" }, take: 20 }).catch(() => [] as any[]),
    (prisma as any).certificateIssuance.findMany({ where: { userId: id }, orderBy: { issuedAt: "desc" }, take: 20 }).catch(() => [] as any[]),
    (prisma as any).learnerProfile.findUnique({ where: { userId: id } }).catch(() => null as any),
    (prisma as any).assessmentAttempt
      .findMany({
        where: { userId: id },
        orderBy: { completedAt: "desc" },
        take: 20,
        select: { id: true, assessmentId: true, score: true, passed: true, timeSpent: true, completedAt: true, courseVersion: true },
      })
      .catch(() => [] as any[]),
  ]);

  await logAdminAction({
    adminUser: { id: admin.id, email: admin.email || null },
    adminRole: auth.role,
    actionType: "VIEW_USER_SUPPORT_SNAPSHOT",
    target: { targetType: "user", targetId: id },
    reason: "Support snapshot view",
    req,
  }).catch(() => null);

  return NextResponse.json(
    {
      user,
      learnerProfile,
      credits,
      creditLots: lots,
      purchases,
      certificateEntitlements: entitlements,
      certificates,
      certificateIssuances: issuances,
      assessmentAttempts: attempts,
    },
    { status: 200 },
  );
}

