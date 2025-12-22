"use client";

import React, { useMemo, useState } from "react";
import { ClipboardList, Users, Scale } from "lucide-react";

export default function CyberGovernanceLab() {
  const [policySet, setPolicySet] = useState({
    acceptableUse: true,
    accessControl: true,
    incidentResponse: true,
    vulnerabilityMgmt: false,
    logging: false,
    supplierRisk: false,
  });
  const [roles, setRoles] = useState({
    securityLead: "Security lead",
    itOps: "IT operations",
    engineering: "Engineering",
    dataOwner: "Data owner",
  });

  const readiness = useMemo(() => {
    const vals = Object.values(policySet);
    return Math.round((vals.filter(Boolean).length / vals.length) * 100);
  }, [policySet]);

  const message = useMemo(() => {
    if (readiness < 40) return "Policy coverage is thin. Controls will exist, but accountability and repeatability will be weak.";
    if (readiness < 80) return "Reasonable baseline. Fill the gaps that affect detection, patching, and suppliers.";
    return "Strong baseline. Keep it practical and reviewed, not a dusty binder.";
  }, [readiness]);

  return (
    <section className="space-y-6" aria-label="Governance and accountability">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Governance, ethics, and accountability</h2>
        </div>
        <p className="text-sm text-slate-700">
          Governance is how you make security real: clear policies, named roles, and decisions that can be audited. No legal claims, just practical structure.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Roles and responsibilities</h3>
            </div>
            <p className="text-sm text-slate-700">
              Security is a team sport. The security function sets standards and runs risk practice, but owners live in engineering and operations.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {Object.keys(roles).map((k) => (
                <label key={k} className="space-y-1">
                  <span className="text-xs font-semibold text-slate-700">{k}</span>
                  <input
                    value={(roles as any)[k]}
                    onChange={(e) => setRoles((r) => ({ ...r, [k]: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  />
                </label>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Ethical cues</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                <li>Be honest about uncertainty and limitations.</li>
                <li>Do not collect more data than you can protect and justify.</li>
                <li>Make security exceptions explicit and time-bound.</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Policy baseline</h3>
            </div>
            <p className="text-sm text-slate-700">
              Policies should be short, enforceable, and reviewed. A policy without ownership is just a document.
            </p>
            <div className="space-y-2 text-sm text-slate-800">
              {[
                { key: "acceptableUse", label: "Acceptable use and training" },
                { key: "accessControl", label: "Access control policy" },
                { key: "incidentResponse", label: "Incident response policy and runbooks" },
                { key: "vulnerabilityMgmt", label: "Vulnerability management and patching policy" },
                { key: "logging", label: "Logging, monitoring, and retention policy" },
                { key: "supplierRisk", label: "Supplier and third-party risk policy" },
              ].map((x) => (
                <label key={x.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(policySet as any)[x.key]}
                    onChange={(e) => setPolicySet((p) => ({ ...p, [x.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-200"
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Coverage</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{readiness}/100</p>
              <p className="mt-2 text-sm text-slate-700">{message}</p>
              <p className="mt-2 text-xs text-slate-600">
                Regulatory awareness without claims: many frameworks expect policies, evidence of operation, and continuous improvement.
              </p>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Framework alignment without jargon</p>
            <p className="text-sm text-slate-700">
              This studio aligns with common practice: identify risk, apply controls, detect issues, respond, and recover. The exact framework labels vary, but the work is consistent.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



