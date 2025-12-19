"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ExportFormat, UsageMode } from "@/utils/exportPolicy";

export type SubmissionEntry = {
  templateName: string;
  usageMode: UsageMode;
  format: ExportFormat;
  timestamp: number;
};

const STORAGE_KEY = "template-export-history";

const isBrowser = typeof window !== "undefined";

const readHistory = (): SubmissionEntry[] => {
  if (!isBrowser) return [];
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SubmissionEntry[]) : [];
  } catch {
    return [];
  }
};

export const addSubmissionEntry = (entry: SubmissionEntry) => {
  if (!isBrowser) return [];
  const history = readHistory();
  const next = [entry, ...history].slice(0, 30);
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
};

type SubmissionHistoryProps = {
  templateName?: string;
  usageMode?: UsageMode;
  format?: ExportFormat;
};

export default function SubmissionHistory({ templateName, usageMode, format }: SubmissionHistoryProps) {
  const initialHistory = useMemo(() => readHistory(), []);
  const [entries, setEntries] = useState<SubmissionEntry[]>(initialHistory);

  useEffect(() => {
    if (!templateName || !usageMode || !format) return;
    const next = addSubmissionEntry({
      templateName,
      usageMode,
      format,
      timestamp: Date.now(),
    });
    setEntries(next);
  }, [templateName, usageMode, format]);

  if (!entries.length) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">My past exports</p>
        <p className="mt-1 text-sm text-slate-700">No exports in this session yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">My past exports</p>
      <ul className="mt-3 space-y-2">
        {entries.map((entry, index) => (
          <li key={`${entry.timestamp}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between gap-2 text-sm text-slate-900">
              <span className="font-semibold">{entry.templateName}</span>
              <span className="text-xs text-slate-600">{new Date(entry.timestamp).toLocaleString()}</span>
            </div>
            <div className="mt-1 text-xs text-slate-700">
              <span className="font-semibold text-slate-900">{entry.format.toUpperCase()}</span> · {entry.usageMode}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
