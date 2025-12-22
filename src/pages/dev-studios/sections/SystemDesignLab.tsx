"use client";

import React, { useMemo, useState } from "react";
import { Boxes, Map, ArrowRightLeft } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type ArchStyle = "Monolith" | "Modular monolith" | "Microservices";
type Boundary = { name: string; responsibility: string; talksTo: string };

const styleCopy: Record<ArchStyle, { when: string; tradeoffs: string[]; commonMistake: string }> = {
  Monolith: {
    when: "Best when the team is small, the domain is still changing, and you want fast delivery with fewer moving parts.",
    tradeoffs: ["Simple deployment and debugging", "Can become tightly coupled over time", "Scaling is often coarse-grained"],
    commonMistake: "Treating a monolith as a blob. A good monolith still has boundaries.",
  },
  "Modular monolith": {
    when: "Best when you need strong internal boundaries but want to keep operations simple while the product matures.",
    tradeoffs: ["Clear module contracts", "Single deployable", "Good stepping stone to services when justified"],
    commonMistake: "Calling it modular without enforcing boundaries (no shared database access, no hidden imports).",
  },
  Microservices: {
    when: "Best when you have multiple teams, clear domain boundaries, and operational maturity to handle distributed systems.",
    tradeoffs: ["Independent scaling and deploy", "Operational complexity rises fast", "Observability and coordination become mandatory"],
    commonMistake: "Splitting too early. You end up with distributed spaghetti and slower delivery.",
  },
};

const defaultBoundaries: Boundary[] = [
  { name: "Web app", responsibility: "UI, session, client-side state", talksTo: "API" },
  { name: "API", responsibility: "Request handling, validation, auth, orchestration", talksTo: "Orders, Catalogue" },
  { name: "Catalogue", responsibility: "Books, search, stock read models", talksTo: "Database" },
  { name: "Orders", responsibility: "Order lifecycle, payments orchestration, idempotency", talksTo: "Database, Events" },
  { name: "Events", responsibility: "Async notifications and integrations", talksTo: "Email provider" },
];

export default function SystemDesignLab() {
  const [style, setStyle] = useState<ArchStyle>("Modular monolith");
  const [boundaries, setBoundaries] = useState<Boundary[]>(defaultBoundaries);
  const [draft, setDraft] = useState<Boundary>({ name: "", responsibility: "", talksTo: "" });

  const addBoundary = () => {
    const name = draft.name.trim();
    if (!name) return;
    setBoundaries((prev) => [...prev, { name, responsibility: draft.responsibility.trim(), talksTo: draft.talksTo.trim() }]);
    setDraft({ name: "", responsibility: "", talksTo: "" });
  };

  const smells = useMemo(() => {
    const s: string[] = [];
    const names = boundaries.map((b) => b.name.toLowerCase());
    if (names.some((n) => n.includes("database")) && names.some((n) => n.includes("web"))) {
      s.push("If the web app talks to the database directly, you lose control over validation, auth, and change safety.");
    }
    const hasEvents = boundaries.some((b) => b.name.toLowerCase().includes("event"));
    if (!hasEvents) s.push("If everything is synchronous, spikes and failures propagate. Consider an async boundary for notifications.");
    if (style === "Microservices" && boundaries.length < 4) s.push("Microservices without clear boundaries usually means you split too early.");
    return s.length ? s : ["Looks sensible. Next, make the interfaces explicit and decide where failure can happen safely."];
  }, [boundaries, style]);

  return (
    <section aria-label="Architecture and system design lab" className="space-y-6">
      <SecurityBanner />

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Boxes className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Architecture and system design</h2>
        </div>
        <p className="text-sm text-slate-700">
          This lab teaches boundaries and data flow. The goal is not a perfect diagram. The goal is a design you can defend under pressure.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Choose an architecture style</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {(["Monolith", "Modular monolith", "Microservices"] as ArchStyle[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`rounded-2xl border px-4 py-3 text-left transition ${
                    style === s ? "border-sky-300 bg-sky-50 ring-1 ring-sky-200" : "border-slate-200 bg-slate-50/60"
                  }`}
                >
                  <p className="text-sm font-semibold text-slate-900">{s}</p>
                  <p className="mt-1 text-sm text-slate-700">{styleCopy[s].when}</p>
                </button>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Trade-offs</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {styleCopy[style].tradeoffs.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <p className="mt-2 text-sm text-amber-700 font-semibold">Common mistake: {styleCopy[style].commonMistake}</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Define boundaries and responsibilities</h3>
            </div>
            <p className="text-sm text-slate-700">Each boundary should have a responsibility and a small set of explicit connections.</p>
            <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
              <table className="min-w-full text-sm text-slate-800">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Component</th>
                    <th className="px-3 py-2 text-left font-semibold">Responsibility</th>
                    <th className="px-3 py-2 text-left font-semibold">Talks to</th>
                  </tr>
                </thead>
                <tbody>
                  {boundaries.map((b, idx) => (
                    <tr key={`${b.name}-${idx}`} className="border-t border-slate-100">
                      <td className="px-3 py-2 font-semibold">{b.name}</td>
                      <td className="px-3 py-2">{b.responsibility}</td>
                      <td className="px-3 py-2">{b.talksTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              <input
                value={draft.name}
                onChange={(e) => setDraft((p) => ({ ...p, name: e.target.value }))}
                placeholder="Component"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <input
                value={draft.responsibility}
                onChange={(e) => setDraft((p) => ({ ...p, responsibility: e.target.value }))}
                placeholder="Responsibility"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              <input
                value={draft.talksTo}
                onChange={(e) => setDraft((p) => ({ ...p, talksTo: e.target.value }))}
                placeholder="Talks to"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <button type="button" onClick={addBoundary} className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Add boundary
            </button>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Data flow sketch</p>
              <p className="mt-1 text-sm text-slate-700">
                This is a simple reading order. In real systems, you will also have background jobs, retries, and asynchronous events.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-700">
                {boundaries.slice(0, 6).map((b, idx) => (
                  <React.Fragment key={`${b.name}-${idx}`}>
                    <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">{b.name}</span>
                    {idx < Math.min(boundaries.length, 6) - 1 ? <span aria-hidden="true">→</span> : null}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Decision cues</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>If you cannot name boundaries clearly, you are not ready for microservices.</li>
              <li>If you have sensitive data, design authz and auditing before you design caching.</li>
              <li>If you expect spikes, introduce async boundaries where users will not notice delay.</li>
              <li>Good design is visible in failure behavior, not only in happy-path diagrams.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Smells</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {smells.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



