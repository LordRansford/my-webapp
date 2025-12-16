"use client";

import { useState } from "react";

const steps = ["Source", "Ingestion", "Storage", "Transformation", "Usage", "Archive"];

export default function DataLifecycleMapDashboard() {
  const [data, setData] = useState(
    Object.fromEntries(steps.map((s) => [s, ""]))
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          {steps.map((step) => (
            <label key={step} className="block text-sm text-slate-700">
              <span className="font-semibold text-slate-900">{step}</span>
              <textarea
                value={data[step]}
                onChange={(e) => setData((prev) => ({ ...prev, [step]: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                rows={2}
                placeholder={`Describe ${step.toLowerCase()}`}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 shadow-sm">
                  <p className="font-semibold text-slate-900">{step}</p>
                  <p className="text-[11px] text-slate-700">{data[step] || "Add details"}</p>
                </div>
                {idx < steps.length - 1 && <span className="text-slate-400">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Checklist</p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Quality checks at ingestion and storage backups in place.</li>
              <li>Lineage captured at transformation steps.</li>
              <li>Retention applied at archive with access scoped.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
