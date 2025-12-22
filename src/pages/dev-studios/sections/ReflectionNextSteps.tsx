"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { NotebookPen, ArrowUpRight } from "lucide-react";
import { SecurityBanner } from "@/components/dev-studios/SecurityBanner";

export default function ReflectionNextSteps() {
  const [reflection, setReflection] = useState("");
  const prompts = useMemo(
    () => [
      "What is the single biggest risk if this system ships as designed?",
      "Which decision would you want written down as an Architecture Decision Record (ADR), and why?",
      "What failure should be graceful, and how will you design for that now?",
      "Where will you add logging and metrics first, and what question will they answer?",
      "If you had to halve the budget, what would you simplify without harming safety?",
    ],
    []
  );

  return (
    <section aria-label="Reflection and next steps" className="space-y-6">
      <SecurityBanner />

      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-4">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Reflection and next steps</h2>
        </div>
        <p className="text-sm text-slate-700">
          This studio is about reasoning, not just building. Write down what you learned so you can defend decisions later.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Reflection prompts</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              {prompts.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={8}
              placeholder="Write notes to your future self."
              className="w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-800 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200"
            />
            <p className="text-xs text-slate-600">Saved locally by your browser. No accounts required for reflection notes.</p>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Exit routes</p>
            <div className="space-y-2">
              <Link href="/software-architecture" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                Software architecture notes <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/cybersecurity" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                Cybersecurity notes <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/studios" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                AI studios <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">How this prepares you for real work</p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>You can separate requirements from solutions.</li>
              <li>You can explain boundaries and interfaces with clear reasons.</li>
              <li>You can design APIs that behave under failure and abuse.</li>
              <li>You can plan deployments that avoid panic rollbacks.</li>
              <li>You can talk about trade-offs without pretending there is a perfect answer.</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}



