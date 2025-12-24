import type { Metrics, RunData } from "./types";

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function stddev(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const v = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(v);
}

function intervals(times: number[]) {
  const out: number[] = [];
  for (let i = 1; i < times.length; i += 1) out.push(times[i] - times[i - 1]);
  return out;
}

export function computeMetrics(run: RunData): Metrics {
  const durationMs = Math.max(0, run.durationMs);
  const maxDifficultyReached = clamp01(run.maxDifficultyReached);

  const actionTimes = run.inputs.filter((i) => i.type === "action").map((i) => i.tMs);
  const moveTimes = run.inputs.filter((i) => i.type === "move").map((i) => i.tMs);

  const reactionVarianceMs = actionTimes.length >= 3 ? stddev(intervals(actionTimes)) : null;

  // Overcorrection: bursty moves (rapid repeated moves in short windows)
  const burstWindowMs = 650;
  let bursts = 0;
  for (let i = 0; i < moveTimes.length; i += 1) {
    let j = i;
    while (j < moveTimes.length && moveTimes[j] - moveTimes[i] <= burstWindowMs) j += 1;
    if (j - i >= 4) bursts += 1;
  }
  const overcorrectionIndex = clamp01(bursts / Math.max(1, durationMs / 10_000));

  // Fatigue drop: compare first 30s vs last 30s stability (if long enough)
  const fatigueDrop = (() => {
    if (durationMs < 60_000) return null;
    const startEnd = 30_000;
    const endStart = durationMs - 30_000;
    const first = actionTimes.filter((t) => t <= startEnd);
    const last = actionTimes.filter((t) => t >= endStart);
    if (first.length < 3 || last.length < 3) return null;
    return stddev(intervals(last)) - stddev(intervals(first));
  })();

  // Error clustering: errors within 10s windows
  const err = run.errors.map((e) => e.tMs);
  let clusters = 0;
  for (let i = 0; i < err.length; i += 1) {
    let j = i;
    while (j < err.length && err[j] - err[i] <= 10_000) j += 1;
    if (j - i >= 2) clusters += 1;
  }
  const errorClustering = clamp01(clusters / Math.max(1, durationMs / 20_000));

  // Scores (0..100): simple, deterministic mappings.
  const enduranceScore = Math.round(clamp01(durationMs / 90_000) * 100);
  const controlScore = Math.round(clamp01(1 - (overcorrectionIndex * 0.7 + errorClustering * 0.3)) * 100);
  const consistencyScore = Math.round(clamp01(1 - clamp01((reactionVarianceMs ?? 300) / 420)) * 100);

  return {
    durationMs,
    maxDifficultyReached,
    reactionVarianceMs,
    overcorrectionIndex,
    fatigueDrop,
    errorClustering,
    consistencyScore,
    controlScore,
    enduranceScore,
  };
}


