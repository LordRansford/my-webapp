const HISTORY_KEY = "template-export-history";

const safeWindow = () => (typeof window !== "undefined" ? window : null);

export function recordExport({ templateId, format, intendedUse, includeAttribution, exportedAt }) {
  const win = safeWindow();
  if (!win) return;
  const raw = win.localStorage.getItem(HISTORY_KEY);
  const existing = raw ? JSON.parse(raw) : [];
  const entry = { templateId, format, intendedUse, includeAttribution, exportedAt };
  const next = [...existing, entry].slice(-200);
  win.localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

export function getExportHistory() {
  const win = safeWindow();
  if (!win) return [];
  const raw = win.localStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}
