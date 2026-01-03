"use client";

export default function CPDHoursTotal({ courseName, totalHours }) {
  const total = Number(totalHours) || 0;

  return (
    <div className="mb-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD hours</div>
      <div className="mt-2 text-lg font-semibold text-slate-900">{courseName}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-3xl font-semibold text-slate-900">{total ? total.toFixed(0) : "0"}</div>
        <div className="text-sm font-semibold text-slate-600">hours</div>
      </div>
      <div className="mt-2 text-sm text-slate-700">
        Hours are fixed by the course design. Timed assessment time is included once on pass.
      </div>
    </div>
  );
}
