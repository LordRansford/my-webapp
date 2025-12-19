import React from "react";

export function PreviewBanner() {
  return (
    <div className="sticky top-2 z-30 mx-auto max-w-5xl px-4">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg shadow-slate-900/10 px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-semibold uppercase tracking-wide">Preview</span>
          <div className="space-y-0.5">
            <p className="text-sm font-semibold">Read-only template viewer</p>
            <p className="text-xs text-slate-200">No downloads, exports, or saved state. Explore safely.</p>
          </div>
        </div>
        <div className="text-xs font-semibold text-slate-200">Live calculators intentionally disabled</div>
      </div>
    </div>
  );
}

export default PreviewBanner;
