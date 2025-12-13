"use client";

export default function Callout({ variant = "note", title, children }) {
  const colours = {
    concept: "border-blue-200 bg-blue-50",
    note: "border-gray-200 bg-gray-50",
    explain: "border-emerald-200 bg-emerald-50",
    warning: "border-amber-200 bg-amber-50",
  };
  const classes = colours[variant] || colours.note;
  return (
    <div className={`my-4 rounded-2xl border ${classes} p-4`}>
      {title ? <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-700">{title}</p> : null}
      <div className="text-sm text-gray-800 leading-relaxed">{children}</div>
    </div>
  );
}
