"use client";

import { useEffect, useState } from "react";
import { getLevelCompletion } from "@/lib/progress";

export default function LevelProgressBar({ courseId, levelId, sectionIds }) {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const { percent } = getLevelCompletion(courseId, levelId, sectionIds);
    setPercent(percent);
  }, [courseId, levelId, sectionIds]);

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
