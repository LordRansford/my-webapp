import React from "react";

type FormSectionProps = {
  id: string;
  title: string;
  description?: string;
  helperText?: string;
  hidden?: boolean;
  children: React.ReactNode;
};

export default function FormSection({ id, title, description, helperText, hidden, children }: FormSectionProps) {
  if (hidden) return null;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm space-y-3"
    >
      <div className="space-y-1">
        <h2 id={`${id}-title`} className="text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {description && <p className="text-sm text-slate-700">{description}</p>}
        {helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
