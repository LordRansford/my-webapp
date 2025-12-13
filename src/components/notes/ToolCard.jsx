"use client";

export default function ToolCard({ title, description, children }) {
  return (
    <section className="my-5 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <header className="mb-2">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {description ? <p className="text-xs text-gray-600 leading-relaxed">{description}</p> : null}
      </header>
      <div className="rounded-xl bg-gray-50 p-3">{children}</div>
    </section>
  );
}
