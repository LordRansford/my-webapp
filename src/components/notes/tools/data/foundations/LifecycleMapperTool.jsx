"use client";

import { useMemo, useState } from "react";

const steps = [
  { id: "collect", label: "Collect" },
  { id: "store", label: "Store" },
  { id: "process", label: "Process" },
  { id: "share", label: "Share" },
  { id: "archive", label: "Archive or delete" },
];

export default function LifecycleMapperTool() {
  const [order, setOrder] = useState(() => ({
    collect: "1",
    store: "2",
    process: "3",
    share: "4",
    archive: "5",
  }));

  const result = useMemo(() => {
    const correct = ["1", "2", "3", "4", "5"].every((num, idx) => {
      const stepId = steps[idx].id;
      return order[stepId] === num;
    });
    return correct ? "Looks good" : "Something is out of order";
  }, [order]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Assign the order for each step. Matching 1 through 5 shows a healthy lifecycle. Try reshuffling to see what breaks.
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {steps.map((step, idx) => (
          <div key={step.id} className="rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-slate-900">{step.label}</span>
              <select
                value={order[step.id]}
                onChange={(e) =>
                  setOrder((prev) => ({
                    ...prev,
                    [step.id]: e.target.value,
                  }))
                }
                className="rounded-lg border border-slate-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-sky-200"
                aria-label={`Select order for ${step.label}`}
              >
                <option value="">?</option>
                {["1", "2", "3", "4", "5"].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Suggested: {idx + 1}. If you move it, explain why.
            </p>
          </div>
        ))}
      </div>
      <p className={`text-sm font-semibold ${result === "Looks good" ? "text-emerald-700" : "text-amber-700"}`}>
        {result}
      </p>
    </div>
  );
}
