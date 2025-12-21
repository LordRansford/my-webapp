import fs from "node:fs";
import path from "node:path";

const STORE_PATH = process.env.LEARNING_RECORDS_STORE_PATH || "data/learning-records.json";
const empty = { records: [] };

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile(filePath, fallback) {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(abs)) return fallback;
    return JSON.parse(fs.readFileSync(abs, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  ensureDir(abs);
  const tmp = `${abs}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2), "utf8");
  fs.renameSync(tmp, abs);
}

export function calculateEarnedMinutes(params) {
  const {
    estimatedMinutes,
    sectionsCompleted,
    quizzesCompleted,
    toolsUsed,
  } = params;

  // Conservative, deterministic crediting:
  // - sections are the primary unit
  // - quizzes and tools add small bounded credit
  const fromSections = Math.max(0, Number(sectionsCompleted) || 0) * 10;
  const fromQuizzes = Math.max(0, Number(quizzesCompleted) || 0) * 5;
  const fromTools = Math.max(0, Number(toolsUsed) || 0) * 5;

  const raw = fromSections + fromQuizzes + fromTools;
  const cap = Math.max(0, Number(estimatedMinutes) || 0);
  return Math.min(raw, cap);
}

export function deriveLearningRecord(input) {
  const {
    userId,
    courseId,
    levelId,
    totalSections,
    completedSectionKeys,
    quizIdsCompleted,
    toolIdsUsed,
    estimatedMinutes,
  } = input;

  const sectionsCompleted = completedSectionKeys.size;
  const quizzesCompleted = quizIdsCompleted.size;
  const toolsUsed = toolIdsUsed.size;

  const earnedMinutes = calculateEarnedMinutes({
    estimatedMinutes,
    sectionsCompleted,
    quizzesCompleted,
    toolsUsed,
  });

  const completionStatus =
    totalSections > 0 &&
    sectionsCompleted >= totalSections &&
    quizzesCompleted >= 1
      ? "completed"
      : sectionsCompleted > 0 || quizzesCompleted > 0 || toolsUsed > 0
      ? "in_progress"
      : "not_started";

  const completionDate =
    completionStatus === "completed" ? new Date().toISOString() : null;

  return {
    userId,
    courseId,
    levelId,
    sectionsCompleted,
    quizzesCompleted,
    toolsUsed,
    timeSpentMinutes: earnedMinutes,
    completionStatus,
    completionDate,
    updatedAt: new Date().toISOString(),
  };
}

export function upsertLearningRecord(record) {
  const s = readJsonFile(STORE_PATH, empty);
  const key = `${record.userId}:${record.courseId}:${record.levelId}`;
  const existingIdx = s.records.findIndex((r) => `${r.userId}:${r.courseId}:${r.levelId}` === key);
  let stored = record;
  if (existingIdx >= 0) {
    // Preserve the first completionDate if already completed.
    const existing = s.records[existingIdx];
    const completionDate =
      existing.completionStatus === "completed" && existing.completionDate
        ? existing.completionDate
        : record.completionDate;
    stored = { ...record, completionDate };
    s.records[existingIdx] = stored;
  } else {
    s.records.push(record);
  }
  writeJsonFile(STORE_PATH, s);
  return stored;
}

export function listLearningRecordsForUser(userId) {
  const s = readJsonFile(STORE_PATH, empty);
  return (s.records || []).filter((r) => r.userId === userId);
}


