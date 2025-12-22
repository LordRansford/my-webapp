"use client";

import React, { useMemo, useState } from "react";
import { Shield, Search, Wrench } from "lucide-react";

type ControlType = "Preventive" | "Detective" | "Corrective";
type ControlClass = "Administrative" | "Technical";

const controlLibrary: Array<{ name: string; type: ControlType; cls: ControlClass; mapsTo: string }> = [
  { name: "MFA", type: "Preventive", cls: "Technical", mapsTo: "Account takeover" },
  { name: "Least privilege roles", type: "Preventive", cls: "Administrative", mapsTo: "Insider misuse" },
  { name: "Input validation", type: "Preventive", cls: "Technical", mapsTo: "Injection risks" },
  { name: "Central logging", type: "Detective", cls: "Technical", mapsTo: "Unknown compromise" },
  { name: "Alert triage playbook", type: "Detective", cls: "Administrative", mapsTo: "Alert fatigue" },
  { name: "Backups with test restores", type: "Corrective", cls: "Technical", mapsTo: "Ransomware and outages" },
  { name: "Incident response runbook", type: "Corrective", cls: "Administrative", mapsTo: "Slow response" },
];

export default function DefensiveControlsLab() {
  const [risk, setRisk] = useState("Account takeover");
  const [filterType, setFilterType] = useState<ControlType | "All">("All");
  const [filterClass, setFilterClass] = useState<ControlClass | "All">("All");

  const filtered = useMemo(() => {
    return controlLibrary.filter((c) => {
      if (filterType !== "All" && c.type !== filterType) return false;
      if (filterClass !== "All" && c.cls !== filterClass) return false;
      if (risk && !c.mapsTo.toLowerCase().includes(risk.toLowerCase())) return true;
      return true;
    });
  }, [filterType, filterClass, risk]);

  const mapToRisk = useMemo(() => {
    const relevant = controlLibrary.filter((c) => c.mapsTo.toLowerCase().includes(risk.toLowerCase()));
    if (!relevant.length) return "Pick a risk and see which controls reduce it.";
    const prev = relevant.filter((c) => c.type === "Preventive").map((c) => c.name);
    const det = relevant.filter((c) => c.type === "Detective").map((c) => c.name);
    const cor = relevant.filter((c) => c.type === "Corrective").map((c) => c.name);
    return `For "${risk}": Prevent (${prev.join(", ") || "none"}), Detect (${det.join(", ") || "none"}), Recover (${cor.join(", ") || "none"}).`;
  }, [risk]);

  return (
    <section className="space-y-6" aria-label="Defensive controls lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Defensive controls</h2>
        </div>
        <p className="text-sm text-slate-700">
          Controls exist to reduce risk. Map them to threats and to outcomes. Then make sure you can operate them consistently.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">1. Control types</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {[
                { label: "Preventive", icon: Shield, note: "Stops or reduces likelihood." },
                { label: "Detective", icon: Search, note: "Finds issues quickly." },
                { label: "Corrective", icon: Wrench, note: "Restores service and reduces impact." },
              ].map((x) => (
                <div key={x.label} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <div className="flex items-center gap-2">
                    <x.icon className="h-5 w-5 text-slate-700" aria-hidden="true" />
                    <p className="text-sm font-semibold text-slate-900">{x.label}</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-700">{x.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <h3 className="text-xl font-semibold text-slate-900">2. Map controls to a risk</h3>
            <p className="text-sm text-slate-700">
              Pick a risk statement and see which controls reduce likelihood, improve detection, or speed recovery.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1 md:col-span-2">
                <span className="text-xs font-semibold text-slate-700">Risk</span>
                <input value={risk} onChange={(e) => setRisk(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Mapping</p>
                <p className="mt-2 text-sm text-slate-700">{mapToRisk}</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Type</span>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {["All", "Preventive", "Detective", "Corrective"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Class</span>
                <select value={filterClass} onChange={(e) => setFilterClass(e.target.value as any)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  {["All", "Administrative", "Technical"].map((x) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm text-slate-800">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Control</th>
                    <th className="px-3 py-2 text-left font-semibold">Type</th>
                    <th className="px-3 py-2 text-left font-semibold">Class</th>
                    <th className="px-3 py-2 text-left font-semibold">Maps to</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.name} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">{c.name}</td>
                      <td className="px-3 py-2">{c.type}</td>
                      <td className="px-3 py-2">{c.cls}</td>
                      <td className="px-3 py-2">{c.mapsTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Control realism</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Controls must be owned and tested, not only documented.</li>
              <li>Administrative controls shape behavior and accountability.</li>
              <li>Technical controls need monitoring, updates, and incident learning.</li>
              <li>Do not rely on one control. Layer them based on threats and trust boundaries.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



