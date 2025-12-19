export default function TemplateHeader({
  title = "Template title goes here",
  description = "Short description of the objective and expected outcome.",
  audience = "Define the intended roles or teams.",
  useCases = ["List primary use cases for this template."],
}) {
  return (
    <header className="template-header rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur">
      <h1 className="template-header__title text-3xl font-semibold leading-tight text-slate-900">{title}</h1>
      <p className="template-header__description mt-2 text-base text-slate-700">{description}</p>

      <div
        className="template-header__meta mt-6 grid gap-6 rounded-xl border border-slate-100 bg-slate-50/60 p-4 md:grid-cols-2"
        aria-label="Audience and use cases"
      >
        <div className="template-header__audience space-y-2">
          <h2 className="template-header__section-title text-sm font-semibold uppercase tracking-wide text-slate-600">
            Intended audience
          </h2>
          <p className="text-sm text-slate-700">{audience}</p>
        </div>

        <div className="template-header__usecases space-y-2">
          <h2 className="template-header__section-title text-sm font-semibold uppercase tracking-wide text-slate-600">
            Use cases
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
            {useCases.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
