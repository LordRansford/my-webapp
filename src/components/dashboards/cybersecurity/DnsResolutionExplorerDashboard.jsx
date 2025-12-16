"use client";

import React, { useState } from "react";
import { ArrowRight, Server, Database } from "lucide-react";

const STEPS = [
  {
    id: 1,
    title: "Check local cache",
    component: "Client",
    action: "Checks browser and OS cache for domain",
    result: "Not found in cache",
  },
  {
    id: 2,
    title: "Query resolver",
    component: "Resolver",
    action: "Receives query, checks its cache",
    result: "Not in resolver cache",
  },
  {
    id: 3,
    title: "Query root server",
    component: "Root server",
    action: "Points to .com TLD nameserver",
    result: "Returns .com nameserver address",
  },
  {
    id: 4,
    title: "Query TLD server",
    component: ".com server",
    action: "Points to authoritative nameserver",
    result: "Returns authoritative server address",
  },
  {
    id: 5,
    title: "Query authoritative",
    component: "Authoritative server",
    action: "Returns IP address for domain",
    result: "Returns A record: 192.0.2.1",
  },
  {
    id: 6,
    title: "Response chain",
    component: "All components",
    action: "IP address propagates back to client",
    result: "Client receives IP, caches result",
  },
];

export default function DnsResolutionExplorerDashboard() {
  const [hostname, setHostname] = useState("example.com");
  const [currentStep, setCurrentStep] = useState(0);

  const step = STEPS[currentStep];
  const canGoNext = currentStep < STEPS.length - 1;
  const canGoPrev = currentStep > 0;

  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-slate-950/80 p-4 text-slate-50 shadow-sm ring-1 ring-slate-800 md:flex-row md:p-5">
      {/* Left: controls */}
      <div className="flex flex-1 flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold tracking-tight text-slate-50">
            DNS resolution explorer
          </h3>
          <p className="mt-1 text-xs text-slate-300">
            Step through a simulated DNS lookup. This does not query real DNS. It shows the
            conceptual steps from client to authoritative server.
          </p>
        </div>

        <div className="rounded-xl bg-slate-900/80 p-3 ring-1 ring-slate-800">
          <label className="mb-2 block text-xs font-medium text-slate-200">Hostname</label>
          <input
            type="text"
            value={hostname}
            onChange={(e) => setHostname(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-2 py-1.5 text-xs text-slate-50 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
            placeholder="example.com"
          />
        </div>

        <div className="rounded-xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span className="text-xs text-slate-400">{step.title}</span>
          </div>
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={!canGoPrev}
              className="flex-1 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              disabled={!canGoNext}
              className="flex-1 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-sky-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Right: visual */}
      <div className="flex w-full max-w-xs flex-col gap-4 md:max-w-sm">
        <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-slate-800">
          <div className="mb-4 flex items-center gap-2">
            <Server size={18} className="text-sky-400" />
            <h4 className="text-xs font-semibold text-slate-100">Resolution flow</h4>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-slate-700 bg-slate-950/80 p-3">
              <div className="mb-1 flex items-center gap-2">
                <Database size={14} className="text-blue-400" />
                <span className="text-xs font-medium text-slate-200">{step.component}</span>
              </div>
              <p className="text-[0.7rem] text-slate-300">{step.action}</p>
              <p className="mt-2 text-[0.7rem] font-medium text-emerald-300">{step.result}</p>
            </div>

            {canGoNext && (
              <div className="flex items-center justify-center">
                <ArrowRight size={20} className="text-slate-500" />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/80 p-3 text-xs text-slate-200 ring-1 ring-slate-800">
          <p className="font-semibold text-sky-200">Attack points</p>
          <p className="mt-1 text-[0.7rem] text-slate-300">
            Attackers can interfere at any step: cache poisoning, resolver compromise, or
            hijacking. Understanding the normal flow helps you spot when something is wrong.
          </p>
        </div>
      </div>
    </div>
  );
}

