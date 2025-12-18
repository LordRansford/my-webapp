"use client";

import { useState } from "react";
import { PenLine, Layers, CheckCircle2, TestTube2 } from "lucide-react";

export default function DesignKataTool() {
  const [story, setStory] = useState("");
  const [flow, setFlow] = useState("");
  const [data, setData] = useState("");
  const [tests, setTests] = useState("");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
          <PenLine className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">Design a tiny feature</p>
          <p className="text-xs text-slate-600">Move from user story to functions and tests.</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Layers className="h-4 w-4" aria-hidden="true" />
            User story
          </span>
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            rows={2}
            placeholder="As a user, I want to..."
          />
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            Happy path steps
          </span>
          <textarea
            value={flow}
            onChange={(e) => setFlow(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            rows={2}
            placeholder="List the main steps in order."
          />
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Layers className="h-4 w-4" aria-hidden="true" />
            Data and dependencies
          </span>
          <textarea
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            rows={2}
            placeholder="Which systems, APIs, or data do you need?"
          />
        </label>

        <label className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-700">
          <span className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <TestTube2 className="h-4 w-4" aria-hidden="true" />
            Tests to protect it
          </span>
          <textarea
            value={tests}
            onChange={(e) => setTests(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
            rows={2}
            placeholder="What should never break?"
          />
        </label>
      </div>
    </div>
  );
}
