"use client";

import React, { useId, useState } from "react";

export type HowToPlayContent = {
  objective: string;
  how: string[];
  improves: string[];
};

export default function HowToPlayDrawer({ content }: { content: HowToPlayContent }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mt-2">
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">?</span>
        How to play
      </button>

      {open ? (
        <div id={panelId} className="mt-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-800">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Objective</p>
              <p className="text-sm text-slate-800">{content.objective}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">How to play</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                {content.how.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">What this helps improve</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-slate-800">
                {content.improves.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


