"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, ArrowUpRight } from "lucide-react";

const KEY = "rn_cyber_studio_reflection_v1";

export default function CyberReflection() {
  const [text, setText] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setText(raw);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, text);
    } catch {
      // ignore
    }
  }, [text]);

  return (
    <section className="space-y-6" aria-label="Reflection and next steps">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Reflection and next steps</h2>
        </div>
        <p className="text-sm text-slate-700">
          The point of security work is resilient outcomes, not perfect paperwork. Write notes you can use when prioritising controls and explaining trade-offs.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>Which two risks matter most to the organisation, and why?</li>
          <li>Where are the key trust boundaries, and what controls protect them?</li>
          <li>What would you want to detect within 5 minutes?</li>
          <li>What is your recovery plan if a critical system is encrypted or unavailable?</li>
          <li>What is one control you can operate well this quarter?</li>
        </ul>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Write notes to your future self."
          className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        />
        <p className="text-xs text-slate-600">Saved locally by your browser. No accounts required.</p>
      </div>

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <p className="text-sm font-semibold text-slate-900">Exit routes</p>
        <div className="flex flex-col gap-2">
          <Link href="/cybersecurity" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Cybersecurity course <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/tools/cybersecurity" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Cyber tools <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/data-studios" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Data and Digitalisation Studio <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}



