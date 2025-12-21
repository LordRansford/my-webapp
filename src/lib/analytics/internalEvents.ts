export type InternalToolEventType = "tool_viewed" | "tool_executed" | "tool_error" | "tool_timeout";

export type InternalToolEvent = {
  type: InternalToolEventType;
  toolId: string;
  timestamp: string; // ISO
  sessionId: string; // anonymous, per-browser-session
  durationMs?: number;
  success?: boolean;
};

export type InternalToolEventPayload = {
  v: 1;
  event: InternalToolEvent;
};

export function isInternalToolEvent(x: any): x is InternalToolEvent {
  if (!x || typeof x !== "object") return false;
  if (typeof x.type !== "string") return false;
  if (!["tool_viewed", "tool_executed", "tool_error", "tool_timeout"].includes(x.type)) return false;
  if (typeof x.toolId !== "string" || x.toolId.trim().length === 0) return false;
  if (typeof x.timestamp !== "string" || x.timestamp.trim().length === 0) return false;
  if (typeof x.sessionId !== "string" || x.sessionId.trim().length === 0) return false;
  if (x.durationMs !== undefined && (typeof x.durationMs !== "number" || !Number.isFinite(x.durationMs) || x.durationMs < 0))
    return false;
  if (x.success !== undefined && typeof x.success !== "boolean") return false;
  return true;
}


