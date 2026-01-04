"use client";

import React from "react";
import type { AIStudioRunReceipt } from "@/lib/ai-studio/projects/store";

export default function RunReceiptPanel(props: { receipt: AIStudioRunReceipt }) {
  const r = props.receipt;
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700 space-y-2">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <p className="font-semibold text-slate-900">Receipt</p>
        <p className="font-mono text-slate-600">{r.runId}</p>
      </div>
      {r.toolId ? (
        <p className="text-[11px] text-slate-600">
          tool: <span className="font-mono">{r.toolId}</span>
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">mode</p>
          <p className="mt-1 text-slate-900">{r.mode}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">duration</p>
          <p className="mt-1 text-slate-900">{r.durationMs} ms</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">credits charged</p>
          <p className="mt-1 text-slate-900">{r.creditsCharged}</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">input / output</p>
          <p className="mt-1 text-slate-900">
            {r.inputBytes} bytes / {r.outputBytes} bytes
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">free tier applied</p>
          <p className="mt-1 text-slate-900">
            {r.freeTierAppliedMs} ms free · {r.paidMs} ms paid
          </p>
        </div>
      </div>
      {Array.isArray(r.guidanceTips) && r.guidanceTips.length > 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-[11px] font-semibold text-slate-600">tips</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">
            {r.guidanceTips.slice(0, 4).map((t, i) => (
              <li key={i} className="text-slate-700">
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

