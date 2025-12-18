"use client";

import React, { useMemo, useState } from "react";
import { SecurityNotice } from "@/components/SecurityNotice";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";
import { ListChecks, ClipboardList } from "lucide-react";

const roles = ["Backend architect", "Frontend architect", "Full stack guide", "Refactoring coach"] as const;

type StepStatus = "todo" | "in-progress" | "done" | "blocked";

export default function AgentBuilderLab() {
  const [prompt, setPrompt] = useState("Build a simple API for tracking feature flags.");
  const [role, setRole] = useState<typeof roles[number]>("Full stack guide");
  const [plan, setPlan] = useState<{ text: string; status: StepStatus }[]>([]);

  const generatePlan = () => {
    const baseSteps = [
      "Clarify scope and users",
      "Pick stack and persistence",
      "Design APIs and security",
      "Add CI checks and deploy path",
      "Observability and rollback plan",
    ];
    const extra = role.includes("Frontend")
      ? ["Define routing and state management", "Plan accessibility and design system"]
      : role.includes("Backend")
      ? ["Model data and contracts", "Plan migrations and resilience"]
      : role.includes("Refactoring")
      ? ["Identify hotspots", "Add characterization tests", "Refactor in small steps"]
      : ["Align front/back contracts", "Plan end-to-end tests"];
    const lengthBoost = prompt.trim().length > 120 ? ["Break work into milestones"] : [];
    const steps = [...baseSteps.slice(0, 3), ...extra.slice(0, 2), ...baseSteps.slice(3), ...lengthBoost];
    setPlan(steps.map((text) => ({ text, status: "todo" })));
  };

  const updateStatus = (idx: number, status: StepStatus) => {
    setPlan((prev) => prev.map((step, i) => (i === idx ? { ...step, status } : step)));
  };

  const progress = useMemo(() => {
    if (!plan.length) return 0;
    const done = plan.filter((s) => s.status === "done").length;
    return Math.round((done / plan.length) * 100);
  }, [plan]);

  const summary =
    progress === 0
      ? "Fresh plan. Start with clarifying scope."
      : progress < 50
      ? "Nice start. Keep momentum; unblock anything stuck."
      : progress < 100
      ? "Over halfway. Land tests and deployments."
      : "Done. Ship it, then observe and iterate.";

  return (
    <div className="space-y-6">
      <SecurityNotice />
      <SecurityBanner />

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ListChecks className="h-5 w-5 text-sky-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">1. Describe your project</h2>
        </div>
        <label className="text-sm font-semibold text-slate-800">
          Tell me what you want to build
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
            maxLength={500}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        </label>
        <label className="text-sm font-semibold text-slate-800">
          Agent role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof roles[number])}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            {roles.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </label>
        <button
          onClick={generatePlan}
          className="inline-flex items-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2"
        >
          Generate agent plan
        </button>
        <p className="text-xs text-slate-600">
          Plans are generated locally in your browser.
        </p>
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">2. Turn the plan into your to do list</h2>
        </div>
        {plan.length === 0 ? (
          <p className="text-sm text-slate-700">Generate a plan first to see steps here.</p>
        ) : (
          <div className="space-y-2">
            <ul className="space-y-2">
              {plan.map((step, idx) => (
                <li key={idx} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 text-sm text-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span>{idx + 1}. {step.text}</span>
                    <div className="flex gap-2 text-xs">
                      {(["todo", "in-progress", "done", "blocked"] as StepStatus[]).map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(idx, status)}
                          className={`rounded-full px-3 py-1 ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                            step.status === status
                              ? "bg-slate-900 text-white ring-slate-900"
                              : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {status.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-700">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100">
                <div
                  className={`h-2 rounded-full transition-all ${
                    progress < 40 ? "bg-rose-400" : progress < 80 ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-slate-600">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
