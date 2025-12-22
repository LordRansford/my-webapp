"use client";

export default function VariantPicker({ variants, selectedId, onSelect }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" role="tablist" aria-label="Diagram variants">
      {variants.map((v) => {
        const active = v.id === selectedId;
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onSelect(v.id)}
            role="tab"
            aria-selected={active}
            className={`rounded-2xl border px-4 py-3 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
              active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            <p className="text-sm font-semibold">{v.label}</p>
            <p className={`mt-1 text-xs ${active ? "text-white/80" : "text-slate-600"}`}>
              {v.id === "minimal" ? "Essential nodes and short labels." : null}
              {v.id === "stakeholder" ? "Plain language and grouped structure." : null}
              {v.id === "security" ? "Boundaries and sensitive flows." : null}
              {v.id === "data" ? "Data stores and flow direction." : null}
              {v.id === "ops" ? "Runtime separation and dependencies." : null}
            </p>
          </button>
        );
      })}
    </div>
  );
}


