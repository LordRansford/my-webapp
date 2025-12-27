"use client";

import React, { useMemo, useState } from "react";
import { Radar, Target, Package } from "lucide-react";
import SwitchRow from "@/components/ui/SwitchRow";

type Lens = "Plain language" | "Technical context";

const motivations = [
  { title: "Money", plain: "Fraud, theft, extortion.", tech: "Ransomware, BEC, carding, crypto mining." },
  { title: "Access", plain: "Get a foothold for later.", tech: "Credential stuffing, supply chain compromise, persistence." },
  { title: "Influence", plain: "Manipulate trust or narratives.", tech: "Disinformation ops, account takeover, data leaks." },
  { title: "Disruption", plain: "Break services or cause chaos.", tech: "DDoS, wiper malware, destructive insider actions." },
];

export default function ThreatLandscapeLab() {
  const [lens, setLens] = useState<Lens>("Plain language");
  const [opportunistic, setOpportunistic] = useState(true);
  const [targeted, setTargeted] = useState(false);
  const [internal, setInternal] = useState(false);
  const [supplyChain, setSupplyChain] = useState(true);

  const summary = useMemo(() => {
    const items: string[] = [];
    items.push(opportunistic ? "Opportunistic threats are likely. Assume you will be scanned." : "Opportunistic scanning is not your main concern.");
    items.push(targeted ? "Targeted threats matter. Focus on your unique assets and trust boundaries." : "Targeted threats are lower priority right now.");
    items.push(internal ? "Internal threats matter. Prioritise least privilege and auditing." : "Internal threats are not your primary focus today.");
    items.push(supplyChain ? "Supply chain risk matters. Dependencies and vendors can become your attack surface." : "Supply chain risk is not your primary focus today.");
    return items;
  }, [opportunistic, targeted, internal, supplyChain]);

  return (
    <section className="space-y-6" aria-label="Threat landscape lab">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Radar className="h-5 w-5 text-rose-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Threat landscape</h2>
        </div>
        <p className="text-sm text-slate-700">
          Start in plain language. Threats are about people, incentives, and access. Technical details come second.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">1. Choose a lens</p>
            <div className="flex flex-wrap gap-2">
              {(["Plain language", "Technical context"] as Lens[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLens(l)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    lens === l ? "border-rose-300 bg-rose-50 text-rose-900" : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {motivations.map((m) => (
                <div key={m.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
                  <p className="text-sm font-semibold text-slate-900">{m.title}</p>
                  <p className="mt-2 text-sm text-slate-700">{lens === "Plain language" ? m.plain : m.tech}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-slate-900">2. Threat types to prioritise</h3>
            </div>
            <p className="text-sm text-slate-700">
              You are always exposed to opportunistic scanning. Targeted threats are about your unique value and weak trust boundaries.
            </p>
            <div className="grid gap-2 md:grid-cols-2 text-sm text-slate-800">
              {[
                { key: "opportunistic", label: "Opportunistic vs targeted", a: "Opportunistic", b: "Targeted", vA: opportunistic, setA: setOpportunistic, vB: targeted, setB: setTargeted },
                { key: "internal", label: "Internal vs external", a: "Internal", b: "External", vA: internal, setA: setInternal, vB: true, setB: () => null },
              ].map((row) => (
                <div key={row.key} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">{row.label}</p>
                  <SwitchRow label={row.a} checked={row.vA} tone="rose" onCheckedChange={(checked) => row.setA(checked)} />
                  {row.key === "opportunistic" ? (
                    <SwitchRow
                      label={row.b}
                      checked={row.vB as any}
                      tone="rose"
                      onCheckedChange={(checked) => (row.setB as any)(checked)}
                    />
                  ) : (
                    <p className="text-xs text-slate-600">External threats always exist. The question is how you control access and blast radius.</p>
                  )}
                </div>
              ))}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-amber-600" aria-hidden="true" />
                  <p className="text-sm font-semibold text-slate-900">Supply chain risk</p>
                </div>
                <SwitchRow
                  label="Dependencies, vendors, and build pipeline risk"
                  checked={supplyChain}
                  tone="amber"
                  onCheckedChange={setSupplyChain}
                />
                <p className="text-xs text-slate-600">Supply chain risk often bypasses perimeter controls by abusing trusted relationships.</p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">What this implies</p>
              <ul className="mt-2 list-disc pl-5 text-sm text-slate-700 space-y-1">
                {summary.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Key habit</p>
            <p className="text-sm text-slate-700">
              Always ask: what is the attacker trying to achieve, and what do they need to cross to do it? That leads you to controls that matter.
            </p>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">No fear language</p>
            <p className="text-sm text-slate-700">
              The goal is calm resilience. Security work is mostly boring consistency: patching, access control, logging, and good defaults.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}



