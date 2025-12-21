import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { getStripeTestClient } from "@/lib/payments/stripeTest";
import { getUserPlan } from "@/lib/billing/access";

const ALLOWED_AMOUNTS = [500, 1500, 3000, 5000]; // in cents

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/payments/create-intent" }, async () => {
    if (process.env.STRIPE_TEST_ENABLED !== "true") {
      return NextResponse.json({ message: "Stripe test mode disabled" }, { status: 503 });
    }

    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "payments-create-intent", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = (await req.json().catch(() => null)) as any;
    const amount = Number(body?.amount || 0);
    if (!ALLOWED_AMOUNTS.includes(amount)) {
      return NextResponse.json({ message: "Amount not allowed" }, { status: 400 });
    }

    const stripe = getStripeTestClient();

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      metadata: {
        userId: session.user.id,
        roleBefore: await getUserPlan(session.user.id),
        intendedRole: "supporter",
        type: "support",
      },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  });
}


