"use client";

import { useMemo, useState } from "react";

export default function ConsentPolicySandboxDashboard() {
  const [form, setForm] = useState({
    purpose: "",
    dataType: "Personal",
    retention: "12 months",
    expectation: "Expected",
  });

  const hints = useMemo(() => {
    const list = [];
    if (form.dataType === "Sensitive") list.push("Higher sensitivity: consider DPIA and explicit consent.");
    if (form.retention.includes("36")) list.push("Long retention: validate legal basis and storage controls.");
    if (form.expectation === "Unexpected") list.push("User expectations misaligned: reinforce transparency and choice.");
    if (!list.length) list.push("Looks reasonable-still confirm with your policy checklist.");
    return list;
  }, [form]);

  const update = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="block text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Purpose</span>
          <input
            value={form.purpose}
            onChange={(e) => update("purpose", e.target.value)}
            placeholder="e.g., personalisation of recommendations"
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </label>
        <label className="block text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Data category</span>
          <select
            value={form.dataType}
            onChange={(e) => update("dataType", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option>Personal</option>
            <option>Sensitive</option>
            <option>Pseudonymous</option>
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          <span className="font-semibold text-slate-900">Retention</span>
          <select
            value={form.retention}
            onChange={(e) => update("retention", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option>3 months</option>
            <option>12 months</option>
            <option>24 months</option>
            <option>36 months</option>
          </select>
        </label>
        <label className="block text-sm text-slate-700">
          <span className="font-semibold text-slate-900">User expectation</span>
          <select
            value={form.expectation}
            onChange={(e) => update("expectation", e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option>Expected</option>
            <option>Neutral</option>
            <option>Unexpected</option>
          </select>
        </label>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
        <p className="font-semibold text-slate-900">Policy hints</p>
        <ul className="mt-1 list-disc space-y-1 pl-5">
          {hints.map((h, idx) => (
            <li key={idx}>{h}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

