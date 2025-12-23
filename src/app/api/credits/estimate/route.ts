import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { estimateRunCost, type ComplexityPreset } from "@/lib/billing/estimateRunCost";

type Body = {
  toolId?: string;
  inputBytes?: number;
  requestedComplexityPreset?: ComplexityPreset;
};

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/credits/estimate" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "credits-estimate", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || null;

    const body = (await req.json().catch(() => null)) as Body | null;
    const toolId = typeof body?.toolId === "string" ? body.toolId.trim().slice(0, 80) : "";
    const inputBytes = typeof body?.inputBytes === "number" ? body.inputBytes : Number(body?.inputBytes || 0);
    const requestedComplexityPreset = (body?.requestedComplexityPreset || "standard") as ComplexityPreset;
    if (!toolId) return NextResponse.json({ message: "Missing toolId" }, { status: 400 });

    const estimate = await estimateRunCost({
      req,
      userId,
      toolId,
      inputBytes,
      requestedComplexityPreset,
    });

    return NextResponse.json(estimate, { status: 200 });
  });
}


