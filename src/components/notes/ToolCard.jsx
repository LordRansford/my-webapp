"use client";

export default function ToolCard({ title, description, children }) {
  return (
    <section className="my-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
        {description ? (
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        ) : null}
      </header>
      <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-100 transition-colors duration-200">
        {children}
      </div>
    </section>
  );
}
