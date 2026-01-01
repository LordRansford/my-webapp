import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";
import { listLearningRecordsForUser } from "@/lib/learning/records";
import { isBillingEnabled, BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

/**
 * Certificates are intentionally separated from access:
 * - Courses/tools remain usable without certificates (learning stays free).
 * - Payment is only for formal recognition (certificate entitlement/issuance).
 */

type Body = { courseId?: string };

async function isCourseCompleted(params: { userId: string; courseId: string }): Promise<boolean> {
  // Check CourseCompletion table for authoritative completion record
  const courseCompletion = (prisma as any).courseCompletion as {
    findFirst: (args: any) => Promise<any>;
  };
  
  const completion = await courseCompletion.findFirst({
    where: {
      userId: params.userId,
      courseId: params.courseId,
      passed: true,
    },
  });
  
  if (completion) {
    return true;
  }
  
  // Fallback: Check learning records if CourseCompletion not available
  const records = listLearningRecordsForUser(params.userId);
  return records.some((r) => r.courseId === params.courseId && r.completionStatus === "completed");
}

function isFreeCertificateCourse(_courseId: string): boolean {
  // TODO: Wire to course metadata/config if you decide to offer free certificates for specific tracks.
  return false;
}

export async function POST(req: Request) {
  if (!isBillingEnabled()) {
    return NextResponse.json({ message: BILLING_DISABLED_MESSAGE }, { status: 503 });
  }
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || "";
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as Body | null;
  const courseId = typeof body?.courseId === "string" ? body.courseId.trim() : "";
  if (!courseId) return NextResponse.json({ message: "Missing courseId" }, { status: 400 });

  const entitlement = (prisma as any).certificateEntitlement as {
    findUnique: (args: any) => Promise<any>;
    upsert: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };
  const audit = (prisma as any).auditEvent as { create: (args: any) => Promise<any> };

  const existing = await entitlement.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing && (existing.status === "eligible" || existing.status === "issued")) {
    return NextResponse.json(existing, { status: 200 });
  }

  // Eligibility rules:
  // - Completion required
  // - AND payment complete OR course is free-certificate
  const completed = await isCourseCompleted({ userId, courseId });
  const freeCert = isFreeCertificateCourse(courseId);

  if (freeCert && completed) {
    const row = await entitlement.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: { userId, courseId, status: "eligible", stripeSessionId: null },
      update: { status: "eligible" },
    });
    return NextResponse.json(row, { status: 200 });
  }

  // Payment required for entitlement.
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const certificatePriceId = process.env.STRIPE_CERTIFICATE_PRICE_ID || "";
  if (!secretKey || !certificatePriceId) {
    return NextResponse.json({ message: "Certificates are not configured" }, { status: 503 });
  }

  // Even if not completed yet, do not block learning; we only gate certificate eligibility.
  // If you prefer to require completion before payment, enforce it here.
  if (!completed) {
    // Completion check is stubbed/soft for now; keep behavior non-blocking.
    // (You can change this to a 409 later if desired.)
  }

  // Create/update entitlement record prior to checkout so we have a stable row to attach the session to.
  await entitlement.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: { userId, courseId, status: "pending_payment", stripeSessionId: null },
    update: { status: "pending_payment" },
  });

  await audit.create({
    data: {
      actorUserId: userId,
      action: "CERT_REQUESTED",
      entityType: "certificate",
      entityId: existing?.id || null,
      details: { courseId },
      ip: (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || req.headers.get("x-real-ip") || null,
      userAgent: req.headers.get("user-agent") || null,
    },
  });

  const stripe = new Stripe(secretKey);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: `${siteUrl}/certificates/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/certificates/cancel`,
    line_items: [{ price: certificatePriceId, quantity: 1 }],
    metadata: { userId, courseId, type: "certificate" },
  });

  // Persist stripeSessionId for webhook correlation.
  await entitlement.update({
    where: { userId_courseId: { userId, courseId } },
    data: { stripeSessionId: checkoutSession.id },
  });

  return NextResponse.json({ url: checkoutSession.url }, { status: 200 });
}


