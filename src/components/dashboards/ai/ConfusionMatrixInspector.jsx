"use client";

import { useMemo, useState } from "react";

const classes = ["A", "B", "C"];

export default function ConfusionMatrixInspector() {
  const [matrix, setMatrix] = useState([
    [14, 2, 1],
    [3, 12, 2],
    [1, 2, 11],
  ]);

  const totals = useMemo(
    () => matrix.map((row) => row.reduce((a, b) => a + b, 0)),
    [matrix]
  );

  const hotCells = useMemo(() => {
    const flat = matrix.flat();
    const max = Math.max(...flat);
    return { max };
  }, [matrix]);

  const updateCell = (r, c, val) => {
    setMatrix((prev) => prev.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? Number(val) : v))));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="overflow-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-xs uppercase tracking-wide text-slate-600">True \ Pred</th>
              {classes.map((c) => (
                <th key={c} className="px-3 py-2 text-left text-xs uppercase tracking-wide text-slate-600">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, r) => (
              <tr key={r} className="border-t border-slate-200">
                <th className="px-3 py-2 text-left font-semibold text-slate-900">{classes[r]}</th>
                {row.map((val, c) => {
                  const intensity = Math.min(1, val / hotCells.max);
                  const bg = `rgba(59,130,246,${0.12 + intensity * 0.25})`;
                  return (
                    <td key={c} className="px-3 py-2">
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => updateCell(r, c, e.target.value)}
                        className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        style={{ backgroundColor: bg }}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        {matrix.map((row, idx) => (
          <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">
              True {classes[idx]} accuracy {(row[idx] / Math.max(totals[idx], 1) * 100).toFixed(1)}%
            </p>
            <p>Top error: {classes[row.indexOf(Math.max(...row.filter((_, i) => i !== idx)))] || "-"} </p>
          </div>
        ))}
      </div>
    </div>
  );
}
