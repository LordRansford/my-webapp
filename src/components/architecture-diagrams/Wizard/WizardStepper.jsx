"use client";

export default function WizardStepper({ steps, activeId, onJump }) {
  return (
    <nav aria-label="Wizard progress" className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Progress</p>
      <ol className="mt-4 space-y-2">
        {steps.map((s, idx) => {
          const active = s.id === activeId;
          const done = steps.findIndex((x) => x.id === activeId) > idx;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onJump(s.id)}
                className={`w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                  active
                    ? "bg-slate-900 text-white"
                    : done
                      ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-100 hover:bg-emerald-100"
                      : "bg-slate-50 text-slate-800 ring-1 ring-slate-200 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span>
                    <span className="mr-2 text-xs font-semibold opacity-80">{idx + 1}</span>
                    {s.label}
                  </span>
                  {active ? <span className="text-xs font-semibold opacity-80">Current</span> : null}
                </div>
                {s.hint ? <p className={`mt-1 text-xs ${active ? "text-white/80" : "text-slate-600"}`}>{s.hint}</p> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}


