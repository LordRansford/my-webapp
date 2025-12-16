"use client";

import { useMemo, useState } from "react";

const POINTS = [
  { x: 1, y: 1 },
  { x: 1.2, y: 0.8 },
  { x: 0.8, y: 1.1 },
  { x: 3.5, y: 3.6 },
  { x: 3.8, y: 3.2 },
  { x: 3.3, y: 3.4 },
  { x: 2.5, y: 0.5 },
  { x: 2.8, y: 0.7 },
  { x: 2.6, y: 0.3 },
];

export default function ClusteringIntuitionTool() {
  const [k, setK] = useState(2);

  const summary = useMemo(() => {
    const centroids = Array.from({ length: k }).map((_, i) => ({
      x: (i + 1) * (4 / (k + 1)),
      y: (i + 1) * (4 / (k + 1)),
    }));

    const clusters = centroids.map(() => []);
    POINTS.forEach((p) => {
      let best = 0;
      let bestDist = Infinity;
      centroids.forEach((c, idx) => {
        const d = Math.hypot(p.x - c.x, p.y - c.y);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      clusters[best].push(p);
    });
    return clusters.map((c, idx) => ({ idx, size: c.length, example: c[0] }));
  }, [k]);

  return (
    <div className="space-y-3 text-sm text-gray-800">
      <p className="text-sm text-gray-700">Change k to see how the same data can be grouped differently.</p>
      <div>
        <label className="block text-xs font-semibold text-gray-600">Number of clusters (k)</label>
        <input type="range" min="1" max="4" step="1" value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full" />
        <div className="mt-1 text-xs text-gray-600">k = {k}</div>
      </div>

      <div className="rounded-2xl border bg-white/70 p-3">
        <div className="text-xs uppercase tracking-wide text-gray-600">Clusters</div>
        <ul className="mt-2 space-y-1">
          {summary.map((c) => (
            <li key={c.idx} className="text-sm">
              Cluster {c.idx + 1}: {c.size} points{c.example ? ` (example point ${c.example.x.toFixed(1)}, ${c.example.y.toFixed(1)})` : ""}
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-gray-600">Different k tells different stories. Clusters are choices, not truths.</p>
      </div>
    </div>
  );
}
