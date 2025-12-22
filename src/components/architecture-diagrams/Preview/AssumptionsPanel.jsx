"use client";

function List({ title, items, empty }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">{title}</p>
      {items && items.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {items.map((x, idx) => (
            <li key={`${title}-${idx}`}>{x}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-700">{empty}</p>
      )}
    </div>
  );
}

export default function AssumptionsPanel({ assumptions, omissions }) {
  return (
    <div className="space-y-4">
      <List title="Assumptions" items={assumptions} empty="No assumptions listed." />
      <List title="Omissions" items={omissions} empty="No omissions listed." />
      <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-700 shadow-sm">
        <p className="font-semibold text-slate-900">Note</p>
        <p className="mt-2">These diagrams are generated drafts. Review before using in decisions.</p>
      </div>
    </div>
  );
}


