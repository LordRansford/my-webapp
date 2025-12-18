"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "ransfordsnotes-cpd";
const isBrowser = typeof window !== "undefined";

function readStore() {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(state) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function getTotalCpdHours(courseId) {
  const state = readStore();
  const course = state[courseId] || {};
  return Object.values(course).reduce((sum, val) => sum + (Number(val) || 0), 0);
}

export default function CPDTracker({ courseId, levelId, estimatedHours }) {
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const state = readStore();
    const course = state[courseId] || {};
    const current = course[levelId] ?? 0;
    setHours(Number(current) || 0);
  }, [courseId, levelId]);

  const onChange = (e) => {
    const value = Number(e.target.value) || 0;
    setHours(value);
    const state = readStore();
    if (!state[courseId]) state[courseId] = {};
    state[courseId][levelId] = value;
    writeStore(state);
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">Track your CPD time for this level</p>
          <p className="text-xs text-gray-700">
            Suggested guided hours: {estimatedHours || "not specified"}. This stays in your browser only and is for your own CPD notes.
          </p>
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
