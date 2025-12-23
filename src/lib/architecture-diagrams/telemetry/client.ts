"use client";

import { bucketDurationMs } from "./events";

export async function emitArchitectureTelemetry(evt) {
  try {
    await fetch("/api/telemetry/architecture-diagrams/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...evt, ts: new Date().toISOString() }),
      keepalive: true,
    });
  } catch {
    // Telemetry must never block user flows.
  }
}

export function durationBucketFrom(startMs) {
  const ms = Date.now() - Number(startMs || Date.now());
  return bucketDurationMs(ms);
}


