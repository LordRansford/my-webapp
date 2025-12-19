export default function TemplateFormSection({
  title = "Editable workspace",
  description = "Insert form fields, interactive controls, or dashboards that collect inputs.",
  children,
  id = "template-form-section",
}) {
  return (
    <section
      id={id}
      className="template-form-section rounded-2xl border border-slate-200 bg-white/95 p-6 shadow-sm backdrop-blur"
      aria-labelledby={`${id}-title`}
      role="form"
    >
      <div className="template-form-section__header space-y-2">
        <h2 id={`${id}-title`} className="template-form-section__title text-xl font-semibold text-slate-900">
          {title}
        </h2>
        {description && <p className="template-form-section__description text-sm text-slate-700">{description}</p>}
      </div>
      <div className="template-form-section__body mt-4">
        {children || (
          <p className="template-form-section__placeholder text-sm text-slate-600">
            Editable form or dashboard components will render here.
          </p>
        )}
      </div>
    </section>
  );
}
