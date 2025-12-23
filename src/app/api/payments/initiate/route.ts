import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { isBillingEnabled, BILLING_DISABLED_MESSAGE } from "@/lib/billing/billingEnabled";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/payments/initiate" }, async () => {
    if (!isBillingEnabled()) {
      return NextResponse.json({ enabled: false, message: BILLING_DISABLED_MESSAGE }, { status: 503 });
    }
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "payments-initiate", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    return NextResponse.json(
      {
        enabled: false,
        message: BILLING_DISABLED_MESSAGE,
      },
      { status: 200 }
    );
  });
}


