import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const tmpStore = path.join(os.tmpdir(), "learning-records-test.json");
process.env.LEARNING_RECORDS_STORE_PATH = tmpStore;
if (fs.existsSync(tmpStore)) fs.rmSync(tmpStore, { force: true });

const recordsCore = await import("../src/lib/learning/records.core.js");

test("calculateEarnedMinutes caps by estimated minutes", () => {
  const minutes = recordsCore.calculateEarnedMinutes({
    estimatedMinutes: 120,
    sectionsCompleted: 5, // 50
    quizzesCompleted: 2, // 10
    toolsUsed: 1, // 5
  });
  assert.equal(minutes, 65);
});

test("deriveLearningRecord marks completed when all signals present", () => {
  const record = recordsCore.deriveLearningRecord({
    userId: "u1",
    courseId: "c1",
    levelId: "l1",
    totalSections: 3,
    completedSectionKeys: new Set(["s1", "s2", "s3"]),
    quizIdsCompleted: new Set(["q1"]),
    toolIdsUsed: new Set(["t1"]),
    estimatedMinutes: 90,
  });
  assert.equal(record.completionStatus, "completed");
  assert.ok(record.completionDate);
  assert.equal(record.timeSpentMinutes, 40);
});

test("deriveLearningRecord marks in_progress when partial", () => {
  const record = recordsCore.deriveLearningRecord({
    userId: "u1",
    courseId: "c1",
    levelId: "l1",
    totalSections: 4,
    completedSectionKeys: new Set(["s1", "s2"]),
    quizIdsCompleted: new Set(),
    toolIdsUsed: new Set(),
    estimatedMinutes: 60,
  });
  assert.equal(record.completionStatus, "in_progress");
  assert.equal(record.completionDate, null);
});

test("upsertLearningRecord preserves first completionDate", () => {
  const first = recordsCore.upsertLearningRecord({
    userId: "u1",
    courseId: "c1",
    levelId: "l1",
    sectionsCompleted: 3,
    quizzesCompleted: 1,
    toolsUsed: 1,
    timeSpentMinutes: 40,
    completionStatus: "completed",
    completionDate: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
  });
  const second = recordsCore.upsertLearningRecord({
    ...first,
    timeSpentMinutes: 45,
    updatedAt: "2024-02-01T00:00:00.000Z",
    completionDate: "2024-02-01T00:00:00.000Z",
  });
  assert.equal(second.completionDate, "2024-01-01T00:00:00.000Z");
});


