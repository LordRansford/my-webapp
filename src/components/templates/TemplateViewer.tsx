import React from "react";
import { MathInsightBlock } from "@/components/templates/MathInsightBlock";
import { TemplateSection } from "@/components/templates/TemplateSection";
import { PreviewBanner } from "@/components/templates/PreviewBanner";
import type { TemplateSection as TemplateSectionData, TemplatePreview } from "@/data/templates/templates.stub";

type TemplateViewerProps = {
  template: TemplatePreview;
};

function SectionList({ section }: { section: TemplateSectionData | undefined }) {
  if (!section) return null;
  return (
    <TemplateSection title={section.title} description={section.summary}>
      {section.items?.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {section.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.title}</div>
              <p className="mt-1 text-sm text-slate-800 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      ) : null}
      {section.callout ? <p className="text-xs font-semibold text-slate-700">{section.callout}</p> : null}
    </TemplateSection>
  );
}

export function TemplateViewer({ template }: TemplateViewerProps) {
  const sections = template.sections ?? [];
  const industries = template.industries ?? [];
  const mathsTopics = template.mathsTopics ?? [];
  const standards = template.standards ?? [];
  const overview = sections.find((section) => section.id === "overview");
  const conceptual = sections.find((section) => section.id === "conceptual-model");
  const keyInputs = sections.find((section) => section.id === "key-inputs");
  const underlying = sections.find((section) => section.id === "underlying-logic");
  const outputs = sections.find((section) => section.id === "outputs");
  const professional = sections.find((section) => section.id === "professional-notes");

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <PreviewBanner />
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-6 sm:pt-10">
        <header className="rounded-3xl bg-white ring-1 ring-slate-100 shadow-[0_18px_45px_rgba(15,23,42,0.06)] p-6 sm:p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white">Preview only</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">{template.category}</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold text-slate-900">{template.title}</h1>
            <p className="text-base text-slate-700 leading-relaxed">{template.description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
            {industries.map((industry) => (
              <span key={industry} className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">
                {industry}
              </span>
            ))}
          </div>
        </header>

        <SectionList section={overview} />

        <TemplateSection title="Conceptual Model" description={conceptual?.summary || "Diagram placeholder for the real experience."}>
          <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-6 text-center text-sm text-slate-600">
            Visual placeholder: actors, data stores, and flows will appear here in the full release.
          </div>
          {conceptual?.items?.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-100 bg-white p-3">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.title}</div>
              <p className="mt-1 text-sm text-slate-800 leading-relaxed">{item.detail}</p>
            </div>
          ))}
          {conceptual?.callout ? <p className="text-xs font-semibold text-slate-700">{conceptual.callout}</p> : null}
        </TemplateSection>

        <SectionList section={keyInputs} />

        <SectionList section={underlying} />

        <TemplateSection title="Mathematical Depth (Preview)" description="Math notes stay readable and disabled here to signal depth without execution.">
          <div className="grid gap-4 md:grid-cols-2">
            {mathsTopics.map((topic) => (
              <MathInsightBlock
                key={topic.title}
                title={topic.title}
                explanation={topic.explanation}
                exampleFormula={topic.exampleFormula || ""}
                application={topic.application}
              />
            ))}
          </div>
        </TemplateSection>

        <SectionList section={outputs} />

        <TemplateSection
          title="Professional Notes"
          description={
            professional?.summary ||
            "Governance, standards, and audit breadcrumbs that the full version would make tangible."
          }
        >
          <div className="space-y-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Standards</div>
              <ul className="mt-1 list-disc pl-5 text-sm text-slate-800">
                {standards.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            {professional?.items
              ?.filter((item) => item.title !== "Standards alignment")
              .map((item) => (
                <div key={item.title}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">{item.title}</div>
                  <p className="text-sm text-slate-800 leading-relaxed">{item.detail}</p>
                </div>
              ))}
          </div>
        </TemplateSection>
      </div>
    </div>
  );
}

export default TemplateViewer;
