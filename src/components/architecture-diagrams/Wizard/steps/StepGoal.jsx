"use client";

const OPTIONS = [
  { value: "explain", label: "Explain a system", help: "Clarity for people who are new to the system." },
  { value: "design-review", label: "Design review", help: "Check responsibilities, boundaries, and failure modes." },
  { value: "security-review", label: "Security review", help: "Focus on trust boundaries, sensitive flows, and access." },
  { value: "data-review", label: "Data review", help: "Focus on data stores, flows, and sensitive categories." },
  { value: "cpd", label: "CPD artefact", help: "Create a clean summary you can use as evidence." },
];

export default function StepGoal({ value, onChange, errors = [] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Goal 🎯</h2>
        <p className="mt-1 text-sm text-slate-700">Why are you creating diagrams?</p>
      </div>

      <div className="grid gap-3">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
              }`}
            >
              <p className="text-sm font-semibold">{opt.label}</p>
              <p className={`mt-1 text-xs ${selected ? "text-white/80" : "text-slate-600"}`}>{opt.help}</p>
            </button>
          );
        })}
      </div>

      {errors.length ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900">
          <p className="font-semibold">Please fix the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}


