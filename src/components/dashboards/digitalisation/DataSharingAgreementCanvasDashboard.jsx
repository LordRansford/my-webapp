"use client";

import { useState } from "react";

export default function DataSharingAgreementCanvasDashboard() {
  const [form, setForm] = useState({
    parties: "Org A, Org B",
    purpose: "Analytics collaboration",
    data: "Customer interactions (aggregated)",
    controls: "Access logging, masking, encryption",
    review: "Quarterly",
  });

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(form).map(([key, value]) => (
          <label key={key} className="block text-sm text-slate-700">
            <span className="font-semibold capitalize text-slate-900">{key}</span>
            <textarea
              value={value}
              onChange={(e) => update(key, e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <CanvasCard title="Parties">{form.parties}</CanvasCard>
        <CanvasCard title="Purpose">{form.purpose}</CanvasCard>
        <CanvasCard title="Data sets">{form.data}</CanvasCard>
        <CanvasCard title="Controls">{form.controls}</CanvasCard>
        <CanvasCard title="Review cycle">{form.review}</CanvasCard>
      </div>
    </div>
  );
}

function CanvasCard({ title, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <p className="mt-1 text-sm text-slate-800 whitespace-pre-line">{children || "Add detail"}</p>
    </div>
  );
}
