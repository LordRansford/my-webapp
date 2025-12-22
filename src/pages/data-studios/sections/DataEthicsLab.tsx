"use client";

import React, { useMemo, useState } from "react";
import { HandHeart, Lock, Scale, Eye } from "lucide-react";

export default function DataEthicsLab() {
  const [privacyByDesign, setPrivacyByDesign] = useState(true);
  const [purposeLimit, setPurposeLimit] = useState(true);
  const [minimise, setMinimise] = useState(true);
  const [oversight, setOversight] = useState(false);
  const [transparency, setTransparency] = useState(false);
  const [biasCheck, setBiasCheck] = useState(false);

  const score = useMemo(() => {
    const flags = [privacyByDesign, purposeLimit, minimise, oversight, transparency, biasCheck];
    return Math.round((flags.filter(Boolean).length / flags.length) * 100);
  }, [privacyByDesign, purposeLimit, minimise, oversight, transparency, biasCheck]);

  const note = useMemo(() => {
    if (score < 40) return "High risk. You are collecting and using data without enough safeguards or explainability.";
    if (score < 80) return "Getting there. Add oversight and transparency so people can trust the system and challenge it.";
    return "Solid baseline. Keep reviewing as the context changes and new uses appear.";
  }, [score]);

  return (
    <section className="space-y-6" aria-label="Ethical and responsible data use lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <HandHeart className="h-5 w-5 text-rose-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Ethical and responsible data use</h2>
        </div>
        <p className="text-sm text-slate-700">
          Ethical data practice is not a slogan. It is privacy by design, clear purpose, transparency, and human oversight.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Lock className="h-5 w-5 text-emerald-600 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Privacy by design</p>
                  <p className="text-sm text-slate-700">Defaults protect people. Sensitive data is controlled and auditable.</p>
                  <input type="checkbox" checked={privacyByDesign} onChange={(e) => setPrivacyByDesign(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Eye className="h-5 w-5 text-indigo-600 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Transparency</p>
                  <p className="text-sm text-slate-700">People can understand what is collected, why, and what decisions it affects.</p>
                  <input type="checkbox" checked={transparency} onChange={(e) => setTransparency(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-200" />
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <Scale className="h-5 w-5 text-amber-600 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Bias and fairness checks</p>
                  <p className="text-sm text-slate-700">You check for uneven impact across groups and document limitations.</p>
                  <input type="checkbox" checked={biasCheck} onChange={(e) => setBiasCheck(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-200" />
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                <HandHeart className="h-5 w-5 text-rose-600 mt-0.5" aria-hidden="true" />
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-900">Human oversight</p>
                  <p className="text-sm text-slate-700">High impact decisions can be challenged, reviewed, and reversed.</p>
                  <input type="checkbox" checked={oversight} onChange={(e) => setOversight(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-200" />
                </div>
              </label>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-slate-900">Purpose and minimisation</p>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" checked={purposeLimit} onChange={(e) => setPurposeLimit(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Purpose limitation: new uses require review
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-800">
                <input type="checkbox" checked={minimise} onChange={(e) => setMinimise(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Data minimisation: collect only what is needed
              </label>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Ethics readiness</p>
            <p className="text-3xl font-semibold text-slate-900">{score}/100</p>
            <p className="text-sm text-slate-700">{note}</p>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Tie-ins to other subjects</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>Cybersecurity: access control, auditing, retention, incident response.</li>
              <li>AI: bias, quiet failures, explainability, human oversight.</li>
              <li>Engineering: safe defaults, observability, change control.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



