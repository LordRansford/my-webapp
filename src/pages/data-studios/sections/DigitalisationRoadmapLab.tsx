"use client";

import React, { useMemo, useState } from "react";
import { Compass, ListChecks, TrendingUp } from "lucide-react";
import { useToolRunner } from "@/hooks/useToolRunner";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";

type Capability =
  | "Clear purpose and outcomes"
  | "Defined ownership"
  | "Data quality controls"
  | "Metadata and lineage"
  | "Access control and auditing"
  | "Analytics with decision owners"
  | "Reliable delivery and operations";

const capabilities: Capability[] = [
  "Clear purpose and outcomes",
  "Defined ownership",
  "Data quality controls",
  "Metadata and lineage",
  "Access control and auditing",
  "Analytics with decision owners",
  "Reliable delivery and operations",
];

function label(v: number) {
  if (v < 40) return "Early";
  if (v < 70) return "Developing";
  return "Strong";
}

export default function DigitalisationRoadmapLab() {
  const runner = useToolRunner({ minIntervalMs: 600, timeoutMs: 6000, toolId: "data-roadmap-sim" });
  const [maturity, setMaturity] = useState<Record<Capability, number>>(
    Object.fromEntries(capabilities.map((c) => [c, 40])) as Record<Capability, number>
  );
  const [constraints, setConstraints] = useState({ budget: 2, risk: 2, urgency: 2 });
  const [plan, setPlan] = useState<string[]>([]);

  const overall = useMemo(() => {
    const vals = Object.values(maturity);
    const avg = Math.round(vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length));
    return avg;
  }, [maturity]);

  const topGaps = useMemo(() => {
    return Object.entries(maturity)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3)
      .map(([k]) => k as Capability);
  }, [maturity]);

  const runSimulation = async () => {
    runner.resetError();
    const meta = { inputBytes: 600, steps: 60, expectedWallMs: 650 };
    runner.prepare(meta);
    const out = await runner.run(async () => {
      const budget = constraints.budget;
      const risk = constraints.risk;
      const urgency = constraints.urgency;

      const picks: string[] = [];
      const gapSet = new Set(topGaps);

      if (gapSet.has("Defined ownership")) picks.push("Assign a named owner and steward for each critical dataset and KPI.");
      if (gapSet.has("Data quality controls")) picks.push("Add validation at source for required fields and monitoring for null rates and freshness.");
      if (gapSet.has("Metadata and lineage")) picks.push("Capture lineage for critical pipelines and define a minimal metadata standard.");

      if (risk >= 3) picks.push("Strengthen access control reviews and auditing for sensitive datasets before expanding analytics.");
      if (urgency >= 3 && budget <= 2) picks.push("Prioritise one high-value service flow and deliver a small, governed improvement in 4 to 6 weeks.");
      if (budget >= 3) picks.push("Invest in platform reliability: CI/CD for data pipelines, incident playbooks, and on-call ownership.");

      // Keep it bounded and teaching oriented.
      return { picks: Array.from(new Set(picks)).slice(0, 6) };
    }, meta);

    if (out?.picks) setPlan(out.picks);
  };

  return (
    <section className="space-y-6" aria-label="Digitalisation maturity and roadmap lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-amber-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Digitalisation maturity and roadmap</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab helps you assess capability gaps and prioritise improvements. The goal is to avoid technology-first plans without ownership and controls.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Assess maturity</h3>
            </div>
            <p className="text-sm text-slate-700">
              Score each capability. Low does not mean failure. It means you have a clear starting point for governance-led improvement.
            </p>
            <div className="space-y-3">
              {capabilities.map((c) => (
                <div key={c} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>{c}</span>
                    <span>
                      {maturity[c]}/100 ({label(maturity[c])})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={maturity[c]}
                    onChange={(e) => setMaturity((m) => ({ ...m, [c]: Number(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Overall maturity</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">
                {overall}/100 ({label(overall)})
              </p>
              <p className="mt-2 text-sm text-slate-700">Top gaps: {topGaps.join(", ")}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ListChecks className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Prioritise with constraints</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { key: "budget", label: "Budget", options: ["Tight", "Low", "Medium", "Good", "Strong"] },
                { key: "risk", label: "Risk exposure", options: ["Low", "Some", "Medium", "High", "Very high"] },
                { key: "urgency", label: "Urgency", options: ["Low", "Some", "Medium", "High", "Very high"] },
              ].map((x) => (
                <label key={x.key} className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">{x.label}</span>
                  <input
                    type="range"
                    min={0}
                    max={4}
                    step={1}
                    value={(constraints as any)[x.key]}
                    onChange={(e) => setConstraints((c) => ({ ...c, [x.key]: Number(e.target.value) }))}
                    className="w-full"
                  />
                  <span className="text-xs text-slate-600">{x.options[(constraints as any)[x.key]]}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={runSimulation}
              disabled={runner.loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {runner.loading ? "Planning..." : "Generate a roadmap slice"}
            </button>
            <div className="space-y-3">
              <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
              <ComputeSummaryPanel toolId="data-roadmap-sim" summary={runner.compute.post} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Roadmap slice</p>
              {plan.length ? (
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {plan.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-700">Run the planner to generate a small, governed set of next steps.</p>
              )}
              <p className="mt-2 text-xs text-slate-600">
                This is guidance, not a regulatory claim. Use it to structure discussions and make ownership explicit.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">How digitalisation fails</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Technology-first programmes without owners and standards.</li>
              <li>Dashboards without data quality controls.</li>
              <li>Central platforms without service-level purpose.</li>
              <li>Metrics that push teams to game the system.</li>
              <li>No retention, no access reviews, and no auditability.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Keep it governance-led</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Start with outcomes and decisions.</li>
              <li>Name owners and stewards.</li>
              <li>Define a minimal metadata standard.</li>
              <li>Put quality controls at the boundary.</li>
              <li>Make access and retention explicit.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



