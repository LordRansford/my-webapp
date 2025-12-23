"use client";

import { isProfessionals, wizardCopy } from "@/lib/architecture-diagrams/copy/audience";

export default function StepSystem({ audience = "students", systemName, systemDescription, onChange, errors = [] }) {
  const copy = wizardCopy(audience);
  const title = isProfessionals(audience) ? "System basics" : "System basics 🧱";
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-700">{copy.systemIntro}</p>
      </div>

      <label className="block text-sm font-semibold text-slate-900">
        {copy.systemNameLabel}
        <input
          value={systemName}
          onChange={(e) => onChange({ systemName: e.target.value })}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder={copy.systemNameExample}
        />
        <p className="mt-2 text-xs text-slate-600">Example: {copy.systemNameExample}</p>
      </label>

      <label className="block text-sm font-semibold text-slate-900">
        {copy.systemDescriptionLabel}
        <textarea
          value={systemDescription}
          onChange={(e) => onChange({ systemDescription: e.target.value })}
          rows={4}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
          placeholder={copy.systemDescriptionExample}
        />
        <p className="mt-2 text-xs text-slate-600">{copy.systemDescriptionHelp}</p>
      </label>

      {errors.length ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


