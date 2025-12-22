"use client";

export default function ComputeMeter({
  freeUsed,
  paidUsed,
  freeCap,
}: {
  freeUsed: number;
  paidUsed: number;
  freeCap: number;
}) {
  const total = Math.max(1, freeCap);
  const freePct = Math.min(100, Math.round((freeUsed / total) * 100));
  const paidPct = Math.min(100, Math.round((paidUsed / total) * 100));

  return (
    <div>
      <div className="h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100" aria-label="Compute meter">
        <div className="flex h-full w-full">
          <div className="h-full bg-emerald-500" style={{ width: `${freePct}%` }} title="Free tier portion" aria-label="Free tier portion" />
          <div className="h-full bg-amber-500" style={{ width: `${Math.max(0, paidPct)}%` }} title="Above free tier portion" aria-label="Above free tier portion" />
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-700">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
          Free
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          Above free tier
        </span>
      </div>
    </div>
  );
}


