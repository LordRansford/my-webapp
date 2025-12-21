import fs from "node:fs";
import path from "node:path";

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readJsonFile(filePath, fallback) {
  try {
    const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
    if (!fs.existsSync(abs)) return fallback;
    const raw = fs.readFileSync(abs, "utf8");
    return JSON.parse(raw);
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

const STORE_PATH = process.env.ANALYTICS_STORE_PATH || "data/learning-analytics.json";
const empty = { users: {} };

function load() {
  return readJsonFile(STORE_PATH, empty);
}

function save(store) {
  writeJsonFile(STORE_PATH, store);
}

export function appendAnalyticsEvents(userId, events) {
  const s = load();
  const existing = s.users[userId] || { userId, events: [], updatedAt: new Date().toISOString() };
  const cleaned = (events || [])
    .filter(Boolean)
    .map((e) => ({
      ...e,
      timestamp: e.timestamp || new Date().toISOString(),
    }))
    .slice(0, 200);

  const next = {
    userId,
    updatedAt: new Date().toISOString(),
    events: [...existing.events, ...cleaned].slice(-2000),
  };

  s.users[userId] = next;
  save(s);
  return next;
}

export function getUserAnalytics(userId) {
  const s = load();
  return s.users[userId] || { userId, events: [], updatedAt: new Date().toISOString() };
}

export function getOwnerAnalyticsSummary() {
  const s = load();
  const all = Object.values(s.users);

  const counts = {
    sectionsStarted: 0,
    sectionsCompleted: 0,
    quizAttempts: 0,
    quizCompleted: 0,
    toolUsed: 0,
  };

  const bySection = new Map();
  const byQuiz = new Map();
  const byTool = new Map();

  for (const user of all) {
    for (const e of user.events) {
      if (e.type === "section_started") counts.sectionsStarted += 1;
      if (e.type === "section_completed") counts.sectionsCompleted += 1;
      if (e.type === "quiz_attempted") counts.quizAttempts += 1;
      if (e.type === "quiz_completed") counts.quizCompleted += 1;
      if (e.type === "tool_used") counts.toolUsed += 1;

      if (e.sectionId && e.trackId && e.levelId) {
        const key = `${e.trackId}:${e.levelId}:${e.sectionId}`;
        bySection.set(key, (bySection.get(key) || 0) + 1);
      }
      if (e.quizId) {
        const cur = byQuiz.get(e.quizId) || { attempts: 0, completed: 0 };
        if (e.type === "quiz_attempted") cur.attempts += 1;
        if (e.type === "quiz_completed") cur.completed += 1;
        byQuiz.set(e.quizId, cur);
      }
      if (e.toolId) {
        byTool.set(e.toolId, (byTool.get(e.toolId) || 0) + 1);
      }
    }
  }

  const topSections = [...bySection.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([key, count]) => ({ key, count }));

  const lowestQuizCompletion = [...byQuiz.entries()]
    .map(([quizId, stats]) => ({
      quizId,
      attempts: stats.attempts,
      completed: stats.completed,
      completionRate: stats.attempts ? stats.completed / stats.attempts : 0,
    }))
    .filter((x) => x.attempts >= 5)
    .sort((a, b) => a.completionRate - b.completionRate)
    .slice(0, 20);

  const mostUsedTools = [...byTool.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([toolId, count]) => ({ toolId, count }));

  return {
    totals: counts,
    topSections,
    lowestQuizCompletion,
    mostUsedTools,
    usersTracked: all.length,
  };
}


