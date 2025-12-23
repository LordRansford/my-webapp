import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rateLimit";
import { requireSameOrigin } from "@/lib/security/origin";
import { withRequestLogging } from "@/lib/security/requestLog";
import { ArchitectureTelemetryEventSchema } from "@/lib/architecture-diagrams/telemetry/events";
import { recordArchitectureEvent } from "@/lib/architecture-diagrams/telemetry/store";

const MAX_BODY_BYTES = 6_000;

export async function POST(req: Request) {
  return withRequestLogging(req, { route: "POST /api/telemetry/architecture-diagrams/event" }, async () => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;

    const limited = rateLimit(req, { keyPrefix: "telemetry-arch", limit: 60, windowMs: 60_000 });
    if (limited) return limited;

    const raw = await req.text().catch(() => "");
    if (!raw) return NextResponse.json({ error: "Empty body." }, { status: 400 });
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large." }, { status: 413 });
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = ArchitectureTelemetryEventSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid telemetry event." }, { status: 400 });
    }

    recordArchitectureEvent(parsed.data);
    return NextResponse.json({ ok: true });
  });
}


