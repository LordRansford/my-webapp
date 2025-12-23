import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { prisma } from "@/lib/db/prisma";

/**
 * Certificates are an optional entitlement:
 * - Learning stays free and accessible.
 * - Payment is only for formal recognition (certificate status/issuance).
 */

const ALLOWED = new Set(["not_requested", "pending_payment", "eligible", "issued"]);

export async function GET(req: Request) {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = session?.user?.id || "";
  if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = String(searchParams.get("courseId") || "").trim();
  if (!courseId) return NextResponse.json({ message: "Missing courseId" }, { status: 400 });

  const entitlement = (prisma as any).certificateEntitlement as {
    findUnique: (args: any) => Promise<any>;
  };

  const row = await entitlement.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  const status = row?.status && ALLOWED.has(row.status) ? row.status : "not_requested";
  return NextResponse.json({ status }, { status: 200 });
}


