"use client";

import React, { useMemo, useState } from "react";
import { ListChecks } from "lucide-react";
import { CyberToolCard } from "./CyberToolCard";

type RiskItem = {
  id: number;
  asset: string;
  threat: string;
  likelihood: "Low" | "Medium" | "High";
  impact: "Low" | "Medium" | "High";
};

function scoreLevel(likelihood: RiskItem["likelihood"], impact: RiskItem["impact"]): string {
  const map = { Low: 1, Medium: 2, High: 3 };
  const score = map[likelihood] * map[impact];
  if (score >= 7) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

export function RiskRegisterTool() {
  const [asset, setAsset] = useState("Customer portal");
  const [threat, setThreat] = useState("Credential stuffing");
  const [likelihood, setLikelihood] = useState<RiskItem["likelihood"]>("Medium");
  const [impact, setImpact] = useState<RiskItem["impact"]>("High");
  const [items, setItems] = useState<RiskItem[]>([
    { id: 1, asset: "Billing system", threat: "Ransomware", likelihood: "Medium", impact: "High" },
  ]);

  const addRisk = () => {
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((prev) => [...prev, { id: nextId, asset, threat, likelihood, impact }]);
  };

  const removeRisk = (id: number) => setItems((prev) => prev.filter((r) => r.id !== id));

  const summary = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    items.forEach((item) => {
      const level = scoreLevel(item.likelihood, item.impact);
      counts[level as keyof typeof counts] += 1;
    });
    return counts;
  }, [items]);

  return (
    <CyberToolCard
      id="risk-register-title"
      title="Lightweight risk register"
      icon={<ListChecks className="h-4 w-4" aria-hidden="true" />}
      description="Capture a quick list of risks with likelihood and impact so you can discuss priorities without a heavy tool."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Asset</label>
              <input
                value={asset}
                onChange={(e) => setAsset(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="What are you protecting?"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Threat</label>
              <input
                value={threat}
                onChange={(e) => setThreat(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
                placeholder="What could go wrong?"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Likelihood</label>
              <select
                value={likelihood}
                onChange={(e) => setLikelihood(e.target.value as RiskItem["likelihood"])}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Impact</label>
              <select
                value={impact}
                onChange={(e) => setImpact(e.target.value as RiskItem["impact"])}
                className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={addRisk}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
          >
            Add risk
          </button>
          <p className="text-xs text-slate-500">Use this for quick workshops or tabletop exercises.</p>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
          <p className="text-xs font-semibold text-slate-700">Risk list</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {items.length === 0 && <p className="text-xs text-slate-500">No risks captured yet.</p>}
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1"
              >
                <p className="font-semibold text-slate-900">{item.asset}</p>
                <p className="text-sm text-slate-600">Threat: {item.threat}</p>
                <p className="text-sm text-slate-600">
                  Likelihood: <span className="font-semibold text-slate-900">{item.likelihood}</span> · Impact:{" "}
                  <span className="font-semibold text-slate-900">{item.impact}</span> · Level:{" "}
                  <span className="font-semibold text-slate-900">{scoreLevel(item.likelihood, item.impact)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => removeRisk(item.id)}
                  aria-label="Remove risk"
                  className="text-sm px-2 py-1 rounded-full text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700 space-y-1">
            <p>
              High: <span className="font-semibold text-slate-900">{summary.High}</span> · Medium:{" "}
              <span className="font-semibold text-slate-900">{summary.Medium}</span> · Low:{" "}
              <span className="font-semibold text-slate-900">{summary.Low}</span>
            </p>
            <p className="text-sm text-slate-600">Focus first on the high items, then medium. Decide if any low risks can be accepted.</p>
          </div>
        </div>
      </div>
    </CyberToolCard>
  );
}
