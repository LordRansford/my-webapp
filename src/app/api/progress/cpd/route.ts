import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { validateCpdStateOrThrow } from "@/lib/cpd/calculations";
import { getCpdStateForUser, setCpdStateForUser } from "@/services/progressService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const row = await getCpdStateForUser(session.user.id);
  if (!row) return NextResponse.json({ state: null, updatedAt: null });
  return NextResponse.json({ state: JSON.parse(row.stateJson), updatedAt: row.updatedAt });
}

export async function PUT(req: Request) {
  return withRequestLogging(req, { route: "PUT /api/progress/cpd" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;
    const limited = rateLimit(req, { keyPrefix: "cpd-save", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.state) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

    try {
      validateCpdStateOrThrow(body.state);
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid CPD state", detail: String(err?.message || err) }, { status: 400 });
    }

    const saved = await setCpdStateForUser({ userId: session.user.id, stateJson: JSON.stringify(body.state) });
    return NextResponse.json({ ok: true, updatedAt: saved.updatedAt });
  });
}


