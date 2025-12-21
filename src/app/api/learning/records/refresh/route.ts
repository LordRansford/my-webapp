import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { requireSameOrigin } from "@/lib/security/origin";
import { rateLimit } from "@/lib/security/rateLimit";
import { handleAppRoute, jsonOk } from "@/server/http";
import { AppError } from "@/server/errors";
import { refreshLearningRecordForUser } from "@/services/learningRecordsService";

export async function POST(req: Request) {
  return handleAppRoute(req, { route: "POST /api/learning/records/refresh" }, async ({ requestId }) => {
    const originBlock = requireSameOrigin(req);
    if (originBlock) return originBlock;
    const limited = rateLimit(req, { keyPrefix: "learning-records-refresh", limit: 20, windowMs: 60_000 });
    if (limited) return limited;

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Unauthorized", exposeMessage: "Unauthorized" });
    }

    const body = (await req.json().catch(() => null)) as any;
    const courseId = String(body?.courseId || "").trim();
    const levelId = String(body?.levelId || "").trim();
    if (!courseId || !levelId) {
      throw new AppError({
        code: "VALIDATION_ERROR",
        status: 400,
        message: "Missing courseId or levelId",
        exposeMessage: "Missing courseId or levelId",
      });
    }

    const record = refreshLearningRecordForUser({ userId: session.user.id, courseId, levelId });
    return jsonOk({ record }, { status: 200, requestId });
  });
}


