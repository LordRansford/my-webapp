"use client";

export default function ComputeTipsPanel({ tips }: { tips: string[] }) {
  if (!tips?.length) return null;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-700">Compute tips</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">How to reduce compute</p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-700">
        {tips.slice(0, 4).map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </div>
  );
}


