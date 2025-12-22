"use client";

import React, { useMemo, useState } from "react";
import { Boxes, ArrowRightLeft, Database } from "lucide-react";

type Pattern = "Operational store" | "Analytical store" | "Reference and master data" | "Pipelines" | "Integration patterns";

export default function DataArchitectureLab() {
  const [focus, setFocus] = useState<Pattern>("Operational store");
  const [integration, setIntegration] = useState<"batch" | "event" | "api">("api");
  const [latencyNeed, setLatencyNeed] = useState(2);
  const [changeRate, setChangeRate] = useState(2);

  const focusCopy = useMemo(() => {
    if (focus === "Operational store") {
      return {
        title: "Operational data store (ODS)",
        points: [
          "Optimised for transactions and day-to-day service delivery.",
          "Strong validation at the boundary reduces downstream cleaning costs.",
          "Schema changes must be controlled because operations depend on it.",
        ],
        tradeoff: "Operational stores prioritise correctness and availability. They are not the best place for heavy analytics.",
      };
    }
    if (focus === "Analytical store") {
      return {
        title: "Analytical data store",
        points: [
          "Optimised for queries, aggregation, and long time horizons.",
          "Can tolerate delayed data if it is consistent and well defined.",
          "Good for KPIs, trends, and cross-domain analysis.",
        ],
        tradeoff: "Analytics needs stable definitions. If your operational meanings are fuzzy, your dashboards will argue back.",
      };
    }
    if (focus === "Reference and master data") {
      return {
        title: "Reference and master data",
        points: [
          "Reference data: stable code lists and controlled vocabularies.",
          "Master data: core entities used across the organisation (people, locations, products).",
          "Without a shared source of truth, integration becomes a guessing game.",
        ],
        tradeoff: "Master data governance is political. It needs ownership and clear change control.",
      };
    }
    if (focus === "Pipelines") {
      return {
        title: "Data pipelines (conceptual)",
        points: [
          "Extract, validate, transform, and load with clear contracts between stages.",
          "Prefer observable pipelines: you should know what failed and why.",
          "Keep raw inputs for traceability, but apply retention and access rules.",
        ],
        tradeoff: "Pipelines create operational burden. Only build them when the decision value justifies the maintenance.",
      };
    }
    return {
      title: "Integration patterns",
      points: [
        "APIs for real-time access when users need immediate feedback.",
        "Events for decoupling and resilience when systems can be eventually consistent.",
        "Batch for cost-effective, predictable processing when time sensitivity is low.",
      ],
      tradeoff: "Integration is a source of risk. Choose the simplest pattern that meets the outcome and control needs.",
    };
  }, [focus]);

  const recommendation = useMemo(() => {
    const latency = ["Low", "Some", "Medium", "High", "Very high"][latencyNeed];
    const change = ["Slow", "Some", "Medium", "Fast", "Very fast"][changeRate];
    if (integration === "batch" && latencyNeed >= 3) return `Batch is risky here because latency need is ${latency}. Prefer APIs or events for responsiveness.`;
    if (integration === "event" && changeRate <= 1) return `Events can still work, but if change rate is ${change} you may prefer simpler API integration.`;
    if (integration === "api" && changeRate >= 3) return `APIs will work, but you will need versioning and backward compatibility because change rate is ${change}.`;
    return "This looks reasonable. The key is to make contracts explicit and measure the cost of failure.";
  }, [integration, latencyNeed, changeRate]);

  return (
    <section className="space-y-6" aria-label="Data architecture lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Data architecture</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab explains how data is organised for operations, analytics, and governance. The goal is clarity: which store exists for which purpose.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Choose a topic</p>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                ["Operational store", "Analytical store", "Reference and master data", "Pipelines", "Integration patterns"] as Pattern[]
              ).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFocus(p)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    focus === p ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{p}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-slate-700" aria-hidden="true" />
                <p className="text-sm font-semibold text-slate-900">{focusCopy.title}</p>
              </div>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {focusCopy.points.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-amber-700 font-semibold">{focusCopy.tradeoff}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">Integration choice sketch</h3>
            </div>
            <p className="text-sm text-slate-700">
              Use this to practice trade-offs: latency, change, and cost. The right answer depends on context.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Pattern</span>
                <select
                  value={integration}
                  onChange={(e) => setIntegration(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  <option value="api">API</option>
                  <option value="event">Event</option>
                  <option value="batch">Batch</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Latency need</span>
                <input type="range" min={0} max={4} step={1} value={latencyNeed} onChange={(e) => setLatencyNeed(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">
                  {["Low", "Some", "Medium", "High", "Very high"][latencyNeed]}
                </span>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Change rate</span>
                <input type="range" min={0} max={4} step={1} value={changeRate} onChange={(e) => setChangeRate(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">
                  {["Slow", "Some", "Medium", "Fast", "Very fast"][changeRate]}
                </span>
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{recommendation}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Trade-offs to explain out loud</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Simplicity vs scale: fewer parts are easier to govern.</li>
              <li>Latency vs cost: faster often costs more and increases operational risk.</li>
              <li>Flexibility vs standardisation: freedom without standards breaks integration.</li>
              <li>Innovation vs assurance: regulated environments require traceability.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Common mistakes</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Using the analytical store as an operational database.</li>
              <li>Building pipelines before agreeing definitions and owners.</li>
              <li>Assuming integration is solved by buying a tool.</li>
              <li>Ignoring reference data until KPIs fail audits.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



