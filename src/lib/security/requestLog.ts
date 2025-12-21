import crypto from "crypto";

export function getRequestId(req: Request) {
  return req.headers.get("x-request-id") || crypto.randomUUID();
}

export async function withRequestLogging<T>(
  req: Request,
  meta: { route: string },
  fn: (ctx: { requestId: string }) => Promise<T>
) {
  const requestId = getRequestId(req);
  const start = Date.now();
  try {
    const result = await fn({ requestId });
    const durationMs = Date.now() - start;
    console.info("req", { requestId, route: meta.route, status: "ok", durationMs });
    return result;
  } catch (err: any) {
    const durationMs = Date.now() - start;
    console.error("req", { requestId, route: meta.route, status: "error", durationMs, message: err?.message || "error" });
    throw err;
  }
}


