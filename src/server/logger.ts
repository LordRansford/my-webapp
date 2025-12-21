export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogContext = {
  requestId?: string;
  route?: string;
};

type LogPayload = Record<string, unknown>;

function write(level: LogLevel, event: string, ctx: LogContext, payload?: LogPayload) {
  const record = {
    level,
    event,
    requestId: ctx.requestId,
    route: ctx.route,
    ...payload,
    ts: new Date().toISOString(),
  };

  // Keep it simple and server-safe: console.* only.
  // Never log sensitive data; callers should pass only safe fields.
  if (level === "error") console.error(event, record);
  else if (level === "warn") console.warn(event, record);
  else console.info(event, record);
}

export const logger = {
  debug: (event: string, ctx: LogContext, payload?: LogPayload) => write("debug", event, ctx, payload),
  info: (event: string, ctx: LogContext, payload?: LogPayload) => write("info", event, ctx, payload),
  warn: (event: string, ctx: LogContext, payload?: LogPayload) => write("warn", event, ctx, payload),
  error: (event: string, ctx: LogContext, payload?: LogPayload) => write("error", event, ctx, payload),
};


