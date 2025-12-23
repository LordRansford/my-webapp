import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { rateLimit } from "@/lib/security/rateLimit";
import { withRequestLogging } from "@/lib/security/requestLog";
import { prisma } from "@/lib/db/prisma";

function csvEscape(v: any) {
  const s = String(v ?? "");
  if (s.includes(",") || s.includes("\"") || s.includes("\n")) return `"${s.replace(/"/g, "\"\"")}"`;
  return s;
}

export async function GET(req: Request) {
  return withRequestLogging(req, { route: "GET /api/credits/usage/export" }, async () => {
    const limited = rateLimit(req, { keyPrefix: "credits-usage-export", limit: 10, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions).catch(() => null);
    const userId = session?.user?.id || "";
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const rows = await prisma.creditUsageEvent.findMany({
      where: { userId },
      orderBy: { occurredAt: "desc" },
      take: 5_000,
    });

    const header = [
      "occurredAt",
      "toolId",
      "runId",
      "durationMs",
      "inputBytes",
      "outputBytes",
      "freeTierAppliedMs",
      "paidMs",
      "estimatedCredits",
      "actualCredits",
      "consumed",
    ].join(",");

    const body = rows
      .map((r) =>
        [
          r.occurredAt?.toISOString?.() || "",
          r.toolId,
          r.runId || "",
          r.durationMs,
          r.inputBytes,
          r.outputBytes,
          r.freeTierAppliedMs,
          r.paidMs,
          r.estimatedCredits,
          r.actualCredits,
          r.consumed,
        ].map(csvEscape).join(","),
      )
      .join("\n");

    const csv = `${header}\n${body}\n`;
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": `attachment; filename="credits-usage.csv"`,
        "cache-control": "private, max-age=0, no-store",
      },
    });
  });
}


