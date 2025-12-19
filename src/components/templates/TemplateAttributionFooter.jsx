"use client";

export default function TemplateAttributionFooter({
  brand = "Ransfords Notes",
  author = "Ransford",
  version = "1.0.0",
  note = "Internal use allowed. Commercial use requires visible attribution. Downloads are gated for compliance.",
}) {
  return (
    <footer
      className="template-attribution-footer mt-6 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-800 shadow-sm"
      aria-label="Attribution"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="font-semibold">{brand}</p>
          <p className="text-xs text-slate-600">Author: {author}</p>
        </div>
        <div className="text-xs text-slate-700">
          <p>{note}</p>
          <p className="mt-1 font-semibold text-slate-900">Version {version}</p>
        </div>
      </div>
    </footer>
  );
}
