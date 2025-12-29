"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ransfordsnotes-cpd";

const readCpdStore = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

interface CourseProgressProps {
  courseId: string;
  levelIds: string[];
}

/**
 * Reusable CourseProgress component matching CPD page styling
 * Shows progress based on local CPD entries
 */
export default function CourseProgress({ courseId, levelIds }: CourseProgressProps) {
  const [tracked, setTracked] = useState(0);

  useEffect(() => {
    const store = readCpdStore();
    const course = store?.[courseId] || {};
    const touched = levelIds.filter((id) => Number(course[id] || 0) > 0).length;
    setTracked(touched);
  }, [courseId, levelIds]);

  const total = levelIds.length;
  const percent = total ? Math.round((tracked / total) * 100) : 0;

  // Don't show if no progress
  if (tracked === 0) return null;

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
        <span>{tracked} of {total} levels with time logged</span>
        <span>{percent}%</span>
      </div>
      <div className="mt-2 h-2 w-full rounded-full bg-slate-100" aria-hidden="true">
        <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500" style={{ width: `${percent}%` }} />
      </div>
      <p className="mt-2 text-xs text-slate-500">Progress uses your local CPD entries in this browser.</p>
    </div>
  );
}

