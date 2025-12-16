"use client";

import { useMemo, useState } from "react";

export function TechDebtRadar() {
  const [items, setItems] = useState([
    { id: 1, area: "Code", title: "Legacy billing module", impact: 4, urgency: 3 },
    { id: 2, area: "Operations", title: "Manual failover run book", impact: 5, urgency: 4 },
  ]);

  function updateItem(id, patch) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function addItem() {
    const nextId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems((current) => [...current, { id: nextId, area: "Code", title: "", impact: 3, urgency: 3 }]);
  }

  function removeItem(id) {
    setItems((current) => current.filter((i) => i.id !== id));
  }

  const stats = useMemo(() => {
    const totals = { Code: 0, Data: 0, Operations: 0, Security: 0 };
    items.forEach((item) => {
      totals[item.area] += item.impact * item.urgency;
    });
    const overallRisk = Object.values(totals).reduce((sum, value) => sum + value, 0);
    return { totals, overallRisk };
  }, [items]);

  function scoreLabel(score) {
    if (score === 0) return "No visible debt yet";
    if (score < 10) return "Low but worth watching";
    if (score < 30) return "Moderate, should be scheduled";
    return "High, needs a clear plan";
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-slate-600">
        Capture debt items and see where risk is concentrated. This keeps debt visible in architecture discussions without replacing
        a full risk register.
      </p>

      <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Debt items</p>
            <button
              type="button"
              onClick={addItem}
              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-800"
            >
              Add item
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3 shadow-sm">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <input
                    className="w-full rounded-xl border border-slate-200 px-2 py-1 text-sm font-semibold"
                    placeholder="Describe the debt briefly"
                    value={item.title}
                    onChange={(e) => updateItem(item.id, { title: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-2 sm:grid-cols-3">
                  <label className="text-xs text-slate-600">
                    Area
                    <select
                      className="mt-1 w-full rounded-xl border border-slate-200 px-2 py-1 text-xs"
                      value={item.area}
                      onChange={(e) => updateItem(item.id, { area: e.target.value })}
                    >
                      <option value="Code">Code</option>
                      <option value="Data">Data</option>
                      <option value="Operations">Operations</option>
                      <option value="Security">Security</option>
                    </select>
                  </label>

                  <label className="text-xs text-slate-600">
                    Impact (1 low, 5 high)
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={item.impact}
                      onChange={(e) => updateItem(item.id, { impact: Number(e.target.value) || 1 })}
                      className="mt-1 w-full"
                    />
                    <span className="mt-1 inline-block text-xs text-slate-700">{item.impact}</span>
                  </label>

                  <label className="text-xs text-slate-600">
                    Urgency (1 low, 5 high)
                    <input
                      type="range"
                      min={1}
                      max={5}
                      value={item.urgency}
                      onChange={(e) => updateItem(item.id, { urgency: Number(e.target.value) || 1 })}
                      className="mt-1 w-full"
                    />
                    <span className="mt-1 inline-block text-xs text-slate-700">{item.urgency}</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 text-sm">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Radar summary</p>
            {["Code", "Data", "Operations", "Security"].map((area) => (
              <p key={area} className="text-xs text-slate-700">
                {area}: <span className="font-semibold">{stats.totals[area]} risk points</span>
              </p>
            ))}
            <p className="mt-2 text-xs text-slate-700">
              Overall risk: <span className="font-semibold">{stats.overallRisk} points</span> – {scoreLabel(stats.overallRisk)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="mb-1 font-medium">Prompts</p>
            <ul className="list-disc space-y-1 pl-4">
              <li>Is most of your debt in one area, for example operations or data.</li>
              <li>Do one or two items dominate the risk score.</li>
              <li>Can you link high risk items to explicit mitigation tasks or funding.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
