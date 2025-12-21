"use client";

import { type InternalToolEvent, type InternalToolEventPayload } from "@/lib/analytics/internalEvents";

const SESSION_KEY = "rn_internal_anon_session_v1";

function isEnabled(): boolean {
  // Disabled by default. Enable explicitly in production only.
  if (process.env.NODE_ENV !== "production") return false;
  if (process.env.CI) return false;
  if (process.env.NEXT_PUBLIC_INTERNAL_ANALYTICS !== "true") return false;
  if (typeof window === "undefined") return false;
  const path = window.location?.pathname || "";
  if (path.startsWith("/admin")) return false;
  return true;
}

export function getAnonSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "unknown";
  }
}

export function emitInternalToolEvent(event: Omit<InternalToolEvent, "timestamp" | "sessionId"> & { timestamp?: string }) {
  if (!isEnabled()) return;

  const payload: InternalToolEventPayload = {
    v: 1,
    event: {
      ...event,
      toolId: String(event.toolId || "").trim(),
      timestamp: event.timestamp || new Date().toISOString(),
      sessionId: getAnonSessionId(),
    },
  };

  // Fire and forget. Never block tool execution.
  try {
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // ignore
  }
}


