"use client";

import { useState } from "react";

export default function DigitalServiceJourneyMapDashboard() {
  const [steps, setSteps] = useState([
    { name: "Discover", channel: "Web", system: "CMS", pain: 2 },
    { name: "Apply", channel: "Mobile", system: "Legacy form", pain: 7 },
    { name: "Confirm", channel: "Email", system: "CRM", pain: 4 },
  ]);

  const updatePain = (idx, val) => setSteps((prev) => prev.map((s, i) => (i === idx ? { ...s, pain: Number(val) } : s)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="space-y-3">
        {steps.map((step, idx) => (
          <div key={step.name} className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-900">{step.name}</p>
                <p className="text-xs text-slate-600">
                  Channel: {step.channel} · System: {step.system}
                </p>
              </div>
              <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${step.pain >= 6 ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-800"}`}>
                Pain {step.pain}/10
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={step.pain}
              onChange={(e) => updatePain(idx, e.target.value)}
              className="mt-2 w-full accent-blue-600"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
        Highlight high-pain steps for redesign—look for manual channels and legacy systems first.
      </div>
    </div>
  );
}
