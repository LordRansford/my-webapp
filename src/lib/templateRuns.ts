/* Local persistence for template runs (client-side only) */

export type StoredRun = {
  id: string;
  templateSlug: string;
  templateVersion?: string;
  inputs: Record<string, unknown>;
  outputs: {
    scores: Record<string, number>;
    riskBand?: string;
    explanation?: string;
    assumptions?: string[];
    nextSteps?: string[];
    chartData?: Record<string, unknown>[];
    matrixPlacement?: { row: number; col: number };
  };
  summary: string;
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = "template-runs";
const USER_KEY = "template-run-user-id";

const isBrowser = typeof window !== "undefined";

function getUserId() {
  if (!isBrowser) return "server";
  let id = window.localStorage.getItem(USER_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(USER_KEY, id);
  }
  return id;
}

function readAll(): StoredRun[] {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredRun[]) : [];
  } catch {
    return [];
  }
}

function writeAll(runs: StoredRun[]) {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runs));
}

export function loadRuns(templateSlug: string): StoredRun[] {
  const userId = getUserId();
  return readAll().filter((run) => run.templateSlug === templateSlug && run.id.startsWith(userId));
}

export function saveRun(run: Omit<StoredRun, "id" | "createdAt" | "updatedAt"> & { id?: string; createdAt?: number }): StoredRun {
  const userId = getUserId();
  const id = run.id || `${userId}-${crypto.randomUUID()}`;
  const existing = readAll();
  const now = Date.now();
  const updated: StoredRun = {
    ...run,
    id,
    createdAt: run.createdAt || now,
    updatedAt: now,
  };
  const filtered = existing.filter((r) => r.id !== id);
  filtered.unshift(updated);
  writeAll(filtered);
  return updated;
}

export function deleteRun(id: string) {
  const existing = readAll();
  writeAll(existing.filter((r) => r.id !== id));
}

export function duplicateRun(id: string): StoredRun | null {
  const existing = readAll();
  const found = existing.find((r) => r.id === id);
  if (!found) return null;
  const copy = saveRun({ ...found, id: undefined, createdAt: undefined });
  return copy;
}

export function exportRun(run: StoredRun, format: "csv" | "json"): Blob {
  if (format === "json") {
    return new Blob([JSON.stringify(run, null, 2)], { type: "application/json" });
  }
  const rows: string[] = [];
  rows.push("Key,Value");
  Object.entries(run.inputs).forEach(([k, v]) => rows.push(`${k},${JSON.stringify(v)}`));
  Object.entries(run.outputs.scores || {}).forEach(([k, v]) => rows.push(`${k},${v}`));
  return new Blob([rows.join("\n")], { type: "text/csv" });
}
