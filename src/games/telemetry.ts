export type RunTelemetry = {
  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;
  // input
  actionPressTimesMs: number[];
  directionChangeTimesMs: number[];
  // difficulty proxy
  intensitySamples: Array<{ tMs: number; v: number }>;
  // errors
  failTimesMs: number[];
};

export type SkillMetrics = {
  durationMs: number;
  actionTimingVarianceMs: number | null;
  directionTimingVarianceMs: number | null;
  earlyFail: boolean;
  errorClustered: boolean;
  peakIntensity: number;
};

function variance(values: number[]) {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const v = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return v;
}

function varianceIntervals(times: number[]): number | null {
  if (times.length < 3) return null;
  const intervals: number[] = [];
  for (let i = 1; i < times.length; i += 1) intervals.push(times[i] - times[i - 1]);
  return variance(intervals);
}

export function computeSkillMetrics(t: RunTelemetry): SkillMetrics {
  const durationMs = Math.max(0, t.durationMs);
  const actionVar = varianceIntervals(t.actionPressTimesMs);
  const dirVar = varianceIntervals(t.directionChangeTimesMs);

  const earlyFail = durationMs > 0 && durationMs < 12_000;
  const lastFail = t.failTimesMs[t.failTimesMs.length - 1] ?? null;
  const clusterWindowMs = 7_500;
  const failCountInWindow =
    lastFail == null ? 0 : t.failTimesMs.filter((x) => x >= lastFail - clusterWindowMs).length;
  const errorClustered = failCountInWindow >= 2;

  const peakIntensity = Math.max(0, ...t.intensitySamples.map((s) => s.v));

  return {
    durationMs,
    actionTimingVarianceMs: actionVar == null ? null : Math.sqrt(actionVar),
    directionTimingVarianceMs: dirVar == null ? null : Math.sqrt(dirVar),
    earlyFail,
    errorClustered,
    peakIntensity,
  };
}

export function coachingLines(m: SkillMetrics): string[] {
  const lines: string[] = [];

  if (m.earlyFail) lines.push("You are committing early. Slow the first 10 seconds and let patterns come to you.");

  if (m.actionTimingVarianceMs != null) {
    if (m.actionTimingVarianceMs < 140) lines.push("Your actions are steady. Keep that rhythm when pressure rises.");
    else if (m.actionTimingVarianceMs < 260) lines.push("Your timing is decent, but it slips under stress. Breathe, then act.");
    else lines.push("Your timing swings a lot. Aim for smaller, more repeatable inputs.");
  }

  if (m.directionTimingVarianceMs != null) {
    if (m.directionTimingVarianceMs > 260) lines.push("You overcorrect when things get tight. Try one clean move, then hold.");
  }

  if (m.errorClustered) lines.push("Mistakes are clustering. After a hit, reset your pace before you chase recovery.");

  if (m.peakIntensity > 0.7) lines.push("You reached a high difficulty band. Anticipation matters more than reaction there.");

  if (!lines.length) lines.push("Your run was stable. Push a little longer next time and keep inputs minimal.");

  return lines.slice(0, 3);
}


