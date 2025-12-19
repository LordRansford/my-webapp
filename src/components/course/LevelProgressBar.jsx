"use client";

import { useMemo } from "react";
import { useCPD } from "@/hooks/useCPD";
import { getCompletionForLevel, resolveTrackId } from "@/lib/cpd";

export default function LevelProgressBar({ courseId, levelId, sectionIds = [] }) {
  const { state } = useCPD();
  const trackId = resolveTrackId(courseId);

  const percent = useMemo(() => {
    const result = getCompletionForLevel(state, trackId, levelId, sectionIds);
    return result.percent;
  }, [state, trackId, levelId, sectionIds]);

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white/80 p-3 shadow-sm" role="group" aria-label="Level progress">
      <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
        <span>Level progress</span>
        <span aria-label={`Level ${percent} percent complete`}>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
