export default function TemplateInstructions({
  title = "How to use this template",
  steps = [
    "Review the goal and audience.",
    "Collect required inputs before editing.",
    "Complete each section in order to maintain consistency.",
    "Validate outputs against your policy and governance rules.",
  ],
  note = "Replace these steps with domain-specific guidance when the template is implemented.",
}) {
  return (
    <section
      className="template-instructions rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
      aria-labelledby="template-instructions-title"
    >
      <h2 id="template-instructions-title" className="template-instructions__title text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <ol className="template-instructions__list mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
        {steps.map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      {note && <p className="template-instructions__note mt-4 text-sm text-slate-600">{note}</p>}
    </section>
  );
}
