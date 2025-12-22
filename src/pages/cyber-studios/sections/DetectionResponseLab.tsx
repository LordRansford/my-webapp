"use client";

import React, { useMemo, useState } from "react";
import { Siren, Activity, Bell } from "lucide-react";

export default function DetectionResponseLab() {
  const [logging, setLogging] = useState(2);
  const [alerting, setAlerting] = useState(2);
  const [triage, setTriage] = useState(1);
  const [postmortem, setPostmortem] = useState(true);

  const fatigueRisk = useMemo(() => {
    if (alerting >= 3 && triage <= 1) return "High risk of alert fatigue. Too many alerts without triage capacity causes missed incidents.";
    if (logging <= 1) return "Low logging means low evidence. You will struggle to answer what happened during an incident.";
    if (alerting <= 1) return "Low alerting means incidents are found by users. That increases impact and reputation damage.";
    return "Balanced approach. Keep alerts actionable and attach runbooks to the most important ones.";
  }, [logging, alerting, triage]);

  const practice = useMemo(() => {
    const items: string[] = [];
    items.push("Log authentication events and privilege changes.");
    items.push("Collect request identifiers so you can trace user-facing failures.");
    items.push("Start with a small set of high-signal alerts tied to user pain and security boundaries.");
    items.push("After incidents, write down what would have reduced detection time or blast radius.");
    return items;
  }, []);

  return (
    <section className="space-y-6" aria-label="Detection and response lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Siren className="h-5 w-5 text-rose-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Detection and response</h2>
        </div>
        <p className="text-sm text-slate-700">
          Prevention is not enough. Detection makes incidents smaller. Response makes learning repeatable.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Signals and trade-offs</h3>
            </div>
            {[
              { label: "Logging depth", value: logging, set: setLogging, options: ["Minimal", "Basic", "Normal", "Verbose", "Very verbose"] },
              { label: "Alerting coverage", value: alerting, set: setAlerting, options: ["None", "Minimal", "Some", "Broad", "Very broad"] },
              { label: "Triage capacity", value: triage, set: setTriage, options: ["Low", "Some", "Medium", "High", "Very high"] },
            ].map((x) => (
              <div key={x.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-700">
                  <span>{x.label}</span>
                  <span>{x.options[x.value]}</span>
                </div>
                <input type="range" min={0} max={4} step={1} value={x.value} onChange={(e) => x.set(Number(e.target.value))} className="w-full" />
              </div>
            ))}
            <label className="flex items-center gap-2 text-sm text-slate-800">
              <input type="checkbox" checked={postmortem} onChange={(e) => setPostmortem(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
              Run post-incident reviews and track actions
            </label>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Interpretation</p>
              <p className="mt-2 text-sm text-slate-700">{fatigueRisk}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Response basics</h3>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Contain: stop the bleeding (disable keys, block abuse, isolate systems).</li>
              <li>Eradicate: remove the root cause (patch, rotate credentials, fix access control).</li>
              <li>Recover: restore service safely (monitor, validate, communicate).</li>
              <li>Learn: update controls, runbooks, and detection based on evidence.</li>
            </ul>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">First alerts to implement</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {practice.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Alert fatigue rule</p>
            <p className="text-sm text-slate-700">
              If an alert does not have an owner, a runbook, and a clear action, it is not an alert. It is noise.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



