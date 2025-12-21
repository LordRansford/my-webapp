import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import { asAppError } from "./errors";
import { logger } from "./logger";

export function getPagesRequestId(req: NextApiRequest) {
  const header = req.headers["x-request-id"];
  const requestId =
    typeof header === "string"
      ? header
      : Array.isArray(header) && header.length
      ? header[0]
      : crypto.randomUUID();
  return requestId;
}

export function jsonPages(res: NextApiResponse, body: any, status = 200, requestId?: string) {
  if (requestId) res.setHeader("x-request-id", requestId);
  return res.status(status).json(requestId ? { ...body, requestId } : body);
}

export async function handlePagesApi(
  req: NextApiRequest,
  res: NextApiResponse,
  meta: { route: string },
  fn: (ctx: { requestId: string }) => Promise<void>
) {
  const requestId = getPagesRequestId(req);
  const start = Date.now();
  try {
    await fn({ requestId });
    const durationMs = Date.now() - start;
    logger.info("api_request", { requestId, route: meta.route }, { status: res.statusCode, durationMs });
  } catch (err) {
    const durationMs = Date.now() - start;
    const appErr = asAppError(err);
    logger.error("api_request", { requestId, route: meta.route }, { status: appErr.status, durationMs, code: appErr.code });
    jsonPages(
      res,
      { error: { code: appErr.code, message: appErr.exposeMessage } },
      appErr.status,
      requestId
    );
  }
}


