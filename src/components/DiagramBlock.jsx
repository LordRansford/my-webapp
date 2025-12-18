"use client";

export default function DiagramBlock({ title, description, children }) {
  return (
    <div className="my-4 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-2">
        {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
        {description && <p className="text-sm text-gray-700">{description}</p>}
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-gray-800">{children}</div>
      </div>
    </div>
  );
}
