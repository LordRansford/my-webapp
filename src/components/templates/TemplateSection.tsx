import React from "react";

type TemplateSectionProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  children: React.ReactNode;
};

export function TemplateSection({ title, eyebrow, description, children }: TemplateSectionProps) {
  return (
    <section className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-6 sm:p-8 space-y-4">
      <div className="space-y-2">
        {eyebrow ? (
          <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">{eyebrow}</span>
        ) : null}
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description ? <p className="text-sm text-slate-700 leading-relaxed">{description}</p> : null}
      </div>
      <div className="space-y-3 text-sm text-slate-800 leading-relaxed">{children}</div>
    </section>
  );
}

export default TemplateSection;
