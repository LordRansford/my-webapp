"use client";

import { useMemo, useState } from "react";
import { Database, Sparkles, AlertTriangle } from "lucide-react";

const SAMPLE_DATA = `id,age,city,usage_kwh
1,34,Accra,120
2,,Lagos,95
3,29,,110
4,41,Kumasi,210
5,?,Accra,180`;

const isMissing = (value) =>
  value === undefined ||
  value === null ||
  value.trim() === "" ||
  value.trim().toLowerCase() === "na" ||
  value.trim() === "?";

const parseCsv = (raw) => {
  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) {
    return { headers: [], rows: [] };
  }
  const headers = lines[0].split(",").map((cell) => cell.trim());
  const rows = lines.slice(1).map((line) => line.split(",").map((cell) => cell.trim()));
  return { headers, rows };
};

export default function DataProfilerTool() {
  const [raw, setRaw] = useState(SAMPLE_DATA);

  const { headers, rows } = useMemo(() => parseCsv(raw), [raw]);

  const stats = useMemo(() => {
    const columnStats = headers.map((header, index) => {
      const values = rows.map((row) => row[index] || "");
      const missing = values.filter((value) => isMissing(value)).length;
      const numeric = values.filter((value) => !isMissing(value) && !Number.isNaN(Number(value))).length;
      const unique = new Set(values.filter((value) => !isMissing(value))).size;
      return { header, missing, numeric, unique, total: values.length };
    });

    const missingTotal = columnStats.reduce((sum, col) => sum + col.missing, 0);
    return {
      rows: rows.length,
      columns: headers.length,
      missingTotal,
      columnStats,
    };
  }, [headers, rows]);

  const suggestions = useMemo(() => {
    const notes = [];
    if (stats.missingTotal > 0) {
      notes.push("Missing values found. Decide to fill, drop, or flag them.");
    }
    const hasCategorical = stats.columnStats.some((col) => col.numeric < col.total && col.total > 0);
    if (hasCategorical) {
      notes.push("Categorical fields need encoding before training.");
    }
    if (stats.rows > 0 && stats.columns > 0) {
      notes.push("Start with a small baseline model before adding extra features.");
    }
    return notes.slice(0, 3);
  }, [stats]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Database className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Data profiler and cleaner</p>
          <p className="text-xs text-slate-600">Paste a tiny dataset and review quick stats.</p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <textarea
          value={raw}
          onChange={(event) => setRaw(event.target.value)}
          rows={6}
          className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
          aria-label="Dataset input"
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setRaw(SAMPLE_DATA)}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            Use sample
          </button>
          <button
            type="button"
            onClick={() => setRaw("")}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-slate-300 hover:bg-slate-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Rows</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{stats.rows}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Columns</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{stats.columns}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Missing values</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">{stats.missingTotal}</p>
        </div>
      </div>

      {stats.columnStats.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
          <p className="text-xs font-semibold text-slate-600">Field scan</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {stats.columnStats.map((col) => (
              <div key={col.header} className="rounded-xl border border-slate-200 bg-slate-50/70 p-2">
                <p className="text-xs font-semibold text-slate-900">{col.header}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Missing: {col.missing} | Unique: {col.unique}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Suggestions
        </p>
        <ul className="mt-2 space-y-1 text-xs text-slate-600">
          {suggestions.length ? (
            suggestions.map((note) => <li key={note}>- {note}</li>)
          ) : (
            <li className="flex items-center gap-2">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Add a few rows to see suggestions.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
