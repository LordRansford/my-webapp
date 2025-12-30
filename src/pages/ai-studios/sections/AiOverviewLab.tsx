"use client";

import React from "react";
import Link from "next/link";
import { Compass, ShieldCheck, ArrowUpRight } from "lucide-react";
import TryItLiveButton from "@/components/ai-studio/TryItLiveButton";
import ReadyToBuildCTA from "@/components/ai-studio/ReadyToBuildCTA";

export default function AiOverviewLab() {
  return (
    <section className="space-y-6" aria-label="AI Studio overview">
      <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-indigo-600" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-900">Overview</h2>
        </div>
        <p className="text-sm text-slate-700">
          AI is a tool for pattern-based prediction and generation. It can be valuable, but it is not a truth machine. This studio helps you build judgement:
          when to use AI, how to test it, and how to keep it safe.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">What you will learn here</h3>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>How to explain AI systems without hype.</li>
              <li>How models fail, and how failures can be quiet.</li>
              <li>How to evaluate usefulness, not just accuracy.</li>
              <li>How to design guardrails and human oversight.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <h3 className="text-xl font-semibold text-slate-900">How to use the studio</h3>
            <p className="text-sm text-slate-700">
              Start with fundamentals, then move through model types, data, inference, evaluation, and responsibility. Use the tools to see behaviours. Treat tool outputs as
              illustrative unless you have a real dataset and a real evaluation plan.
            </p>
            <div className="mt-4">
              <TryItLiveButton href="/ai-studio" feature="Dashboard" />
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-900">Safety first</p>
            </div>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>No external paid APIs here.</li>
              <li>No user data leaves your browser.</li>
              <li>Tools are lightweight and bounded.</li>
              <li>We warn when results are illustrative.</li>
            </ul>
          </div>

          <div className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_12px_30px_rgba(15,23,42,0.06)] p-6 space-y-3">
            <p className="text-sm font-semibold text-slate-900">Exit routes</p>
            <div className="flex flex-col gap-2">
              <Link href="/ai" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                AI course <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/studios/model-forge" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                Model Forge <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/studios" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline">
                Studios hub <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <ReadyToBuildCTA section="the basics" />
    </section>
  );
}



