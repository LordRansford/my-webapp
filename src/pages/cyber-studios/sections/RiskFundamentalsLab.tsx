"use client";

import React, { useMemo, useState } from "react";
import { Scale, Layers, CheckCircle2 } from "lucide-react";
import { useToolRunner } from "@/hooks/useToolRunner";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";

type Treatment = "Treat" | "Transfer" | "Tolerate" | "Terminate";

export default function RiskFundamentalsLab() {
  const runner = useToolRunner({ minIntervalMs: 600, timeoutMs: 6000, toolId: "cyber-risk-sim" });
  const [asset, setAsset] = useState("Customer accounts");
  const [threat, setThreat] = useState("Credential stuffing");
  const [vulnerability, setVulnerability] = useState("Weak password hygiene and no MFA");
  const [likelihood, setLikelihood] = useState(3);
  const [impact, setImpact] = useState(3);
  const [appetite, setAppetite] = useState(2);
  const [treatment, setTreatment] = useState<Treatment>("Treat");
  const [controls, setControls] = useState<string[]>([]);

  const riskScore = useMemo(() => Math.min(25, (likelihood + 1) * (impact + 1)), [likelihood, impact]);
  const appetiteLabel = useMemo(() => ["Very low", "Low", "Medium", "High", "Very high"][appetite], [appetite]);
  const riskLabel = useMemo(() => (riskScore >= 16 ? "High" : riskScore >= 9 ? "Medium" : "Low"), [riskScore]);

  const suggestedControls = useMemo(() => {
    const items: string[] = [];
    items.push("MFA for accounts with higher privilege");
    items.push("Rate limiting and bot detection on login");
    items.push("Credential stuffing monitoring and alerts");
    items.push("Password reset protections and account lockout rules");
    items.push("User messaging and support playbook for takeover events");
    return items;
  }, []);

  const plan = useMemo(() => {
    if (treatment === "Terminate") return "Terminate: remove or redesign the activity that creates this risk.";
    if (treatment === "Transfer") return "Transfer: share the risk via contracts or insurance, but keep technical controls where needed.";
    if (treatment === "Tolerate") return "Tolerate: accept the residual risk because it is within appetite and controls cost more than value.";
    return "Treat: reduce likelihood or impact with controls you can operate, measure, and maintain.";
  }, [treatment]);

  const simulate = async () => {
    runner.resetError();
    const meta = { inputBytes: 700, steps: 70, expectedWallMs: 650 };
    runner.prepare(meta);
    const out = await runner.run(async () => {
      // Local-only simulation: choose a small set of controls based on score and appetite.
      const picks: string[] = [];
      const high = riskScore >= 16;
      const lowAppetite = appetite <= 1;
      if (high || lowAppetite) picks.push("MFA for privileged or high-risk accounts");
      if (high) picks.push("Rate limit + bot detection on login");
      if (riskScore >= 9) picks.push("Logging and alerting on suspicious auth patterns");
      picks.push("Incident response runbook for account takeover");
      return { picks: Array.from(new Set(picks)).slice(0, 5) };
    }, meta);
    if (out?.picks) setControls(out.picks);
  };

  return (
    <section className="space-y-6" aria-label="Risk management fundamentals lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Risk management fundamentals</h2>
        </div>
        <p className="text-sm text-slate-700">
          Risk work is structured and calm. Define the asset, threat, and vulnerability. Then choose a treatment that fits your appetite.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">1. Define the risk</h3>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Asset</span>
                <input value={asset} onChange={(e) => setAsset(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Threat</span>
                <input value={threat} onChange={(e) => setThreat(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Vulnerability</span>
                <input value={vulnerability} onChange={(e) => setVulnerability(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
              </label>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Likelihood</span>
                <input type="range" min={0} max={4} step={1} value={likelihood} onChange={(e) => setLikelihood(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">{["Rare", "Unlikely", "Possible", "Likely", "Almost certain"][likelihood]}</span>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Impact</span>
                <input type="range" min={0} max={4} step={1} value={impact} onChange={(e) => setImpact(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">{["Negligible", "Minor", "Moderate", "Major", "Severe"][impact]}</span>
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Risk score</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{riskScore}/25</p>
                <p className="text-sm text-slate-700">{riskLabel}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Appetite and treatment</h3>
            </div>
            <p className="text-sm text-slate-700">
              Risk appetite is the level of risk an organisation is willing to accept. Treatment is what you do about the specific risk.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Risk appetite</span>
                <input type="range" min={0} max={4} step={1} value={appetite} onChange={(e) => setAppetite(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">{appetiteLabel}</span>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Treatment option</span>
                <select value={treatment} onChange={(e) => setTreatment(e.target.value as Treatment)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {(["Treat", "Transfer", "Tolerate", "Terminate"] as Treatment[]).map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{plan}</p>
              <p className="mt-2 text-xs text-slate-600">
                A good control reduces likelihood or impact, is measurable, and can be operated over time.
              </p>
            </div>
            <button type="button" onClick={simulate} disabled={runner.loading} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300">
              {runner.loading ? "Mapping..." : "Map controls to this risk"}
            </button>
            <div className="space-y-3">
              <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
              <ComputeSummaryPanel toolId="cyber-risk-sim" summary={runner.compute.post} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-900">Suggested controls</p>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {(controls.length ? controls : suggestedControls).map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Tone rule</p>
            <p className="text-sm text-slate-700">
              Avoid fear language. Risk management is about making trade-offs explicit, prioritising work, and tracking residual risk.
            </p>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Treatment options</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Treat: reduce likelihood or impact.</li>
              <li>Transfer: share risk via contracts, providers, or insurance.</li>
              <li>Tolerate: accept residual risk within appetite.</li>
              <li>Terminate: stop the activity that creates the risk.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



