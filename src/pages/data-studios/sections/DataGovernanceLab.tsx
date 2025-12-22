"use client";

import React, { useMemo, useState } from "react";
import { ShieldCheck, Fingerprint, ScrollText } from "lucide-react";

type Role = "Owner" | "Steward" | "Custodian" | "Consumer";

const roleCopy: Record<Role, string> = {
  Owner: "Accountable for purpose, definition, access decisions, and risk acceptance.",
  Steward: "Maintains meaning, quality rules, and change control for a dataset or domain.",
  Custodian: "Runs the platforms and implements controls. Owns technical operations, not meaning.",
  Consumer: "Uses the data for decisions. Must follow policy and report issues.",
};

export default function DataGovernanceLab() {
  const [dataset, setDataset] = useState("Appointments");
  const [owner, setOwner] = useState("Service Director");
  const [steward, setSteward] = useState("Operations Lead");
  const [custodian, setCustodian] = useState("Data Platform Team");

  const [policy, setPolicy] = useState({
    retention: true,
    access: true,
    classification: true,
    changeControl: false,
    lineage: false,
  });

  const [lineage, setLineage] = useState("Source system → operational store → analytics store → KPI dashboard");
  const [metadata, setMetadata] = useState("Definition, owner, refresh frequency, quality rules, access groups");

  const readiness = useMemo(() => {
    const values = Object.values(policy);
    const on = values.filter(Boolean).length;
    return Math.round((on / values.length) * 100);
  }, [policy]);

  const badge = useMemo(() => {
    if (readiness < 40) return { tone: "bg-rose-100 text-rose-800 ring-rose-200", label: "Not governed" };
    if (readiness < 80) return { tone: "bg-amber-100 text-amber-800 ring-amber-200", label: "Partially governed" };
    return { tone: "bg-emerald-100 text-emerald-800 ring-emerald-200", label: "Governance-ready" };
  }, [readiness]);

  return (
    <section className="space-y-6" aria-label="Data governance and management lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Data governance and management</h2>
        </div>
        <p className="text-sm text-slate-700">
          Governance is how you keep trust at scale. It is not a committee. It is ownership, decision rights, and operational controls.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">1. Ownership and accountability</h3>
            <p className="text-sm text-slate-700">
              Use roles to clarify who decides. This avoids the classic failure mode: everyone is responsible, so nobody is.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Dataset or domain</span>
                <input value={dataset} onChange={(e) => setDataset(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <p className="text-sm font-semibold text-slate-900">Governance readiness</p>
                <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ring-1 ${badge.tone}`}>{badge.label}</p>
                <p className="mt-2 text-sm text-slate-700">Score: {readiness}/100</p>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Owner</span>
                <input value={owner} onChange={(e) => setOwner(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Steward</span>
                <input value={steward} onChange={(e) => setSteward(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">Custodian</span>
                <input value={custodian} onChange={(e) => setCustodian(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200" />
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Role hints</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {(Object.keys(roleCopy) as Role[]).map((r) => (
                  <li key={r}>
                    <span className="font-semibold">{r}</span>: {roleCopy[r]}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ScrollText className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Policies and standards</h3>
            </div>
            <p className="text-sm text-slate-700">
              Policies are the rules that keep decisions consistent. Standards make implementation repeatable. Keep them short and enforceable.
            </p>
            <div className="space-y-2 text-sm text-slate-800">
              {[
                { key: "retention", label: "Retention and deletion rules are defined" },
                { key: "access", label: "Access is least-privilege with reviews" },
                { key: "classification", label: "Data classification exists and is used" },
                { key: "changeControl", label: "Change control for definitions and schema" },
                { key: "lineage", label: "Lineage is captured and maintained" },
              ].map((x) => (
                <label key={x.key} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={(policy as any)[x.key]}
                    onChange={(e) => setPolicy((p) => ({ ...p, [x.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200"
                  />
                  <span>{x.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-sky-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">3. Metadata and lineage</h3>
            </div>
            <p className="text-sm text-slate-700">
              Metadata is how you make the data explainable. Lineage is how you prove where it came from and what happened to it.
            </p>
            <label className="space-y-1 block">
              <span className="text-xs font-semibold text-slate-700">Lineage sketch</span>
              <textarea
                value={lineage}
                onChange={(e) => setLineage(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs font-semibold text-slate-700">Key metadata fields</span>
              <textarea
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              />
            </label>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Access control principles</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Least privilege by default.</li>
              <li>Separate operational access from analytical access when risk differs.</li>
              <li>Audit access to sensitive datasets.</li>
              <li>Time-bound approvals for high-risk access.</li>
              <li>Do not rely on obscurity or shared credentials.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Jargon-free alignment</p>
            <p className="text-sm text-slate-700">
              This lab uses DAMA-style thinking: clarify ownership, define standards, capture metadata, and make change controlled. The point is practical governance, not vocabulary.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



