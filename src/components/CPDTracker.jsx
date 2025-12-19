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
  const { state, updateSection } = useCPD();
  const [hours, setHours] = useState(0);
  const trackId = resolveTrackId(courseId);
  const sectionId = "overall";

  const currentMinutes = useMemo(() => {
    const match = state.sections.find(
      (section) =>
        section.trackId === trackId &&
        section.levelId === levelId &&
        section.sectionId === sectionId
    );
    return match?.minutes || 0;
  }, [state.sections, trackId, levelId]);

  useEffect(() => {
    setHours(Math.round((currentMinutes / 60) * 10) / 10);
  }, [currentMinutes]);

  const onChange = (e) => {
    const value = Number(e.target.value) || 0;
    setHours(value);
    const nextMinutes = Math.max(0, value * 60);
    updateSection({
      trackId,
      levelId,
      sectionId,
      minutesDelta: nextMinutes - currentMinutes,
    });
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Track your CPD time for this level</p>
          <p className="text-xs text-gray-700">
            Suggested guided hours: {estimatedHours || "not specified"}. This stays in your browser only and is for your own CPD notes.
          </p>
          <Link
            href="/my-cpd"
            className="mt-2 inline-flex text-xs font-semibold text-sky-700 hover:text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            View in My CPD
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-800" htmlFor={`${courseId}-${levelId}-cpd`}>
            Hours recorded
          </label>
          <input
            id={`${courseId}-${levelId}-cpd`}
            type="number"
            min="0"
            step="0.5"
            value={hours}
            onChange={onChange}
            className="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring focus:ring-blue-200"
            aria-label="Record CPD hours for this level"
          />
        </div>
      </div>
    </div>
  );
}
