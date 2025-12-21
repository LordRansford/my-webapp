"use client";

import { useMemo, useState } from "react";

const CONSTRAINTS = [
  "Budget is tight",
  "Team is small",
  "Strict security requirements",
  "Latency must be very low",
  "Frequent change expected",
  "Legacy system must stay",
] ;

const DECISIONS = [
  {
    id: "boundary-first",
    title: "Make boundaries explicit early",
    mapping: {
      "Budget is tight": "Start simple, but keep boundaries clear so change stays affordable.",
      "Team is small": "Prefer fewer moving parts. Use clear module boundaries inside one deployable.",
      "Strict security requirements": "Define trust boundaries and data ownership up front.",
      "Latency must be very low": "Keep the hot path short. Avoid unnecessary network hops.",
      "Frequent change expected": "Invest in interfaces and contracts to reduce ripple effects.",
      "Legacy system must stay": "Wrap legacy behind an interface. Treat it as a dependency you cannot trust.",
    },
  },
  {
    id: "operability",
    title: "Design for operability, not just features",
    mapping: {
      "Budget is tight": "Pick the simplest deployment you can monitor and debug well.",
      "Team is small": "Reduce on call load with good defaults, logs, and safe fallbacks.",
      "Strict security requirements": "Centralize auth, auditing, and least privilege paths.",
      "Latency must be very low": "Measure end to end latency and budget it per dependency.",
      "Frequent change expected": "Add observability so you can ship changes with confidence.",
      "Legacy system must stay": "Add guardrails around legacy timeouts and failure modes.",
    },
  },
  {
    id: "data-ownership",
    title: "Define data ownership",
    mapping: {
      "Budget is tight": "Avoid duplicate sources of truth. Pick one owner per dataset.",
      "Team is small": "Keep data responsibilities obvious so mistakes are easy to spot.",
      "Strict security requirements": "Minimize sensitive data flow and clearly define access points.",
      "Latency must be very low": "Place data near the computation, or cache what is safe to cache.",
      "Frequent change expected": "Schema evolution is easier when ownership is clear.",
      "Legacy system must stay": "Isolate legacy data shape from your new domain model.",
    },
  },
] ;

export default function ArchitectureDecisionExplorerTool() {
  const [constraint, setConstraint] = useState(CONSTRAINTS[0]);

  const decisionCards = useMemo(() => {
    return DECISIONS.map((d) => ({
      id: d.id,
      title: d.title,
      note: d.mapping[constraint] || "Consider how this constraint changes the safest default decision.",
    }));
  }, [constraint]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700">
        Pick a constraint and see how it nudges architectural decisions. This is not a checklist. It is practice in
        reasoning under limits.
      </p>

      <label className="block space-y-1">
        <span className="text-sm font-semibold text-slate-800">Constraint</span>
        <select
          className="w-full rounded-xl border border-slate-200 bg-white p-3 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          value={constraint}
          onChange={(e) => setConstraint(e.target.value)}
        >
          {CONSTRAINTS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        {decisionCards.map((c) => (
          <div key={c.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
            <p className="text-sm font-semibold text-slate-900">{c.title}</p>
            <p className="mt-2 text-sm text-slate-700">{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


