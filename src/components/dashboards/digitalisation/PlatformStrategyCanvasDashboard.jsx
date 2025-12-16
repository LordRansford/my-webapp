"use client";

import { useState } from "react";

export default function PlatformStrategyCanvasDashboard() {
  const [canvas, setCanvas] = useState({
    value: "Shared data services for product teams",
    users: "Product engineers, data analysts",
    capabilities: "APIs, events, observability",
    nonGoals: "Full app hosting or front-end tooling",
  });

  const update = (key, val) => setCanvas((p) => ({ ...p, [key]: val }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(canvas).map(([key, val]) => (
          <label key={key} className="block text-sm text-slate-700">
            <span className="font-semibold text-slate-900 capitalize">{key}</span>
            <textarea
              value={val}
              onChange={(e) => update(key, e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Card title="Core value">{canvas.value}</Card>
        <Card title="Primary users">{canvas.users}</Card>
        <Card title="Core capabilities">{canvas.capabilities}</Card>
        <Card title="Non-goals">{canvas.nonGoals}</Card>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{children || "Add detail"}</p>
    </div>
  );
}
