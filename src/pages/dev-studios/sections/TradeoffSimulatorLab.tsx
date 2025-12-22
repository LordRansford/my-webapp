"use client";

import React, { useMemo, useState } from "react";
import { SlidersHorizontal, TrendingUp, Shield, DollarSign } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { useToolRunner } from "@/hooks/useToolRunner";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function scoreToLabel(v: number) {
  if (v >= 80) return "High";
  if (v >= 50) return "Medium";
  return "Low";
}

export default function TradeoffSimulatorLab() {
  const runner = useToolRunner({ minIntervalMs: 600, timeoutMs: 8000, toolId: "software-tradeoff-sim" });

  // Constraints: intentionally simple sliders. This is a teaching tool, not a calculator.
  const [traffic, setTraffic] = useState(2); // 0-4
  const [team, setTeam] = useState(1); // 0-4
  const [compliance, setCompliance] = useState(1); // 0-4
  const [reliability, setReliability] = useState(2); // 0-4
  const [latency, setLatency] = useState(2); // 0-4
  const [budget, setBudget] = useState(2); // 0-4

  const computed = useMemo(() => {
    const complexity = clamp(Math.round((team + traffic + compliance + reliability + latency - budget) * 12.5), 0, 100);
    const risk = clamp(Math.round((compliance * 18 + reliability * 14 + (4 - budget) * 10 + traffic * 8) / 2), 0, 100);
    const cost = clamp(Math.round((traffic * 16 + reliability * 10 + team * 8 + compliance * 6) / 2), 0, 100);
    const recommendation =
      complexity >= 75
        ? "Prefer a modular monolith with strong boundaries and boring operations. Avoid early microservices."
        : risk >= 75
        ? "Prioritise security and reliability first: validation, authz, rate limits, observability, and a safe deploy path."
        : "Start simple, ship, then iterate. Add complexity only when constraints force it.";
    return { complexity, risk, cost, recommendation };
  }, [team, traffic, compliance, reliability, latency, budget]);

  const reduceTips = useMemo(() => {
    const tips: string[] = [];
    tips.push("Change one variable at a time so you can explain the impact.");
    if (team <= 1) tips.push("With a small team, avoid architectures that create coordination overhead.");
    if (compliance >= 3) tips.push("High compliance means strong logging, auditing, and access control by default.");
    if (traffic >= 3) tips.push("High traffic pushes you toward caching, queues, and careful scaling boundaries.");
    if (budget <= 1) tips.push("Low budget: prefer fewer managed services and simpler deployments.");
    return tips.slice(0, 4);
  }, [team, traffic, compliance, budget]);

  const simulate = async () => {
    runner.resetError();
    const meta = { inputBytes: 200, steps: 50, expectedWallMs: 600 };
    runner.prepare(meta);
    // Run is local and just returns the current computed values.
    await runner.run(async () => {
      return { ok: true };
    }, meta);
  };

  return (
    <section aria-label="Engineering trade-off simulator" className="space-y-6">
      <SecurityBanner />

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Engineering trade-off simulator</h2>
        </div>
        <p className="text-sm text-slate-700">
          Perfect solutions do not exist. This simulator helps you practice decision-making under constraints. It uses simple scoring for teaching, not precise prediction.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <p className="text-sm font-semibold text-slate-900">Constraints</p>
            {[
              { label: "Traffic", value: traffic, set: setTraffic, options: ["Tiny", "Low", "Medium", "High", "Very high"] },
              { label: "Team size", value: team, set: setTeam, options: ["Solo", "Small", "Medium", "Large", "Very large"] },
              { label: "Compliance risk", value: compliance, set: setCompliance, options: ["Low", "Some", "Moderate", "High", "Very high"] },
              { label: "Reliability need", value: reliability, set: setReliability, options: ["Low", "Some", "Moderate", "High", "Very high"] },
              { label: "Latency sensitivity", value: latency, set: setLatency, options: ["Low", "Some", "Moderate", "High", "Very high"] },
              { label: "Budget pressure", value: budget, set: setBudget, options: ["Tight", "Low", "Medium", "Good", "Very good"] },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{item.label}</span>
                  <span>{item.options[item.value]}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={item.options.length - 1}
                  step={1}
                  value={item.value}
                  onChange={(e) => item.set(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            ))}
            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={simulate}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={runner.loading}
              >
                {runner.loading ? "Simulating..." : "Run simulation"}
              </button>
            </div>

            <div className="space-y-3">
              <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
              <ComputeSummaryPanel toolId="software-tradeoff-sim" summary={runner.compute.post} />
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <p className="text-sm font-semibold text-slate-900">Results</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-sky-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900">Complexity</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{computed.complexity}</p>
                <p className="text-sm text-slate-700">{scoreToLabel(computed.complexity)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900">Risk</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{computed.risk}</p>
                <p className="text-sm text-slate-700">{scoreToLabel(computed.risk)}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900">Cost</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{computed.cost}</p>
                <p className="text-sm text-slate-700">{scoreToLabel(computed.cost)}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{computed.recommendation}</p>
              <p className="mt-2 text-xs text-slate-600">
                This is a teaching tool. Use it to explain why you picked an approach, then validate with real constraints, tests, and stakeholder input.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">How to reduce compute and complexity</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {reduceTips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Common pitfalls</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Optimising for one metric and pretending it has no side effects.</li>
              <li>Choosing microservices to feel advanced rather than to solve a real constraint.</li>
              <li>Ignoring security and reliability until after the first incident.</li>
              <li>Assuming cost is only hosting. People time is the expensive part.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



