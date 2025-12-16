"use client";

import { useMemo, useState } from "react";

const responsibilities = [
  { id: "standards", label: "Set data and API standards" },
  { id: "platforms", label: "Run shared platforms and identity" },
  { id: "backlogs", label: "Own product backlogs" },
  { id: "process", label: "Own local process change" },
  { id: "approvals", label: "Approve high risk changes" },
];

const choices = [
  { id: "central", label: "Central" },
  { id: "shared", label: "Shared" },
  { id: "local", label: "Local" },
];

export default function OperatingModelDesignerGame() {
  const [assignments, setAssignments] = useState(
    responsibilities.reduce((acc, r) => ({ ...acc, [r.id]: "shared" }), {})
  );

  const summary = useMemo(() => {
    const values = Object.values(assignments);
    const central = values.filter((v) => v === "central").length;
    const local = values.filter((v) => v === "local").length;
    const shared = values.filter((v) => v === "shared").length;

    const strengths = [];
    const risks = [];

    if (central >= 2) strengths.push("Strong consistency and clearer standards.");
    if (local >= 2) strengths.push("High local ownership and faster context-aware change.");
    if (shared >= 2) strengths.push("Balanced collaboration between central and teams.");

    if (central >= 3) risks.push("Bottlenecks and slower delivery.");
    if (local >= 3) risks.push("Fragmentation and duplicate solutions.");
    if (shared >= 3) risks.push("Decision latency if roles are unclear.");

    if (!strengths.length) strengths.push("Strengths will emerge once choices are made.");
    if (!risks.length) risks.push("Few immediate risks, but review alignment as complexity grows.");

    return { strengths, risks };
  }, [assignments]);

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <h4 className="text-base font-semibold text-slate-900">Assign responsibilities</h4>
      <p className="text-sm text-slate-700">Pick where each responsibility primarily sits. Then review the trade-offs.</p>

      <div className="mt-3 space-y-2">
        {responsibilities.map((resp) => (
          <div key={resp.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-900">{resp.label}</div>
            <div className="flex flex-wrap gap-2">
              {choices.map((choice) => (
                <button
                  key={choice.id}
                  onClick={() => setAssignments((prev) => ({ ...prev, [resp.id]: choice.id }))}
                  className={`rounded-full border px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-sky-300 ${
                    assignments[resp.id] === choice.id
                      ? "border-sky-400 bg-sky-50 text-slate-900"
                      : "border-slate-200 bg-white text-slate-800 hover:border-sky-200"
                  }`}
                >
                  {choice.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-slate-900 shadow-sm">
          <h5 className="mb-2 text-sm font-semibold text-emerald-800">Strengths</h5>
          <ul className="list-disc space-y-1 pl-4">
            {summary.strengths.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-slate-900 shadow-sm">
          <h5 className="mb-2 text-sm font-semibold text-amber-800">Risks</h5>
          <ul className="list-disc space-y-1 pl-4">
            {summary.risks.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
