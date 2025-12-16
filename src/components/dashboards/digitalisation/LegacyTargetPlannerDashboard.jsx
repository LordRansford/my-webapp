"use client";

import { useMemo, useState } from "react";

export default function LegacyTargetPlannerDashboard() {
  const [current, setCurrent] = useState([
    { name: "Legacy CRM", status: "Retire" },
    { name: "Data warehouse", status: "Modernise" },
  ]);
  const [targets, setTargets] = useState(["Customer 360", "Event hub"]);

  const summary = useMemo(() => {
    const counts = current.reduce(
      (acc, cur) => ({ ...acc, [cur.status]: (acc[cur.status] || 0) + 1 }),
      {}
    );
    return counts;
  }, [current]);

  const updateStatus = (idx, status) => setCurrent((prev) => prev.map((c, i) => (i === idx ? { ...c, status } : c)));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-2">
          {current.map((sys, idx) => (
            <div key={sys.name} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm shadow-sm">
              <p className="font-semibold text-slate-900">{sys.name}</p>
              <select
                value={sys.status}
                onChange={(e) => updateStatus(idx, e.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option>Keep</option>
                <option>Modernise</option>
                <option>Retire</option>
              </select>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-sm font-semibold text-slate-900">Target platforms</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-700">
              {targets.map((t) => (
                <li key={t} className="rounded-lg bg-white px-2 py-1 shadow-sm">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">Progress pulse</p>
            <p className="mt-1">Keep: {summary.Keep || 0} · Modernise: {summary.Modernise || 0} · Retire: {summary.Retire || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
