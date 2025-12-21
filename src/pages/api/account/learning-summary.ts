import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { handlePagesApi, jsonPages } from "@/server/pagesApi";
import { AppError } from "@/server/errors";
import { getAccountLearningSummary } from "@/services/accountSummaryService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  return handlePagesApi(req, res, { route: "GET /api/account/learning-summary" }, async ({ requestId }) => {
    if (req.method !== "GET") {
      throw new AppError({ code: "VALIDATION_ERROR", status: 405, message: "Method not allowed", exposeMessage: "Method not allowed" });
    }

    const session = await getServerSession(req, res, authOptions);
    if (!session?.user?.id) {
      throw new AppError({ code: "UNAUTHORIZED", status: 401, message: "Unauthorized", exposeMessage: "Unauthorized" });
    }

    const summary = getAccountLearningSummary(session.user.id);
    return jsonPages(
      res,
      {
        email: session.user.email || null,
        displayName: session.user.name || null,
        ...summary,
      },
      200,
      requestId
    );
  });
}


