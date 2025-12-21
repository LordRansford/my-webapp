import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export type FeedbackEntry = {
  id: string;
  sessionId: string;
  name?: string;
  heardFrom: "Family" | "Friend" | "Work colleague" | "Other";
  message: string;
  workedWell?: string;
  confused?: string;
  missing?: string;
  other?: string;
  rateClarity?: number;
  rateUsefulness?: number;
  url: string;
  createdAt: string;
};

const STORE_PATH = process.env.FEEDBACK_STORE_PATH || "data/feedback.json";

function ensureDir(p: string) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function readStore(): { entries: FeedbackEntry[] } {
  const abs = path.isAbsolute(STORE_PATH) ? STORE_PATH : path.join(process.cwd(), STORE_PATH);
  if (!fs.existsSync(abs)) return { entries: [] };
  try {
    const raw = fs.readFileSync(abs, "utf8");
    return JSON.parse(raw);
  } catch {
    return { entries: [] };
  }
}

function writeStore(data: { entries: FeedbackEntry[] }) {
  const abs = path.isAbsolute(STORE_PATH) ? STORE_PATH : path.join(process.cwd(), STORE_PATH);
  ensureDir(abs);
  const tmp = `${abs}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, abs);
}

export function addFeedback(entry: Omit<FeedbackEntry, "id" | "createdAt">) {
  const record: FeedbackEntry = {
    ...entry,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const store = readStore();
  store.entries.unshift(record);
  writeStore(store);
  return record;
}

export function listFeedback(): FeedbackEntry[] {
  return readStore().entries || [];
}

export function hasFeedbackForSession(sessionId: string): boolean {
  if (!sessionId) return false;
  return (readStore().entries || []).some((e) => e.sessionId === sessionId);
}


