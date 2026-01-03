"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getInitialCPDState, getTotalsForTrack, resolveTrackId } from "@/lib/cpd";
import { useCPD } from "@/hooks/useCPD";

export function getTotalCpdHours(courseId) {
  const state = getInitialCPDState();
  const trackId = resolveTrackId(courseId);
  const totals = getTotalsForTrack(state, trackId);
  return Math.round((totals.totalMinutes / 60) * 10) / 10;
}

export default function CPDTracker({ courseId, levelId, estimatedHours }) {
  const { state, isAuthed } = useCPD();
  const trackId = resolveTrackId(courseId);

  const loggedMinutes = useMemo(() => {
    return state.sections
      .filter((s) => s.trackId === trackId && s.levelId === levelId && s.sectionId !== "overall")
      .reduce((sum, s) => sum + (Number(s.minutes) || 0), 0);
  }, [state.sections, trackId, levelId]);

  const loggedHours = useMemo(() => Math.round((loggedMinutes / 60) * 10) / 10, [loggedMinutes]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">CPD tracking</p>
          <p className="text-xs text-gray-700">
            Fixed hours for this level: {estimatedHours || "not specified"}. Timed assessment time is included once on pass.
          </p>
          <Link
            href="/my-cpd"
            className="mt-2 inline-flex text-xs font-semibold text-sky-700 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            View in My CPD
          </Link>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link href="/pricing" className="text-xs font-semibold text-emerald-700 hover:underline">
              Pricing and CPD
            </Link>
            {!isAuthed ? (
              <Link href="/signin" className="text-xs font-semibold text-slate-700 hover:underline">
                Sign in to record progress
              </Link>
            ) : null}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-gray-700">Progress minutes</div>
          <div className="text-base font-semibold text-gray-900">{loggedHours.toFixed(1)} hours</div>
        </div>
      </div>
    </div>
  );
}
