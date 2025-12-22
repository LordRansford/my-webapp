"use client";

const OPTIONS = [
  { value: "kids", label: "Kids", help: "Simple labels and minimal detail." },
  { value: "students", label: "Students", help: "Teaches concepts with gentle structure." },
  { value: "professionals", label: "Professionals", help: "Direct, review-friendly phrasing." },
];

export default function StepAudience({ value, onChange, errors = [] }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Audience 👥</h2>
        <p className="mt-1 text-sm text-slate-700">Who is this for?</p>
        <p className="mt-2 text-xs text-slate-600">This affects how labels and explanations are written. It does not change validation rules.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
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


