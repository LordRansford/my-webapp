import test from "node:test";
import assert from "node:assert/strict";
import { coachingFromMetrics } from "../src/features/games/coaching.core.mjs";

test("coachingFromMetrics: no banned generic praise", () => {
  const c = coachingFromMetrics({
    durationMs: 70_000,
    maxDifficultyReached: 0.8,
    reactionVarianceMs: 150,
    overcorrectionIndex: 0.2,
    fatigueDrop: 20,
    errorClustering: 0.1,
    consistencyScore: 70,
    controlScore: 80,
    enduranceScore: 70,
  });
  const blob = `${c.headline}\n${c.insights.join("\n")}\n${c.tip}`.toLowerCase();
  assert.equal(blob.includes("good job"), false);
  assert.equal(blob.includes("well done"), false);
  assert.equal(blob.includes("keep it up"), false);
});


