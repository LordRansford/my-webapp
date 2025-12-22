import Link from "next/link";
import type { LearnerLink } from "@/lib/learnerPaths";

type Props = {
  title?: string;
  links: LearnerLink[];
};

export default function NextActionsCard({ title = "Next actions", links }: Props) {
  if (!links?.length) return null;

  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-sm" aria-label={title}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={`${l.kind}:${l.href}`} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="m-0 text-sm font-semibold text-slate-900">
                  <Link href={l.href} className="underline decoration-slate-300 underline-offset-4 hover:decoration-slate-600">
                    {l.label}
                  </Link>
                </p>
                {l.note ? <p className="mt-1 text-xs text-slate-700">{l.note}</p> : null}
              </div>
              <span className="text-xs font-semibold text-slate-700" aria-hidden="true">
                Open →
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}


