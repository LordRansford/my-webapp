"use client";

import React, { useMemo, useState } from "react";
import { Layers, Split, ShieldCheck } from "lucide-react";

type Concept = "Defence in depth" | "Trust boundaries" | "Segmentation" | "Zero trust";

export default function SecurityArchitectureLab() {
  const [concept, setConcept] = useState<Concept>("Defence in depth");
  const [usability, setUsability] = useState(2);
  const [cost, setCost] = useState(2);
  const [security, setSecurity] = useState(3);

  const copy = useMemo(() => {
    if (concept === "Defence in depth")
      return {
        title: "Defence in depth",
        plain: "Use multiple layers so one failure does not become a full compromise.",
        tech: "Controls at endpoints, identity, network, application, data, monitoring, and recovery.",
      };
    if (concept === "Trust boundaries")
      return {
        title: "Trust boundaries",
        plain: "Mark where trust changes. Validate and log crossings.",
        tech: "Browser to API, API to database, service to service, vendor integrations, admin paths.",
      };
    if (concept === "Segmentation")
      return {
        title: "Segmentation",
        plain: "Reduce blast radius by separating systems and privileges.",
        tech: "Network segmentation, separate accounts/projects, separate data planes, separate admin surfaces.",
      };
    return {
      title: "Zero trust concepts",
      plain: "Assume no implicit trust. Verify explicitly and continuously.",
      tech: "Strong identity, device posture, least privilege, continuous evaluation, short-lived credentials.",
    };
  }, [concept]);

  const tradeoff = useMemo(() => {
    const u = ["Low", "Some", "Medium", "High", "Very high"][usability];
    const c = ["Low", "Some", "Medium", "High", "Very high"][cost];
    const s = ["Low", "Some", "Medium", "High", "Very high"][security];
    if (security >= 4 && usability <= 1) return `You are pushing for very high security with low usability. This often causes workarounds and shadow IT.`;
    if (cost <= 1 && security >= 4) return `Very high security with low cost is hard. Prioritise the highest risk boundaries and keep controls operable.`;
    if (usability >= 4 && security <= 1) return `High usability with low security is not resilient. Add least privilege and logging first.`;
    return `Balanced intent: usability ${u}, cost ${c}, security ${s}. Keep the design simple and verify the most important boundaries.`;
  }, [usability, cost, security]);

  return (
    <section className="space-y-6" aria-label="Security architecture lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Security architecture</h2>
        </div>
        <p className="text-sm text-slate-700">
          Security architecture is how you shape systems so that controls are effective and failures are survivable. It is not a single product.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">1. Core concepts</p>
            <div className="grid gap-3 md:grid-cols-2">
              {(["Defence in depth", "Trust boundaries", "Segmentation", "Zero trust"] as Concept[]).map((x) => (
                <button
                  key={x}
                  type="button"
                  onClick={() => setConcept(x)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    concept === x ? "border-indigo-300 bg-indigo-50 ring-1 ring-indigo-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{x}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{copy.title}</p>
              <p className="mt-2 text-sm text-slate-700">{copy.plain}</p>
              <p className="mt-2 text-sm text-slate-700">{copy.tech}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Split className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Trade-offs</h3>
            </div>
            <p className="text-sm text-slate-700">
              Architecture is trade-offs. Controls that cannot be used will not be used. Controls that cannot be operated will decay.
            </p>
            {[
              { label: "Usability", value: usability, set: setUsability },
              { label: "Cost and complexity", value: cost, set: setCost },
              { label: "Security strength", value: security, set: setSecurity },
            ].map((i) => (
              <div key={i.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{i.label}</span>
                  <span>{["Low", "Some", "Medium", "High", "Very high"][i.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={i.value} onChange={(e) => i.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{tradeoff}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-rose-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Practical cues</p>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Start with identity and logging. They pay off across many threats.</li>
              <li>Segment admin and data planes. Reduce blast radius.</li>
              <li>Prefer smaller trust boundaries over one big perimeter.</li>
              <li>Make recovery part of the design, not a separate project.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



