"use client";

import { useEffect, useState } from "react";
import { setSectionComplete, getProgress } from "@/lib/progress";

export default function SectionProgressToggle({ courseId, levelId, sectionId }) {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const progress = getProgress(courseId);
    const initial = progress?.[levelId]?.[sectionId] ?? false;
    setChecked(initial);
  }, [courseId, levelId, sectionId]);

  const onChange = () => {
    const next = !checked;
    setChecked(next);
    setSectionComplete(courseId, levelId, sectionId, next);
  };

  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition ${
        checked ? "border-green-500 bg-green-50 text-green-800" : "border-gray-200 bg-white text-gray-700"
      } focus:outline-none focus:ring focus:ring-blue-200`}
    >
      <span
        aria-hidden="true"
        className={`flex h-3 w-3 items-center justify-center rounded-full border ${
          checked ? "border-green-600 bg-green-500" : "border-gray-400"
        }`}
      />
      {checked ? "Marked complete" : "Mark as complete"}
    </button>
  );
}
