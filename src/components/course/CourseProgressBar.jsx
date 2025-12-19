"use client";

import { useMemo } from "react";
import { useCPD } from "@/hooks/useCPD";
import { getCompletionForCourse, resolveTrackId } from "@/lib/cpd";

const courseTitles = {
  cybersecurity: "Cybersecurity",
  ai: "AI",
  "software-architecture": "Software Architecture",
  digitalisation: "Digitalisation",
  data: "Data",
};

export default function CourseProgressBar({ courseId, manifest, courseTitle }) {
  const { state } = useCPD();
  const trackId = resolveTrackId(courseId);

  const percent = useMemo(() => {
    const result = getCompletionForCourse(state, trackId, manifest || {});
    return result.percent;
  }, [state, trackId, manifest]);

  const displayTitle = courseTitle || courseTitles[courseId] || "Course";

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm" role="group" aria-label="Course progress">
      <div className="flex items-center justify-between text-sm font-semibold text-gray-800">
        <span>{displayTitle} course progress</span>
        <span aria-label={`${displayTitle} course ${percent} percent complete`}>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100" aria-hidden="true">
        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
