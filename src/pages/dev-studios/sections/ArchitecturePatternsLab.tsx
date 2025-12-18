"use client";

import React, { useMemo, useState } from "react";
import { BookOpen, ListChecks, ShieldCheck, Sparkles, Table2 } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

type ComponentRow = {
  name: string;
  layer: "Presentation" | "Domain" | "Data" | "Integration";
  talksTo: string;
};

type Decision = {
  title: string;
  category: "Security" | "Performance" | "Cost" | "Operations" | "UX";
  why: string;
};

const initialComponents: ComponentRow[] = [
  { name: "Web App", layer: "Presentation", talksTo: "API Gateway" },
  { name: "API Gateway", layer: "Integration", talksTo: "Order Service" },
  { name: "Order Service", layer: "Domain", talksTo: "Postgres DB" },
  { name: "User Service", layer: "Domain", talksTo: "Postgres DB" },
  { name: "Notification Worker", layer: "Domain", talksTo: "Message Queue" },
  { name: "Postgres DB", layer: "Data", talksTo: "Order Service" },
  { name: "Message Queue", layer: "Integration", talksTo: "Notification Worker" },
];

const entityHints = [
  "Name things after the domain, not after tables.",
  "Keep secrets (passwords, cards) out of domain objects; hand off to secure services.",
  "Avoid leaking DB jargon like tbl_user into the model.",
  "Start small, refactor names when they get fuzzy.",
];

const initialDecisions: Decision[] = [
  { title: "Use a message queue for notifications", category: "Operations", why: "Decouple spikes and avoid blocking order flows." },
  { title: "Use Postgres over NoSQL", category: "Cost", why: "Simple relational data with ACID; fewer moving parts for now." },
];

const layers: ComponentRow["layer"][] = ["Presentation", "Domain", "Data", "Integration"];

export default function ArchitecturePatternsLab() {
  const [components, setComponents] = useState<ComponentRow[]>(initialComponents);
  const [decisions, setDecisions] = useState<Decision[]>(initialDecisions);
  const [decisionDraft, setDecisionDraft] = useState<Decision>({
    title: "",
    category: "Security",
    why: "",
  });

  const smells = useMemo(() => {
    const issues: string[] = [];
    const dbCalls = components.find((c) => c.name === "Web App" && c.talksTo.toLowerCase().includes("db"));
    if (dbCalls) issues.push("Direct Web App → DB is brittle. Route via API/Domain instead.");
    const queueUsed = components.find((c) => c.name === "Message Queue");
    if (!queueUsed) issues.push("No queue means the Notification Worker might block the request path.");
    return issues.length ? issues : ["Looks sensible. Keep boundaries explicit and add observability early."];
  }, [components]);

  const addDecision = () => {
    if (!decisionDraft.title.trim() || !decisionDraft.why.trim()) return;
    setDecisions((prev) => [...prev, decisionDraft]);
    setDecisionDraft({ title: "", category: "Security", why: "" });
  };

  return (
    <section aria-labelledby="architecture-lab-title" className="space-y-6">
      <SecurityBanner />

      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-800 ring-1 ring-indigo-100">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Architecture Lab
        </div>
        <h2 id="architecture-lab-title" className="text-xl font-semibold text-slate-900">
          BookTrack - sketch it before you build it
        </h2>
        <p className="text-sm text-slate-700">
          Start with the story, map the components, and capture decisions. We keep it light, local, and security-aware from the very first napkin sketch.
        </p>
      </header>

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <BookOpen className="h-4 w-4 text-emerald-600" aria-hidden="true" />
          Start with the story
        </div>
        <p className="text-sm text-slate-700">
          BookTrack lets people browse books, place orders, and track shipments. There’s a web app, an API gateway, a couple of small services, a Postgres database,
          and a background worker to send notifications. We think about security, data, and digitalisation from the start so nobody has to bolt it on later.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Table2 className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            System landscape canvas
          </div>
          <p className="text-sm text-slate-700">Adjust the layers and links for BookTrack. Keep web traffic off the DB and use queues for async work.</p>
          <div className="overflow-auto rounded-2xl border border-slate-100">
            <table className="min-w-full text-sm text-slate-800">
              <thead className="bg-slate-50 text-xs font-semibold text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left">Component</th>
                  <th className="px-3 py-2 text-left">Layer</th>
                  <th className="px-3 py-2 text-left">Talks to</th>
                  <th className="px-3 py-2 text-left">Badge</th>
                </tr>
              </thead>
              <tbody>
                {components.map((row, idx) => (
                  <tr key={row.name} className="border-t border-slate-100">
                    <td className="px-3 py-2 font-semibold">{row.name}</td>
                    <td className="px-3 py-2">
                      <select
                        aria-label={`Layer for ${row.name}`}
                        value={row.layer}
                        onChange={(e) =>
                          setComponents((prev) => prev.map((c, i) => (i === idx ? { ...c, layer: e.target.value as ComponentRow["layer"] } : c)))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        {layers.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <select
                        aria-label={`Talks to for ${row.name}`}
                        value={row.talksTo}
                        onChange={(e) =>
                          setComponents((prev) => prev.map((c, i) => (i === idx ? { ...c, talksTo: e.target.value } : c)))
                        }
                        className="w-full rounded-xl border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      >
                        {components.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          row.name === "Web App" && row.talksTo.toLowerCase().includes("db")
                            ? "bg-amber-50 text-amber-800 ring-1 ring-amber-100"
                            : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        }`}
                      >
                        {row.name === "Web App" && row.talksTo.toLowerCase().includes("db") ? "Might be a problem" : "Looks sensible"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-700">
            What this is telling you: keep the Web App away from the DB, let the API/Domain own business rules, and use queues so spikes in notifications do not break checkout. Queues and gateways add resilience; tight coupling to the DB does not.
          </p>
        </div>

        <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <ListChecks className="h-4 w-4 text-emerald-600" aria-hidden="true" />
            Domain model sandbox
          </div>
          <p className="text-sm text-slate-700">Pre-seeded for BookTrack: tune it, but keep language clean.</p>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3">
              {[
                { name: "Customer", attrs: "name, email", rel: "places Order" },
                { name: "Book", attrs: "title, author, price, isbn", rel: "is included in Order" },
                { name: "Order", attrs: "total, status, placedAt", rel: "has Shipment" },
                { name: "Shipment", attrs: "carrier, trackingCode, eta", rel: "fulfills Order" },
              ].map((e) => (
                <div key={e.name} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
                  <p className="text-sm font-semibold text-slate-900">{e.name}</p>
                  <p className="text-xs text-slate-700">Attributes: {e.attrs}</p>
                  <p className="text-xs text-slate-700">Relationship: {e.rel}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-3 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Design hints</p>
              <ul className="space-y-1 text-xs text-slate-700">
                {entityHints.map((hint) => (
                  <li key={hint} className="rounded-lg bg-slate-50 px-2 py-1 ring-1 ring-slate-100">
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <ShieldCheck className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          Architecture decision log
        </div>
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-2">
            <div className="grid gap-2 text-sm">
              <input
                aria-label="Decision title"
                value={decisionDraft.title}
                onChange={(e) => setDecisionDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Decision title"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              />
              <select
                aria-label="Decision category"
                value={decisionDraft.category}
                onChange={(e) => setDecisionDraft((d) => ({ ...d, category: e.target.value as Decision["category"] }))}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              >
                {["Security", "Performance", "Cost", "Operations", "UX"].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <textarea
                aria-label="Why we chose this"
                value={decisionDraft.why}
                onChange={(e) => setDecisionDraft((d) => ({ ...d, why: e.target.value }))}
                placeholder="Why we chose this (1–2 lines)"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                rows={2}
              />
              <button
                type="button"
                onClick={addDecision}
                className="inline-flex w-fit items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              >
                Add decision
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-700">
              Recording decisions beats archeology. Future you (and future teammates) will know why queues were picked, why Postgres stayed, and when to revisit.
            </p>
          </div>
        </div>
        <div className="grid gap-2 lg:grid-cols-2">
          {decisions.map((d, i) => (
            <div key={`${d.title}-${i}`} className="rounded-2xl border border-slate-100 bg-slate-50/70 px-3 py-2">
              <p className="text-sm font-semibold text-slate-900">{d.title}</p>
              <p className="text-xs text-slate-600">Category: {d.category}</p>
              <p className="text-xs text-slate-700 mt-1">{d.why}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4 shadow-[0_10px_25px_rgba(16,185,129,0.08)] space-y-2">
        <p className="text-sm font-semibold text-emerald-900">Security & digitalisation</p>
        <ul className="text-sm text-emerald-900 space-y-1">
          <li>☑ Data classification: know what’s PII vs. public.</li>
          <li>☑ Least privilege between services: gateway, services, DB all have scoped creds.</li>
          <li>☑ Log key events: auth changes, payment intents, notification failures.</li>
        </ul>
        <p className="text-xs text-emerald-900">
          Any real build must follow secure coding guidance and your digitalisation strategy. This page stays client side for safety, so keep secrets out and avoid external calls.
        </p>
      </div>
    </section>
  );
}
