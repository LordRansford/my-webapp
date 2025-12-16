"use client";

import { useMemo, useState } from "react";

const AREAS = [
  { id: "identity", label: "Identity and access", base: 5 },
  { id: "network", label: "Network and perimeter", base: 4 },
  { id: "appsec", label: "Application security", base: 4 },
  { id: "monitoring", label: "Monitoring and response", base: 5 },
];

const BUDGET = 10;

export default function RiskBalancingGame() {
  const [allocations, setAllocations] = useState(
    AREAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {})
  );
  const [scenarioShift, setScenarioShift] = useState(
    AREAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {})
  );

  const totalAllocated = useMemo(
    () => Object.values(allocations).reduce((sum, v) => sum + v, 0),
    [allocations]
  );

  const residuals = useMemo(() => {
    const result = {};
    AREAS.forEach((area) => {
      const alloc = allocations[area.id] || 0;
      const base = area.base + (scenarioShift[area.id] || 0);
      const residual = Math.max(1, base - alloc);
      result[area.id] = residual;
    });
    return result;
  }, [allocations, scenarioShift]);

  const weakest = useMemo(() => {
    const entries = Object.entries(residuals);
    const worst = entries.reduce((acc, [id, val]) => (val > acc.val ? { id, val } : acc), {
      id: entries[0][0],
      val: entries[0][1],
    });
    return AREAS.find((a) => a.id === worst.id)?.label || "";
  }, [residuals]);

  const adjust = (id, delta) => {
    setAllocations((prev) => {
      const next = { ...prev };
      const newVal = (next[id] || 0) + delta;
      if (newVal < 0) return prev;
      const newTotal = totalAllocated + delta;
      if (newTotal > BUDGET) return prev;
      next[id] = newVal;
      return next;
    });
  };

  const randomScenario = () => {
    const shifts = AREAS.reduce((acc, a) => ({ ...acc, [a.id]: Math.floor(Math.random() * 3) }), {});
    setScenarioShift(shifts);
    setAllocations(AREAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {}));
  };

  const reset = () => {
    setAllocations(AREAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {}));
    setScenarioShift(AREAS.reduce((acc, a) => ({ ...acc, [a.id]: 0 }), {}));
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-200">
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <div className="flex-1 space-y-3">
          <h4 className="text-base font-semibold text-slate-900">Allocate your budget</h4>
          <p className="text-sm text-slate-700">You have {BUDGET} points. Reduce residual risk by investing in each area.</p>
          <div className="text-sm font-semibold text-slate-900">Allocated: {totalAllocated}/{BUDGET}</div>
          <div className="space-y-2">
            {AREAS.map((area) => (
              <div key={area.id} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between text-sm text-slate-900">
                  <span>{area.label}</span>
                  <span className="font-semibold">{allocations[area.id] || 0} pts</span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => adjust(area.id, -1)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-40"
                    disabled={(allocations[area.id] || 0) === 0}
                  >
                    −
                  </button>
                  <button
                    onClick={() => adjust(area.id, 1)}
                    className="rounded-full border border-slate-300 px-3 py-1 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-40"
                    disabled={totalAllocated >= BUDGET}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={randomScenario}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              Random scenario
            </button>
            <button
              onClick={reset}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
            <h5 className="text-sm font-semibold text-slate-900">Residual risk (lower is better)</h5>
            <div className="mt-2 space-y-2">
              {AREAS.map((area) => {
                const val = residuals[area.id];
                const width = `${(val / 7) * 100}%`;
                return (
                  <div key={area.id}>
                    <div className="flex items-center justify-between text-sm text-slate-800">
                      <span>{area.label}</span>
                      <span className="font-semibold">{val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white">
                      <div className="h-full rounded-full bg-rose-400" style={{ width }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 shadow-sm">
            <h5 className="mb-2 text-sm font-semibold text-slate-900">Where to rebalance</h5>
            <p>
              The weakest area is currently <strong>{weakest}</strong>. Consider moving one or two points toward it to balance residual risk.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
