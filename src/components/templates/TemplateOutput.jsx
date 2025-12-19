export default function TemplateOutput({
  title = "Output and interpretation",
  summary = "Summarise what the completed template produces.",
  interpretation = "Explain how to read the results and the decisions they inform.",
  nextSteps = ["Outline validation, approvals, or follow-on actions."],
}) {
  return (
    <section
      className="template-output rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur"
      aria-labelledby="template-output-title"
      aria-live="polite"
      role="region"
    >
      <h2 id="template-output-title" className="template-output__title text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <p className="template-output__summary mt-2 text-sm text-slate-700">{summary}</p>
      <p className="template-output__interpretation mt-2 text-sm text-slate-700">{interpretation}</p>
      {nextSteps.length > 0 && (
        <ul className="template-output__nextsteps mt-4 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {nextSteps.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
