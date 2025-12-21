import { NextResponse } from "next/server";
import { getRequestId } from "@/lib/security/requestLog";
import { asAppError, AppError } from "./errors";
import { logger } from "./logger";

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    requestId?: string;
  };
};

export type ApiOkBody<T> = T & { requestId?: string };

export function jsonOk<T extends Record<string, any>>(data: T, init?: { status?: number; requestId?: string }) {
  const status = init?.status ?? 200;
  const requestId = init?.requestId;
  const body: ApiOkBody<T> = requestId ? ({ ...data, requestId } as any) : data;
  const res = NextResponse.json(body, { status });
  if (requestId) res.headers.set("x-request-id", requestId);
  return res;
}

export function jsonError(err: unknown, ctx: { requestId?: string; route?: string }) {
  const appErr: AppError = asAppError(err);
  const requestId = ctx.requestId;

  logger.error("api_error", { requestId, route: ctx.route }, { code: appErr.code, status: appErr.status, message: appErr.message });

  const body: ApiErrorBody = {
    error: {
      code: appErr.code,
      message: appErr.exposeMessage,
      requestId,
    },
  };

  const res = NextResponse.json(body, { status: appErr.status });
  if (requestId) res.headers.set("x-request-id", requestId);
  return res;
}

export async function handleAppRoute(
  req: Request,
  meta: { route: string },
  fn: (ctx: { requestId: string }) => Promise<NextResponse>
) {
  const requestId = getRequestId(req);
  const start = Date.now();
  try {
    const res = await fn({ requestId });
    const durationMs = Date.now() - start;
    logger.info("api_request", { requestId, route: meta.route }, { status: res.status, durationMs });
    res.headers.set("x-request-id", requestId);
    return res;
  } catch (err) {
    const durationMs = Date.now() - start;
    logger.error("api_request", { requestId, route: meta.route }, { status: "error", durationMs });
    return jsonError(err, { requestId, route: meta.route });
  }
}


