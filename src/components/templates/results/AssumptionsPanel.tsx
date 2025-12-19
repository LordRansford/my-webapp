import React from "react";

type Props = {
  items: string[];
};

export default function AssumptionsPanel({ items }: Props) {
  if (!items.length) return null;
  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
      <p className="text-sm font-semibold text-slate-900">Assumptions</p>
      <ul className="list-disc pl-5 text-sm text-slate-800 space-y-1">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
