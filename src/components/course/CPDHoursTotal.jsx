"use client";

import { useEffect, useState } from "react";
import { getTotalCpdHours } from "@/components/CPDTracker";

export default function CPDHoursTotal({ courseId, courseName }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(getTotalCpdHours(courseId));
  }, [courseId]);

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Your recorded CPD hours for {courseName}</p>
      <p className="text-base font-semibold text-gray-800">{total.toFixed(1)} hours</p>
      <p className="text-xs text-gray-700">
        This stays in your browser only. If you need official CPD credit, log your time with your professional body as well.
      </p>
    </div>
  );
}
