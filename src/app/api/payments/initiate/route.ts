import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";

const PLACEHOLDER_MESSAGE = "Payments are not yet enabled. This feature will be available shortly.";

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/payments/initiate" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "payments-initiate", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    console.log("payments:initiate:attempt", { userId: session.user.id });

    return NextResponse.json(
      {
        enabled: false,
        message: PLACEHOLDER_MESSAGE,
      },
      { status: 200 }
    );
  });
}


