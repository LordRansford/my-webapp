"use client";

export default function CPDHoursTotal({ courseName, totalHours }) {
  const total = Number(totalHours) || 0;

  return (
    <div className="mb-4 rounded-2xl border border-gray-200 bg-white/85 p-4 shadow-sm">
      <p className="text-sm font-semibold text-gray-900">Fixed CPD hours for {courseName}</p>
      <p className="text-base font-semibold text-gray-800">{total ? `${total.toFixed(0)} hours` : "Hours not available"}</p>
      <p className="text-xs text-gray-700">
        These hours are fixed by the course design. Timed assessment time is included once on pass.
      </p>
    </div>
  );
}
