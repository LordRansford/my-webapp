"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function CPDAssessmentPromo(props: {
  courseName: string;
  levelLabel: string;
  assessmentHref: string;
  prepHref?: string;
}) {
  const { data: session } = useSession();
  const isAuthed = Boolean(session?.user?.id);

  return (
    <div className="not-prose rounded-3xl border border-slate-200 bg-white/95 p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">CPD assessment</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">{props.courseName} {props.levelLabel}</h2>
          <p className="mt-2 text-sm text-slate-700">
            Certificates support your career and help keep the site free for learners using the browser only tier.
            Sign in before you learn if you want progress and CPD evidence recorded.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isAuthed ? (
            <Link
              href="/signin"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Sign in
            </Link>
          ) : null}
          <Link
            href={props.assessmentHref}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Take the assessment
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
          >
            Pricing
          </Link>
          {props.prepHref ? (
            <Link
              href={props.prepHref}
              className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-100"
            >
              CPD prep pack
            </Link>
          ) : null}
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-600">
        During timed exams, Professor Ransford is paused and copy actions are restricted to reduce casual cheating.
      </div>
    </div>
  );
}

