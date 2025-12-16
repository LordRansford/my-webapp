"use client";

import React, { useMemo, useState } from "react";
import { Shield, Grid3x3 } from "lucide-react";

const CONTROL_FAMILIES = [
  { id: "identity", label: "Identity and access" },
  { id: "network", label: "Network security" },
  { id: "application", label: "Application security" },
  { id: "data", label: "Data protection" },
  { id: "monitoring", label: "Monitoring and response" },
];

export default function ControlCoverageMapDashboard() {
  const [scores, setScores] = useState({
    identity: 3,
    network: 2,
    application: 3,
    data: 2,
    monitoring: 2,
  });

  const overall = useMemo(() => {
    return Object.values(scores).reduce((sum, val) => sum + val, 0) / CONTROL_FAMILIES.length;
  }, [scores]);

  const getColor = (score) => {
    if (score >= 4) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    if (score >= 3) return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    if (score >= 2) return "bg-yellow-500/20 text-yellow-300 border-yellow-500/50";
    return "bg-red-500/20 text-red-300 border-red-500/50";
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            Control coverage map
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Rate implementation strength for each control family. The heatmap shows where coverage is
            strong and where it is weak.
          </p>
        </div>

        <div className="space-y-3">
          {CONTROL_FAMILIES.map((family) => (
            <div key={family.id} className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-xs font-medium text-slate-200">{family.label}</label>
                <span className="text-xs font-semibold text-slate-100">
                  {scores[family.id]} / 5
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={scores[family.id]}
                onChange={(e) => setScores({ ...scores, [family.id]: Number(e.target.value) })}
                className="w-full accent-sky-400"
              />
              <div className="mt-1 flex justify-between text-[0.7rem] text-slate-400">
                <span>Weak</span>
                <span>Strong</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: heatmap */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Grid3x3 size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Coverage heatmap</h4>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CONTROL_FAMILIES.map((family) => {
              const score = scores[family.id];
              return (
                <div
                  key={family.id}
                  className={`rounded-lg border p-3 ${getColor(score)}`}
                >
                  <div className="mb-1 text-[0.7rem] font-medium">{family.label}</div>
                  <div className="text-lg font-bold">{score}</div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-500"
                      style={{ width: `${(score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center gap-2">
            <Shield size={18} className="text-purple-400" />
            <h4 className="text-xs font-semibold text-slate-100">Overall coverage</h4>
          </div>
          <div className="mb-2">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-slate-400">Average score</span>
              <span className="text-lg font-bold text-slate-100">{overall.toFixed(1)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-purple-400 transition-all duration-500"
                style={{ width: `${(overall / 5) * 100}%` }}
              />
            </div>
          </div>
          <p className="text-[0.7rem] text-slate-400">
            {overall >= 4
              ? "Strong coverage across control families."
              : overall >= 3
              ? "Moderate coverage. Some families may need attention."
              : "Weak coverage. Prioritise strengthening control families."}
          </p>
        </div>
      </div>
    </div>
  );
}

