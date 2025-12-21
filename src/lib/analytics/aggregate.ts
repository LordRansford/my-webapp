import { type InternalToolEvent } from "@/lib/analytics/internalEvents";

export type TimeWindow = "hour" | "day" | "7d";

export function windowToSinceMs(window: TimeWindow, nowMs: number = Date.now()): number {
  if (window === "hour") return nowMs - 60 * 60 * 1000;
  if (window === "day") return nowMs - 24 * 60 * 60 * 1000;
  return nowMs - 7 * 24 * 60 * 60 * 1000;
}

type ToolAgg = {
  toolId: string;
  views: number;
  executions: number;
  failures: number;
  timeouts: number;
  avgDurationMs: number | null;
  errorRate: number; // failures / executions
};

export type AggregatedToolMetrics = {
  window: TimeWindow;
  sinceMs: number;
  generatedAt: string;
  tools: ToolAgg[];
};

export function aggregateInternalToolEvents(events: InternalToolEvent[], window: TimeWindow, sinceMs: number): AggregatedToolMetrics {
  const byTool = new Map<
    string,
    { views: number; executions: number; failures: number; timeouts: number; durationSum: number; durationCount: number }
  >();

  for (const e of events) {
    const id = e.toolId;
    if (!id) continue;
    const cur =
      byTool.get(id) || { views: 0, executions: 0, failures: 0, timeouts: 0, durationSum: 0, durationCount: 0 };

    if (e.type === "tool_viewed") cur.views += 1;
    if (e.type === "tool_executed") {
      cur.executions += 1;
      if (typeof e.durationMs === "number") {
        cur.durationSum += e.durationMs;
        cur.durationCount += 1;
      }
    }
    if (e.type === "tool_error") cur.failures += 1;
    if (e.type === "tool_timeout") cur.timeouts += 1;

    byTool.set(id, cur);
  }

  const tools: ToolAgg[] = [...byTool.entries()]
    .map(([toolId, cur]) => {
      const avg = cur.durationCount ? cur.durationSum / cur.durationCount : null;
      const errorRate = cur.executions ? cur.failures / cur.executions : 0;
      return {
        toolId,
        views: cur.views,
        executions: cur.executions,
        failures: cur.failures,
        timeouts: cur.timeouts,
        avgDurationMs: avg ? Math.round(avg) : null,
        errorRate: Number(errorRate.toFixed(4)),
      };
    })
    .sort((a, b) => b.executions - a.executions || b.views - a.views || a.toolId.localeCompare(b.toolId));

  return {
    window,
    sinceMs,
    generatedAt: new Date().toISOString(),
    tools,
  };
}


