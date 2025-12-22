"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NotebookPen, ArrowUpRight } from "lucide-react";

const KEY = "rn_ai_studio_reflection_v1";

export default function AiStudioReflection() {
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
          This is the part that makes it CPD-useful: capture decisions, trade-offs, and guardrails. Write notes you can reuse when someone asks “why are we using AI here”.
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
          <li>What problem are you solving, and what would a non-AI solution look like?</li>
          <li>What are the top three failure modes, including quiet failures?</li>
          <li>What data is used, and what are the privacy boundaries?</li>
          <li>How will you evaluate usefulness and harms over time?</li>
          <li>Where does a human need to stay in the loop?</li>
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
          <Link href="/ai" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            AI course <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/studios" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            AI Studios hub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/studios/model-forge" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
            Model Forge <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}



