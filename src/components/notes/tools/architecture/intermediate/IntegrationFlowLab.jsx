"use client";

import { useState } from "react";
import { ArrowRight, Repeat, Radio, Plug } from "lucide-react";

const FLOWS = [
  {
    id: "sync",
    title: "Synchronous request",
    icon: Plug,
    summary: "Service A calls Service B and waits for a response.",
    pros: ["Simple to reason about", "Immediate response"],
    risks: ["Tight coupling", "Slow services block others"],
  },
  {
    id: "async",
    title: "Asynchronous message",
    icon: Radio,
    summary: "Service A sends a message and continues.",
    pros: ["Loose coupling", "Better resilience"],
    risks: ["Harder debugging", "Eventual consistency"],
  },
];

export default function IntegrationFlowLab() {
  const [active, setActive] = useState(FLOWS[0]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <Repeat className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Integration and API lab</p>
          <p className="text-xs text-slate-600">Compare request and message flows.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {FLOWS.map((flow) => {
          const Icon = flow.icon;
          const isActive = flow.id === active.id;
          return (
            <button
              key={flow.id}
              type="button"
              onClick={() => setActive(flow)}
              aria-pressed={isActive}
              className={`rounded-2xl border p-3 text-left transition ${
                isActive
                  ? "border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-100"
                  : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-slate-600">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{flow.title}</p>
                  <p className="text-xs text-slate-600">{flow.summary}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-slate-600">Service A</span>
          <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
          <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-slate-600">
            {active.id === "sync" ? "HTTP call" : "Event message"}
          </span>
          <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
          <span className="rounded-full bg-white px-2 py-1 text-sm font-semibold text-slate-600">Service B</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold text-slate-900">Pros</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {active.pros.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <p className="font-semibold text-slate-900">Risks</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-600">
              {active.risks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
