"use client";

import { useMemo, useState } from "react";
import { Link2, ShieldCheck, FileText, Layers } from "lucide-react";

const ENDPOINTS = [
  {
    id: "meter-readings",
    method: "GET",
    path: "/meters/{id}/readings",
    summary: "Fetch meter readings for a given asset.",
    required: ["meter_id", "reading_time", "kwh"],
    optional: ["quality_flag", "source_system"],
  },
  {
    id: "outage-notify",
    method: "POST",
    path: "/outages/notify",
    summary: "Publish an outage notification to the network.",
    required: ["outage_id", "start_time", "area_id"],
    optional: ["estimated_restore", "status"],
  },
  {
    id: "customer-profile",
    method: "GET",
    path: "/customers/{id}",
    summary: "Retrieve profile data needed for service journeys.",
    required: ["customer_id", "contact_method", "consent_status"],
    optional: ["segment", "service_plan"],
  },
];

const CHECKS = [
  { key: "auth", label: "Auth and roles", icon: ShieldCheck },
  { key: "schema", label: "Schema defined", icon: FileText },
  { key: "version", label: "Versioning", icon: Layers },
  { key: "error", label: "Error codes", icon: Link2 },
];

const METHOD_STYLES = {
  GET: "bg-sky-50 text-sky-700 ring-1 ring-sky-100",
  POST: "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const scoreTone = (score) => {
  if (score >= 3) return "bg-emerald-50 text-emerald-800";
  if (score === 2) return "bg-amber-50 text-amber-800";
  return "bg-rose-50 text-rose-800";
};

export default function ApiContractExplorer() {
  const [selectedId, setSelectedId] = useState(ENDPOINTS[0].id);
  const [checks, setChecks] = useState({
    auth: true,
    schema: true,
    version: false,
    error: false,
  });

  const selected = ENDPOINTS.find((e) => e.id === selectedId) || ENDPOINTS[0];
  const score = useMemo(() => Object.values(checks).filter(Boolean).length, [checks]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">API contract explorer</p>
          <p className="text-xs text-slate-600">Review an endpoint and check contract readiness.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${scoreTone(score)}`}>
          {score} of {CHECKS.length} checks
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-sky-100 bg-sky-50/70 p-3">
        <div className="flex flex-wrap items-start gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-sky-700">
            <Link2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-900">How APIs work</p>
            <p className="mt-1 text-xs text-slate-600">
              An API is a contract. The method says the action, the path says the resource, and the response says what data
              comes back. Good contracts are clear about auth, versions, and errors.
            </p>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-700">
              <span className="rounded-full bg-white px-2 py-1">Method and path</span>
              <span className="rounded-full bg-white px-2 py-1">Headers and body</span>
              <span className="rounded-full bg-white px-2 py-1">Status codes</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Endpoints</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ENDPOINTS.map((endpoint) => (
              <button
                key={endpoint.id}
                type="button"
                onClick={() => setSelectedId(endpoint.id)}
                aria-pressed={endpoint.id === selectedId}
                className={`min-h-[96px] rounded-2xl border p-3 text-left transition ${
                  endpoint.id === selectedId
                    ? "border-sky-200 bg-white shadow-sm ring-1 ring-sky-100"
                    : "border-slate-200 bg-slate-50/70 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                    METHOD_STYLES[endpoint.method] || "bg-slate-100 text-slate-700"
                  }`}
                >
                  {endpoint.method}
                </span>
                <p className="mt-2 text-xs font-semibold leading-snug text-slate-900 break-all">{endpoint.path}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-sm text-slate-700">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  METHOD_STYLES[selected.method] || "bg-slate-100 text-slate-700"
                }`}
              >
                {selected.method}
              </span>
              <p className="text-xs font-semibold text-slate-900 break-all">{selected.path}</p>
            </div>
            <p className="mt-1 text-xs text-slate-600">{selected.summary}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-slate-600">Required fields</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.required.map((field) => (
                    <span key={field} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">Optional fields</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.optional.map((field) => (
                    <span key={field} className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-slate-700">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Contract checklist</p>
          <div className="mt-3 space-y-2">
            {CHECKS.map((item) => {
              const Icon = item.icon;
              return (
                <label key={item.key} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-700">
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    {item.label}
                  </span>
                  <input
                    type="checkbox"
                    checked={checks[item.key]}
                    onChange={(e) => setChecks((prev) => ({ ...prev, [item.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-400"
                  />
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-slate-600">
            A reliable contract answers who can call the API, what data comes back, and how changes are handled.
          </p>
        </div>
      </div>
    </div>
  );
}
