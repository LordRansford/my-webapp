"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, Info } from "lucide-react";

const steps = ["Source", "Ingestion", "Storage", "Transformation", "Usage", "Archive"];

export default function DataLifecycleMapDashboard() {
  const [data, setData] = useState(
    Object.fromEntries(steps.map((s) => [s, ""]))
  );

  const completeness = useMemo(() => {
    const filled = steps.filter((s) => String(data[s] || "").trim().length > 0).length;
    const percent = Math.round((filled / steps.length) * 100);
    return { filled, percent };
  }, [data]);

  const missing = useMemo(() => steps.filter((s) => !String(data[s] || "").trim()), [data]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <p className="text-sm font-semibold text-slate-900">Data lifecycle map</p>
        <p className="mt-1 text-xs text-slate-700">
          Describe each stage in one sentence. The goal is to make weak points visible (missing ownership, missing backups, missing retention).
        </p>
      </div>

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
                aria-label={`${step} details`}
              />
            </label>
          ))}
        </div>
        <div className="flex flex-col justify-center gap-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold text-slate-900">Completeness</p>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-700">
              <span>{completeness.filled} of {steps.length} stages filled</span>
              <span className="font-semibold">{completeness.percent}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300" style={{ width: `${completeness.percent}%` }} />
            </div>
            {missing.length ? (
              <p className="mt-2 text-[0.7rem] text-slate-600">
                Missing: {missing.join(", ")}.
              </p>
            ) : (
              <p className="mt-2 text-[0.7rem] text-slate-600">All stages captured.</p>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-800 shadow-sm">
                  <p className="flex items-center gap-2 font-semibold text-slate-900">
                    {String(data[step] || "").trim() ? (
                      <CheckCircle2 size={14} className="text-emerald-600" aria-hidden="true" />
                    ) : (
                      <Circle size={14} className="text-slate-400" aria-hidden="true" />
                    )}
                    {step}
                  </p>
                  <p className="text-sm text-slate-700">{data[step] || "Add details"}</p>
                </div>
                {idx < steps.length - 1 && <span className="text-slate-400">→</span>}
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="flex items-center gap-2 font-semibold text-slate-900">
              <Info size={14} className="text-slate-500" aria-hidden="true" />
              Checklist
            </p>
            <ul className="mt-1 list-disc space-y-1 pl-5">
              <li>Quality checks at ingestion and storage backups in place.</li>
              <li>Lineage captured at transformation steps.</li>
              <li>Retention applied at archive with access scoped.</li>
            </ul>
            <p className="mt-2 text-[0.7rem] text-slate-600">
              Teaching point: most failures happen at handoffs (source→ingestion, transformation→usage). Make the handoff explicit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
