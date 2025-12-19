/* Local CPD record storage; frontend-only */

export type CpdActivityType = "course-module" | "template-submission" | "assessment";

export type CpdRecord = {
  id: string;
  userId: string;
  itemId: string; // course or template id
  activityType: CpdActivityType;
  learningObjectives: string[];
  timeMinutes: number;
  completedAt: number;
  reflection?: string;
  evidenceLinks?: string[];
  templateVersion?: string;
  hoursCredited?: number;
  category?: string;
};

const STORAGE_KEY = "cpd-records";
const USER_KEY = "template-run-user-id";
const isBrowser = typeof window !== "undefined";

export function getCpdUserId() {
  if (!isBrowser) return "server";
  let id = window.localStorage.getItem(USER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(USER_KEY, id);
  }
  return id;
}

function readAll(): CpdRecord[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CpdRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAll(records: CpdRecord[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function listCpdRecords(): CpdRecord[] {
  const userId = getCpdUserId();
  return readAll().filter((r) => r.userId === userId);
}

export function saveCpdRecord(record: Omit<CpdRecord, "id" | "userId" | "completedAt"> & { id?: string; completedAt?: number }): CpdRecord {
  const userId = getCpdUserId();
  const id = record.id || `${userId}-${crypto.randomUUID()}`;
  const completedAt = record.completedAt || Date.now();
  const entry: CpdRecord = { ...record, id, userId, completedAt };
  const existing = readAll().filter((r) => r.id !== id);
  writeAll([entry, ...existing]);
  return entry;
}

export function deleteCpdRecord(id: string) {
  writeAll(readAll().filter((r) => r.id !== id));
}

export function totalHours(records: CpdRecord[]) {
  return records.reduce((sum, rec) => sum + (rec.hoursCredited ?? rec.timeMinutes / 60), 0);
}

export function exportCpdCsv(records: CpdRecord[]) {
  const rows = ["id,itemId,activityType,category,minutes,completedAt"];
  records.forEach((r) => rows.push(`${r.id},${r.itemId},${r.activityType},${r.category || ""},${r.timeMinutes},${new Date(r.completedAt).toISOString()}`));
  return new Blob([rows.join("\n")], { type: "text/csv" });
}

export function exportCpdJson(records: CpdRecord[]) {
  return new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
}
