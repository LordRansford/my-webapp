import test from "node:test";
import assert from "node:assert/strict";

import { validateCpdState, explainCredits } from "../src/lib/cpd/calculations.core.js";
import { exportActivityCsv } from "../src/lib/cpd/export.core.js";

const baseState = () => ({
  version: 1,
  sections: [
    { trackId: "ai", levelId: "foundations", sectionId: "overall", completed: false, minutes: 30, lastUpdated: new Date().toISOString() },
  ],
  activity: [
    { id: "a1", trackId: "ai", levelId: "foundations", sectionId: "overall", minutesDelta: 30, timestamp: new Date().toISOString(), note: "" },
    { id: "a2", trackId: "ai", levelId: "foundations", sectionId: "overall", minutesDelta: -10, timestamp: new Date().toISOString(), note: "correction" },
  ],
});

test("validateCpdState: accepts a well-formed state", () => {
  const res = validateCpdState(baseState());
  assert.equal(res.ok, true);
});

test("validateCpdState: rejects negative section minutes", () => {
  const s = baseState();
  s.sections[0].minutes = -1;
  const res = validateCpdState(s);
  assert.equal(res.ok, false);
});

test("explainCredits: produces deterministic rollup for a track", () => {
  const s = baseState();
  const ex = explainCredits(s, "ai");
  assert.equal(ex.trackId, "ai");
  assert.equal(ex.totalMinutesFromActivity, 20);
  assert.ok(Array.isArray(ex.recent));
});

test("exportActivityCsv: produces stable header and row count", () => {
  const s = baseState();
  const csv = exportActivityCsv(s);
  const lines = csv.trim().split("\n");
  assert.equal(lines[0], "id,trackId,levelId,sectionId,minutesDelta,timestamp,note");
  assert.equal(lines.length, 1 + s.activity.length);
});


