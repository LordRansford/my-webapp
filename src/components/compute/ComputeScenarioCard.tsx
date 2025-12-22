"use client";

export default function ComputeScenarioCard({
  title,
  note,
  mediumRunsPerTenCredits,
  largeRunCredits,
  browserOnlyCostsZero,
}: {
  title: string;
  note: string;
  mediumRunsPerTenCredits?: number;
  largeRunCredits?: number;
  browserOnlyCostsZero?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Scenario</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-xs text-slate-700">{note}</p>

      <ul className="mt-3 space-y-1 text-xs text-slate-700">
        {typeof mediumRunsPerTenCredits === "number" ? (
          <li>
            Estimated runs per 10 credits: <span className="font-semibold">{mediumRunsPerTenCredits}</span>
          </li>
        ) : null}
        {typeof largeRunCredits === "number" ? (
          <li>
            One large run: <span className="font-semibold">{largeRunCredits}</span> credits (estimate)
          </li>
        ) : null}
        {browserOnlyCostsZero ? <li>Browser-only mode: <span className="font-semibold">0</span> credits</li> : null}
      </ul>

      <p className="mt-3 text-[11px] leading-relaxed text-slate-600">
        These are estimates for learning. Costs can vary by device, input size, and how many steps you run.
      </p>
    </div>
  );
}


