"use client";

import { useMemo, useState } from "react";
import { Layers, Shapes, AlertTriangle } from "lucide-react";

const CONTEXTS = ["Customer", "Billing", "Operations", "Data Platform"];
const FEATURES = [
  "Create account",
  "Meter reading",
  "Outage updates",
  "Billing statement",
  "Usage analytics",
  "Payment collection",
];

export default function DomainContextMapperTool() {
  const [assignments, setAssignments] = useState(
    FEATURES.reduce((acc, feature) => {
      acc[feature] = CONTEXTS[0];
      return acc;
    }, {})
  );

  const counts = useMemo(() => {
    return CONTEXTS.reduce((acc, context) => {
      acc[context] = FEATURES.filter((feature) => assignments[feature] === context).length;
      return acc;
    }, {});
  }, [assignments]);

  const overloaded = Object.entries(counts).filter(([, count]) => count >= 3);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <Layers className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Domain and context mapper</p>
          <p className="text-xs text-slate-600">Group features into bounded contexts and spot overlaps.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <label key={feature} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Shapes className="h-4 w-4" aria-hidden="true" />
              {feature}
            </span>
            <select
              value={assignments[feature]}
              onChange={(event) =>
                setAssignments((prev) => ({ ...prev, [feature]: event.target.value }))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              {CONTEXTS.map((context) => (
                <option key={context} value={context}>
                  {context}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {CONTEXTS.map((context) => (
          <div key={context} className="rounded-2xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{context}</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">{counts[context]} features</p>
            <p className="mt-1 text-xs text-slate-600">Keep contexts focused so ownership stays clear.</p>
          </div>
        ))}
      </div>

      {overloaded.length ? (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-800">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            Contexts with many features
          </div>
          <p className="mt-2">
            {overloaded.map(([context]) => context).join(", ")}. Consider splitting large contexts to reduce coupling.
          </p>
        </div>
      ) : null}
    </div>
  );
}
