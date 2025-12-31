import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db/prisma";
import { logInfo, logWarn } from "@/lib/telemetry/log";
import { handleCreditPurchaseWebhook } from "@/lib/billing/payments";

export async function POST(req: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!secretKey || !webhookSecret) {
    return new NextResponse("ok", { status: 200 });
  }

  const stripe = new Stripe(secretKey);

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  logInfo("stripe.webhook.received", {
    hasSignature: Boolean(sig),
    requestId: req.headers.get("x-request-id") || null,
  });

  let event: Stripe.Event | { type: string } = { type: "unknown" };
  try {
    event = stripe.webhooks.constructEvent(body, sig || "", webhookSecret);
  } catch {
    // leave event.type as "unknown"
  }

  if (event.type === "unknown") {
    logWarn("stripe.webhook.unverified", { hasSignature: Boolean(sig) });
  } else {
    logInfo("stripe.webhook.verified", { type: String(event.type || "unknown") });
  }

  // Record last webhook receipt time for admin readiness page (metadata only).
  try {
    const ev = event as Stripe.Event;
    if (ev?.id && typeof ev.id === "string") {
      const webhookEvents = (prisma as any).stripeWebhookEvent as { create: (args: any) => Promise<any> };
      await webhookEvents.create({
        data: {
          stripeEventId: ev.id,
          eventType: String(ev.type || "unknown"),
          receivedAt: new Date(),
        },
      });
    }
  } catch {
    // Intentionally ignore. Webhook must remain replay-safe and never crash on retries.
  }

  // Handle credit purchase webhooks
  if (event.type === "checkout.session.completed" && "data" in event) {
    const session = event.data.object as Stripe.Checkout.Session;
    const type = typeof session.metadata?.type === "string" ? session.metadata.type : "";

    // Handle credit purchases
    if (type === "credit_purchase") {
      try {
        const result = await handleCreditPurchaseWebhook({
          id: session.id,
          metadata: session.metadata || {},
          amount_total: session.amount_total || undefined,
        });

        if (result.success) {
          logInfo("stripe.credit_purchase.completed", {
            userId: session.metadata?.userId || null,
            credits: result.creditsGranted || 0,
            sessionId: session.id,
          });
        } else {
          logWarn("stripe.credit_purchase.failed", {
            userId: session.metadata?.userId || null,
            error: result.error || "Unknown error",
            sessionId: session.id,
          });
        }
      } catch (error) {
        logWarn("stripe.credit_purchase.error", {
          error: error instanceof Error ? error.message : "Unknown error",
          sessionId: session.id,
        });
        // Continue processing other webhook types
      }
    }
  }

  // Continue with existing certificate/purchase handling
  if (event.type !== "checkout.session.completed") {
    return new NextResponse("ok", { status: 200 });
  }

  const entitlement = (prisma as any).certificateEntitlement as {
    findFirst: (args: any) => Promise<any>;
    update: (args: any) => Promise<any>;
  };

  const purchase = (prisma as any).purchase as {
    findUnique: (args: any) => Promise<any>;
    create: (args: any) => Promise<any>;
  };

  const existing = await purchase.findUnique({ where: { stripeEventId: (event as Stripe.Event).id } });
  if (existing) {
    return new NextResponse("ok", { status: 200 });
  }

  const session = (event as Stripe.Event).data.object as Stripe.Checkout.Session;
  const userId = typeof session.metadata?.userId === "string" ? session.metadata.userId : "";
  const type = typeof session.metadata?.type === "string" ? session.metadata.type : "";
  const courseId = typeof session.metadata?.courseId === "string" ? session.metadata.courseId : "";

  // Certificate entitlement payment: mark eligible.
  // This is intentionally separated from credits/purchases.
  if (type === "certificate" && session.id) {
    try {
      const row = await entitlement.findFirst({ where: { stripeSessionId: session.id } });
      if (row && row.status !== "eligible" && row.status !== "issued") {
        await entitlement.update({ where: { id: row.id }, data: { status: "eligible" } });
      }

      const audit = (prisma as any).auditEvent as { create: (args: any) => Promise<any> };
      await audit.create({
        data: {
          actorUserId: row?.userId || null,
          action: "CERT_PAYMENT_CONFIRMED",
          entityType: "certificate",
          entityId: row?.id || null,
          details: { courseId: row?.courseId || courseId || null, stripeSessionId: session.id },
          ip: null,
          userAgent: null,
        },
      });
    } catch {
      // Ignore failures; Stripe may retry and the flow must be replay-safe.
    }
    return new NextResponse("ok", { status: 200 });
  }

  const productId = typeof session.metadata?.productId === "string" ? session.metadata.productId : "";

  if (!userId || !productId || !session.id) {
    return new NextResponse("ok", { status: 200 });
  }

  try {
    await purchase.create({
      data: {
        userId,
        productId,
        stripeSessionId: session.id,
        stripeEventId: (event as Stripe.Event).id,
        status: "paid",
      },
    });
  } catch (err: any) {
    if (err?.code === "P2002") {
      return new NextResponse("ok", { status: 200 });
    }
    return new NextResponse("ok", { status: 200 });
  }

  return new NextResponse("ok", { status: 200 });
}
