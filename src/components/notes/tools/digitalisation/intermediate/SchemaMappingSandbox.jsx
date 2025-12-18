"use client";

import { useMemo, useState } from "react";
import { Layers, Shuffle } from "lucide-react";

const SOURCE_FIELDS = [
  { key: "meter_id", label: "meter_id" },
  { key: "reading_time", label: "reading_time" },
  { key: "kwh", label: "kwh" },
  { key: "site_code", label: "site_code" },
];

const CANONICAL_FIELDS = [
  "asset_id",
  "timestamp",
  "consumption_kwh",
  "location_id",
  "source_system",
];

export default function SchemaMappingSandbox() {
  const [mapping, setMapping] = useState({
    meter_id: "asset_id",
    reading_time: "timestamp",
    kwh: "consumption_kwh",
    site_code: "location_id",
  });

  const mappedTargets = useMemo(() => new Set(Object.values(mapping)), [mapping]);
  const coverage = useMemo(
    () => (Object.values(mapping).filter(Boolean).length / SOURCE_FIELDS.length) * 100,
    [mapping]
  );

  const unmappedCanonical = CANONICAL_FIELDS.filter((field) => !mappedTargets.has(field));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">Schema mapping sandbox</p>
          <p className="text-xs text-slate-600">Map source fields into a shared model and check coverage.</p>
        </div>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {Math.round(coverage)}% mapped
        </span>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Source to canonical</p>
          <div className="space-y-2">
            {SOURCE_FIELDS.map((field) => (
              <div key={field.key} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Layers className="h-4 w-4 text-slate-500" aria-hidden="true" />
                  {field.label}
                </div>
                <select
                  value={mapping[field.key]}
                  onChange={(e) => setMapping((prev) => ({ ...prev, [field.key]: e.target.value }))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  {CANONICAL_FIELDS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mapping signals</p>
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Shuffle className="h-4 w-4 text-slate-500" aria-hidden="true" />
              Unmapped canonical fields
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {unmappedCanonical.length ? (
                unmappedCanonical.map((field) => (
                  <span key={field} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-600">
                    {field}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-700">All covered</span>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Mapping gaps show where reporting and analytics can drift. Keep the canonical model stable and document changes.
          </p>
        </div>
      </div>
    </div>
  );
}
