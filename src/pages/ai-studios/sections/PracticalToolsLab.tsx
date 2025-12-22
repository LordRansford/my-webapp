"use client";

import React, { useMemo, useState } from "react";
import { useToolRunner } from "@/hooks/useToolRunner";
import ComputeEstimatePanel from "@/components/compute/ComputeEstimatePanel";
import ComputeSummaryPanel from "@/components/compute/ComputeSummaryPanel";
import { GitCompare, Repeat, Scale, Rows3 } from "lucide-react";

function hashCode(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function jitter(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function PracticalToolsLab() {
  const [tool, setTool] = useState<"Prompt compare" | "Consistency test" | "Bias explorer" | "Behaviour compare">("Prompt compare");
  const [promptA, setPromptA] = useState("Summarise the email politely and list the action items.");
  const [promptB, setPromptB] = useState("Summarise the email. List action items and deadlines. If unsure, say so.");
  const [input, setInput] = useState("Hi team, please update the Q1 slides and send them by Friday. Also, confirm who is presenting.");
  const [runs, setRuns] = useState(5);
  const [scenario, setScenario] = useState("Loan approval assistant");
  const [groupGap, setGroupGap] = useState(2);
  const [outputs, setOutputs] = useState<string[]>([]);

  // NOTE: compute-quality requires literal toolId values in useToolRunner calls.
  const promptCompareRunner = useToolRunner({ minIntervalMs: 500, timeoutMs: 8000, toolId: "ai-prompt-compare" });
  const consistencyRunner = useToolRunner({ minIntervalMs: 500, timeoutMs: 8000, toolId: "ai-consistency-test" });
  const biasRunner = useToolRunner({ minIntervalMs: 500, timeoutMs: 8000, toolId: "ai-bias-sim" });
  const behaviourRunner = useToolRunner({ minIntervalMs: 500, timeoutMs: 8000, toolId: "ai-behaviour-compare" });

  const runner = useMemo(() => {
    if (tool === "Prompt compare") return promptCompareRunner;
    if (tool === "Consistency test") return consistencyRunner;
    if (tool === "Bias explorer") return biasRunner;
    return behaviourRunner;
  }, [tool, promptCompareRunner, consistencyRunner, biasRunner, behaviourRunner]);

  const toolId = useMemo(() => {
    if (tool === "Prompt compare") return "ai-prompt-compare";
    if (tool === "Consistency test") return "ai-consistency-test";
    if (tool === "Bias explorer") return "ai-bias-sim";
    return "ai-behaviour-compare";
  }, [tool]);

  const disclaimer = useMemo(() => {
    return "These tools are illustrative and simulated. They do not call external AI models. Use them to practise thinking and evaluation habits.";
  }, []);

  const run = async () => {
    runner.resetError();
    const baseText = `${tool}|${promptA}|${promptB}|${input}|${scenario}|${groupGap}|${runs}`;
    const inputBytes = Math.min(12_000, baseText.length * 2);
    const steps = tool === "Consistency test" ? Math.max(1, Math.min(25, runs)) * 20 : 80;
    const meta = { inputBytes, steps, expectedWallMs: 700 + steps * 3 };
    runner.prepare(meta);

    const out = await runner.run(async () => {
      const seed = hashCode(baseText);
      const lines: string[] = [];

      if (tool === "Prompt compare") {
        const delta = Math.round(jitter(seed + 1) * 100);
        lines.push(`Prompt A: tends to be ${delta < 50 ? "more polite" : "more direct"} in tone.`);
        lines.push(`Prompt B: tends to be ${delta < 50 ? "more structured" : "more cautious"} about uncertainty.`);
        lines.push("Interpretation: small wording changes can shift behaviour. Standardise prompts and test variants.");
      } else if (tool === "Consistency test") {
        const n = Math.max(2, Math.min(10, runs));
        for (let i = 0; i < n; i += 1) {
          const v = Math.round(jitter(seed + i + 10) * 100);
          lines.push(`Run ${i + 1}: output variant score ${v}/100`);
        }
        lines.push("Interpretation: variation is normal. Decide what variability is acceptable for the task.");
      } else if (tool === "Bias explorer") {
        const gap = groupGap;
        const base = 70;
        const groupA = base + Math.round(jitter(seed + 2) * 10) - gap * 3;
        const groupB = base + Math.round(jitter(seed + 3) * 10) + gap * 3;
        lines.push(`Scenario: ${scenario}`);
        lines.push(`Group A: illustrative acceptance rate ${Math.max(0, Math.min(100, groupA))}%`);
        lines.push(`Group B: illustrative acceptance rate ${Math.max(0, Math.min(100, groupB))}%`);
        lines.push("Interpretation: check base rates, labels, and decision thresholds. Add human review for high impact cases.");
      } else {
        const r1 = Math.round(jitter(seed + 4) * 100);
        const r2 = Math.round(jitter(seed + 5) * 100);
        lines.push("Model X: tends to be concise and confident.");
        lines.push("Model Y: tends to hedge more and provide more caveats.");
        lines.push(`Illustrative disagreement rate: ${Math.abs(r1 - r2)}%`);
        lines.push("Interpretation: pick behaviour that matches the use case, then test edge cases and quiet failures.");
      }

      return lines;
    }, meta);

    if (Array.isArray(out)) setOutputs(out);
  };

  return (
    <section className="space-y-6" aria-label="Practical experimentation tools">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <h2 className="text-2xl font-semibold text-slate-900">Practical experimentation tools</h2>
        <p className="text-sm text-slate-700">
          Lightweight tools to practise evaluation habits: compare prompts, measure variability, explore bias scenarios, and compare behaviours.
        </p>
        <p className="text-xs text-slate-600">{disclaimer}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(["Prompt compare", "Consistency test", "Bias explorer", "Behaviour compare"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTool(t)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    tool === t ? "border-indigo-300 bg-indigo-50 text-indigo-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tool === "Prompt compare" ? (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Prompt A</span>
                  <textarea value={promptA} onChange={(e) => setPromptA(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Prompt B</span>
                  <textarea value={promptB} onChange={(e) => setPromptB(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
                <label className="space-y-1 md:col-span-2">
                  <span className="text-xs font-semibold text-slate-700">Input text</span>
                  <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
              </div>
            ) : null}

            {tool === "Consistency test" ? (
              <div className="space-y-3">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Prompt</span>
                  <textarea value={promptA} onChange={(e) => setPromptA(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Runs</span>
                  <span>{runs}</span>
                </div>
                <input type="range" min={2} max={10} step={1} value={runs} onChange={(e) => setRuns(Number(e.target.value))} className="w-full" />
              </div>
            ) : null}

            {tool === "Bias explorer" ? (
              <div className="space-y-3">
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Scenario</span>
                  <input value={scenario} onChange={(e) => setScenario(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>Illustrative group gap</span>
                  <span>{["Very low", "Low", "Medium", "High", "Very high"][groupGap]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={groupGap} onChange={(e) => setGroupGap(Number(e.target.value))} className="w-full" />
              </div>
            ) : null}

            {tool === "Behaviour compare" ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  This is simulated. It demonstrates how different systems can produce different styles and failure modes, even when both look “good”.
                </p>
                <label className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">Task prompt</span>
                  <textarea value={promptA} onChange={(e) => setPromptA(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200" />
                </label>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={run}
                disabled={runner.loading}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {runner.loading ? "Running..." : "Run"}
              </button>
              <span className="text-xs text-slate-600">No external calls. No secrets. Local only.</span>
            </div>

            <div className="space-y-3">
              <ComputeEstimatePanel estimate={runner.compute.pre || runner.compute.live} />
              <ComputeSummaryPanel toolId={toolId} summary={runner.compute.post} />
            </div>

            {outputs.length ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-900">Results</p>
                <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                  {outputs.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">What each tool reinforces</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-slate-700" aria-hidden="true" />
                Prompt compare: sensitivity to wording and structure.
              </li>
              <li className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-slate-700" aria-hidden="true" />
                Consistency test: variability and acceptable tolerance.
              </li>
              <li className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-slate-700" aria-hidden="true" />
                Bias explorer: group impacts and error costs.
              </li>
              <li className="flex items-center gap-2">
                <Rows3 className="h-4 w-4 text-slate-700" aria-hidden="true" />
                Behaviour compare: style differences and quiet failures.
              </li>
            </ul>
            <p className="text-xs text-slate-600">
              Warning: these outputs are illustrative. Use real evaluation for production decisions.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


