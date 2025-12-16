"use client";

import { useEffect, useMemo, useState } from "react";

const points = [
  { x: 1, y: 1 },
  { x: 1.2, y: 1.5 },
  { x: 3, y: 3.2 },
  { x: 3.5, y: 3.8 },
  { x: 5, y: 1.2 },
  { x: 4.5, y: 1.7 },
];

function randomCentroids(k) {
  return Array.from({ length: k }, (_, i) => ({
    x: 1 + i * 1.2,
    y: 1 + (k - i) * 0.8,
  }));
}

function assign(points, centroids) {
  return points.map((p) => {
    let best = 0;
    let bestDist = Infinity;
    centroids.forEach((c, idx) => {
      const d = (p.x - c.x) ** 2 + (p.y - c.y) ** 2;
      if (d < bestDist) {
        bestDist = d;
        best = idx;
      }
    });
    return best;
  });
}

function recompute(points, assigns, k) {
  return Array.from({ length: k }, (_, idx) => {
    const pts = points.filter((_, i) => assigns[i] === idx);
    if (!pts.length) return { x: 0, y: 0 };
    return {
      x: pts.reduce((a, p) => a + p.x, 0) / pts.length,
      y: pts.reduce((a, p) => a + p.y, 0) / pts.length,
    };
  });
}

export default function ClusteringExplorer() {
  const [k, setK] = useState(2);
  const [centroids, setCentroids] = useState(() => randomCentroids(2));
  const assignments = useMemo(() => assign(points, centroids), [centroids]);

  useEffect(() => {
    // run two light iterations when k changes
    const init = randomCentroids(k);
    let assigns = assign(points, init);
    let cents = recompute(points, assigns, k);
    assigns = assign(points, cents);
    setCentroids(cents);
  }, [k]);

  const avgDist = useMemo(() => {
    const dists = points.map((p, idx) => {
      const c = centroids[assignments[idx]] || { x: 0, y: 0 };
      return Math.sqrt((p.x - c.x) ** 2 + (p.y - c.y) ** 2);
    });
    const mean = dists.reduce((a, b) => a + b, 0) / dists.length;
    return mean.toFixed(2);
  }, [assignments, centroids]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <label className="text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Clusters (k)</span>
          <input
            type="range"
            min="2"
            max="5"
            value={k}
            onChange={(e) => setK(Number(e.target.value))}
            className="ml-2 align-middle accent-blue-600"
          />
          <span className="ml-2 text-xs text-slate-600">{k}</span>
        </label>
        <p className="text-xs text-slate-700">Avg distance: {avgDist}</p>
      </div>

      <div className="relative mt-3 h-48 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100">
        {points.map((p, idx) => {
          const cluster = assignments[idx] ?? 0;
          const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500"];
          return (
            <div
              key={idx}
              className={`absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm ${colors[cluster]}`}
              style={{ left: `${(p.x / 6) * 100}%`, top: `${100 - (p.y / 5) * 100}%` }}
              title={`Cluster ${cluster + 1}`}
            />
          );
        })}
        {centroids.map((c, idx) => (
          <div
            key={idx}
            className="absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black/70"
            style={{ left: `${(c.x / 6) * 100}%`, top: `${100 - (c.y / 5) * 100}%` }}
            title={`Centroid ${idx + 1}`}
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-700">
        Increase k to see clusters split; watch average distance to judge if extra clusters add clarity.
      </p>
    </div>
  );
}
