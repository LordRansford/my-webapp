"use client";

import { useMemo, useState } from "react";
import { buildAdrStubMarkdown } from "@/lib/architecture-diagrams/docs/adr";

export default function ADRPanel({ pack, assumptions, omissions }) {
  const [open, setOpen] = useState(false);
  const markdown = useMemo(() => {
    return buildAdrStubMarkdown({
      input: pack.input,
      inputVersion: pack.inputVersion,
      assumptions,
      omissions,
    });
  }, [assumptions, omissions, pack]);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">ADR stub</p>
          <p className="mt-1 text-sm text-slate-700">These are drafts to support discussion.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3">
            <pre className="whitespace-pre-wrap text-xs text-slate-800">{markdown}</pre>
          </div>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(markdown);
              } catch {
                // ignore
              }
            }}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Copy ADR
          </button>
        </div>
      ) : null}
    </div>
  );
}


