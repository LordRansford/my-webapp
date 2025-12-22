"use client";

import React, { useMemo, useState } from "react";
import { LifeBuoy, RotateCcw, Clock } from "lucide-react";

export default function ResilienceRecoveryLab() {
  const [rto, setRto] = useState(2);
  const [rpo, setRpo] = useState(2);
  const [backupTests, setBackupTests] = useState(true);
  const [immutableBackups, setImmutableBackups] = useState(false);
  const [runbooks, setRunbooks] = useState(true);

  const rtoLabel = useMemo(() => ["Hours", "1 hour", "15 minutes", "5 minutes", "Near zero"][rto], [rto]);
  const rpoLabel = useMemo(() => ["1 day", "4 hours", "1 hour", "15 minutes", "Near zero"][rpo], [rpo]);

  const guidance = useMemo(() => {
    const g: string[] = [];
    g.push(`RTO is how long you can be down. Your current target: ${rtoLabel}.`);
    g.push(`RPO is how much data you can lose. Your current target: ${rpoLabel}.`);
    if (!backupTests) g.push("Backups without restore tests are a false sense of safety.");
    if (immutableBackups) g.push("Immutable backups reduce ransomware impact, but require careful operations and cost management.");
    if (runbooks) g.push("Runbooks reduce panic. Write the first version before you need it.");
    return g;
  }, [rtoLabel, rpoLabel, backupTests, immutableBackups, runbooks]);

  return (
    <section className="space-y-6" aria-label="Resilience and recovery lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <LifeBuoy className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Resilience and recovery</h2>
        </div>
        <p className="text-sm text-slate-700">
          Resilience is not optional. Incidents happen. The question is whether recovery is planned or improvised.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">1. Recovery objectives</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">RTO (downtime)</span>
                <input type="range" min={0} max={4} step={1} value={rto} onChange={(e) => setRto(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">{rtoLabel}</span>
              </label>
              <label className="space-y-1">
                <span className="text-xs font-semibold text-slate-700">RPO (data loss)</span>
                <input type="range" min={0} max={4} step={1} value={rpo} onChange={(e) => setRpo(Number(e.target.value))} className="w-full" />
                <span className="text-xs text-slate-600">{rpoLabel}</span>
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-sm font-semibold text-slate-900">Operational meaning</p>
              <p className="mt-2 text-sm text-slate-700">
                If your RTO is short, you need automation, rehearsed procedures, and clear ownership. If your RPO is short, you need frequent replication and controlled change.
              </p>
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-amber-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Backup and continuity basics</h3>
            </div>
            <div className="space-y-2 text-sm text-slate-800">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={backupTests} onChange={(e) => setBackupTests(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Restore tests are scheduled and tracked
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={immutableBackups} onChange={(e) => setImmutableBackups(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Backups are protected against deletion or encryption
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={runbooks} onChange={(e) => setRunbooks(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200" />
                Runbooks exist for common failure modes
              </label>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">Guidance</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {guidance.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Resilience is a business decision</p>
            <p className="text-sm text-slate-700">
              Recovery objectives should match real consequences: safety, legal exposure, financial loss, and trust. Make them explicit and revisit them.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}


