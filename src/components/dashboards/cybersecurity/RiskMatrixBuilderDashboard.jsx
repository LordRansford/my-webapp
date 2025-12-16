"use client";

import React, { useState } from "react";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

const LIKELIHOODS = ["Low", "Medium", "High"];
const IMPACTS = ["Low", "Medium", "High"];

function getRiskScore(likelihood, impact) {
  const l = LIKELIHOODS.indexOf(likelihood) + 1;
  const i = IMPACTS.indexOf(impact) + 1;
  return l * i;
}

function getRiskColor(score) {
  if (score >= 7) return "bg-red-100 text-slate-900 border-red-200";
  if (score >= 4) return "bg-orange-100 text-slate-900 border-orange-200";
  return "bg-yellow-100 text-slate-900 border-yellow-200";
}

export default function RiskMatrixBuilderDashboard() {
  const [risks, setRisks] = useState([
    { id: 1, name: "Data breach", likelihood: "Medium", impact: "High", score: 6 },
    { id: 2, name: "DDoS attack", likelihood: "Low", impact: "Medium", score: 2 },
  ]);

  const addRisk = () => {
    setRisks([
      ...risks,
      { id: Date.now(), name: "", likelihood: "Medium", impact: "Medium", score: 4 },
    ]);
  };

  const updateRisk = (id, field, value) => {
    setRisks(
      risks.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          if (field === "likelihood" || field === "impact") {
            updated.score = getRiskScore(updated.likelihood, updated.impact);
          }
          return updated;
        }
        return r;
      })
    );
  };

  const removeRisk = (id) => {
    setRisks(risks.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 text-slate-900 shadow-md ring-1 ring-slate-200 md:flex-row md:p-5">
      {/* Left: risk entries */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">
            Risk matrix builder
          </h3>
          <p className="mt-1 text-sm text-slate-700">
            Add security risks and set their likelihood and impact. The matrix view shows which risks
            need the most attention.
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-slate-800">Risks</label>
            <button
              onClick={addRisk}
              className="rounded bg-sky-600 px-3 py-1 text-xs font-medium text-white transition hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              <Plus size={12} className="inline" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {risks.map((risk) => (
              <div
                key={risk.id}
                className="grid grid-cols-4 gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm"
              >
                <input
                  type="text"
                  value={risk.name}
                  onChange={(e) => updateRisk(risk.id, "name", e.target.value)}
                  placeholder="Risk name..."
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
                />
                <select
                  value={risk.likelihood}
                  onChange={(e) => updateRisk(risk.id, "likelihood", e.target.value)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
                >
                  {LIKELIHOODS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
                <select
                  value={risk.impact}
                  onChange={(e) => updateRisk(risk.id, "impact", e.target.value)}
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-slate-900 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-300"
                >
                  {IMPACTS.map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-1">
                  <span className={`flex-1 rounded px-2 py-1 text-center text-sm font-semibold ${getRiskColor(risk.score)}`}>
                    {risk.score}
                  </span>
                  <button
                    onClick={() => removeRisk(risk.id)}
                    className="rounded p-1 text-slate-500 transition hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-sky-300"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: matrix view */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold text-slate-900">Risk matrix</h4>
          <div className="grid grid-cols-4 gap-1 text-sm">
            <div></div>
            {IMPACTS.map((impact) => (
              <div key={impact} className="text-center font-medium text-slate-700">
                {impact}
              </div>
            ))}
            {LIKELIHOODS.map((likelihood) => (
              <React.Fragment key={likelihood}>
                <div className="font-medium text-slate-700">{likelihood}</div>
                {IMPACTS.map((impact) => {
                  const score = getRiskScore(likelihood, impact);
                  const risksInCell = risks.filter(
                    (r) => r.likelihood === likelihood && r.impact === impact
                  );
                  return (
                    <div key={impact} className={`rounded border p-2 text-center text-sm font-semibold ${getRiskColor(score)}`}>
                      {risksInCell.length > 0 && <div className="font-semibold">{risksInCell.length}</div>}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {risks.filter((r) => r.score >= 7).length > 0 && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 ring-1 ring-red-100 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600" />
              <h4 className="text-sm font-semibold text-red-700">High priority risks</h4>
            </div>
            <div className="space-y-1 text-sm text-red-800">
              {risks
                .filter((r) => r.score >= 7)
                .map((r) => (
                  <div key={r.id}>• {r.name || "Unnamed risk"}</div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

