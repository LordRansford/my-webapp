"use client";

import React, { useMemo, useState } from "react";
import { saveCpdRecord } from "@/lib/cpdRecords";

type Props = {
  itemId: string;
  activityType: "course-module" | "template-submission" | "assessment";
  defaultObjectives?: string[];
  defaultMinutes?: number;
  evidenceLinks?: string[];
  templateVersion?: string;
  category?: string;
};

export default function CPDEvidencePanel({ itemId, activityType, defaultObjectives = [], defaultMinutes = 20, evidenceLinks = [], templateVersion, category }: Props) {
  const [objectives, setObjectives] = useState<string[]>(defaultObjectives);
  const [minutes, setMinutes] = useState<number>(defaultMinutes);
  const [reflection, setReflection] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const valid = useMemo(() => minutes > 0 && objectives.length > 0, [minutes, objectives]);

  const handleSave = () => {
    if (!valid) {
      setMessage("Add at least one objective and minutes.");
      return;
    }
    saveCpdRecord({
      itemId,
      activityType,
      learningObjectives: objectives,
      timeMinutes: minutes,
      reflection: reflection.trim() || undefined,
      evidenceLinks,
      templateVersion,
      category,
    });
    setMessage("Saved to your CPD records locally.");
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD evidence</p>
          <p className="text-sm text-slate-800">Capture objectives, time, and a short reflection.</p>
        </div>
        <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Local only</span>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-900">Learning objectives met</label>
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          rows={2}
          value={objectives.join("\n")}
          onChange={(e) => setObjectives(e.target.value.split("\n").filter(Boolean))}
          placeholder="List objectives achieved..."
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-900">Time spent (minutes)</label>
        <input
          type="number"
          min={5}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value) || 0)}
          className="w-32 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        />
        <p className="text-xs text-slate-600">Enter total minutes; a sensible minimum applies.</p>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-semibold text-slate-900">Reflection (optional)</label>
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
          rows={3}
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          placeholder="What did you learn? How will you apply it?"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
      >
        Save CPD record
      </button>
      {message && (
        <p className="text-xs font-semibold text-emerald-700" role="status" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
