"use client";

import { useMemo, useState } from "react";

export default function OverfitExplorerTool() {
  const [dataSize, setDataSize] = useState(50);
  const [complexity, setComplexity] = useState(5);

  const status = useMemo(() => {
    const ratio = dataSize / Math.max(1, complexity * 10);
    if (ratio > 2) return { label: "Likely to generalise", desc: "Plenty of data for the capacity. Watch for underfitting if too simple." };
    if (ratio > 1) return { label: "Borderline", desc: "Validation is critical. You may be fine, or you may be memorising quirks." };
    return { label: "High overfit risk", desc: "Model can easily memorise. Increase data, regularise, or simplify." };
  }, [dataSize, complexity]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Balance data volume and model complexity to see overfitting risk.</p>

      <div>
        <label className="block text-xs font-semibold text-gray-600">Training examples</label>
        <input type="range" min="20" max="500" step="10" value={dataSize} onChange={(e) => setDataSize(Number(e.target.value))} className="w-full" />
        <div className="mt-1 text-xs text-gray-600">{dataSize} examples</div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600">Model complexity (layers/branches)</label>
        <input type="range" min="1" max="20" step="1" value={complexity} onChange={(e) => setComplexity(Number(e.target.value))} className="w-full" />
        <div className="mt-1 text-xs text-gray-600">Complexity {complexity}</div>
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-600">Assessment</div>
        <div className="mt-1 text-lg font-semibold text-gray-900">{status.label}</div>
        <p className="mt-1 text-sm text-gray-700">{status.desc}</p>
        <p className="mt-1 text-xs text-gray-600">Use validation loss to confirm. If train loss drops but val loss rises, you are overfitting.</p>
      </div>
    </div>
  );
}
