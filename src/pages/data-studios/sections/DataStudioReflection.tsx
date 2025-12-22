"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, ArrowUpRight } from "lucide-react";

const KEY = "rn_data_studio_reflection_v1";

export default function DataStudioReflection() {
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
          Data leadership is about making decisions defensible. Write notes you can use later when someone asks why you collected something or why you trusted a dashboard.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>What decision is this data meant to improve?</li>
          <li>Who owns definitions, access decisions, and quality controls?</li>
          <li>What is the biggest risk to trust (privacy, bias, quality, drift)?</li>
          <li>What is one small governance-led improvement you can deliver in 4 to 6 weeks?</li>
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
          <Link href="/data" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Data course <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/digitalisation" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Digitalisation notes <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/dev-studios" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Software Development Studio <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}



