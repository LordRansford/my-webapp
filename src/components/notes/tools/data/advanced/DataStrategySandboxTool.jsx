"use client";

import { useMemo, useState } from "react";

const investments = [
  { id: "quality", label: "Data quality and stewardship", short: "+trust now, fewer incidents", long: "Compounding trust and reliable insight" },
  { id: "sharing", label: "Sharing and APIs", short: "+speed for teams", long: "Network effects and faster products" },
  { id: "analytics", label: "Analytics and modelling", short: "+insight for decisions", long: "Better bets and automation" },
];

export default function DataStrategySandboxTool() {
  const [choices, setChoices] = useState(() => ({
    quality: true,
    sharing: false,
    analytics: false,
  }));

  const toggle = (id) => setChoices((prev) => ({ ...prev, [id]: !prev[id] }));

  const summary = useMemo(() => {
    const active = investments.filter((item) => choices[item.id]);
    if (active.length === 0) {
      return {
        short: "No investment. Short term calm, but long term drift and lost value.",
        long: "Without a plan, data debt grows and opportunities shrink.",
      };
    }
    const short = active.map((item) => item.short).join("; ");
    const long = active.map((item) => item.long).join("; ");
    return { short, long };
  }, [choices]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Pick investments and see short and long term outcomes. Real strategies balance quality, sharing, and insight.
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {investments.map((item) => (
          <label
            key={item.id}
            className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-sm shadow-sm ${
              choices[item.id] ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={choices[item.id]}
              onChange={() => toggle(item.id)}
              className="mt-1"
            />
            <div>
              <p className="font-semibold text-slate-900">{item.label}</p>
              <p className="text-xs text-slate-600">{item.short}</p>
            </div>
          </label>
        ))}
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
        <p className="font-semibold text-slate-900">Strategic outcome</p>
        <p className="mt-1">{summary.short}</p>
        <p className="mt-1">{summary.long}</p>
        <p className="mt-1 text-slate-600">
          Strategy is choosing what to strengthen now for benefits later. Write down why you chose each lever.
        </p>
      </div>
    </div>
  );
}
