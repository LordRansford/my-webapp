"use client";

import React, { useMemo, useState } from "react";
import { PreviewFooter } from "./PreviewFooter";
import { PreviewHeader } from "./PreviewHeader";
import { PreviewSection } from "./PreviewSection";
import { PreviewToggle } from "./PreviewToggle";
import "@/styles/templatePreview.css";

type PreviewSectionContent = {
  title: string;
  number?: string;
  body: React.ReactNode;
  metrics?: { label: string; value: string }[];
};

type BrandingPlaceholders = {
  organisation?: string;
  department?: string;
  classification?: string;
  logoPlaceholder?: string;
};

type TemplatePreviewProps = {
  title: string;
  executiveSummary?: string;
  mainSections?: PreviewSectionContent[];
  appendices?: PreviewSectionContent[];
  author?: string;
  dateGenerated?: string;
  branding?: BrandingPlaceholders;
  editContent?: React.ReactNode;
};

export function TemplatePreview({
  title,
  executiveSummary = "Concise summary of the scenario, primary risk posture, and intended outcome.",
  mainSections,
  appendices,
  author = "Author",
  dateGenerated = new Date().toLocaleDateString(),
  branding,
  editContent,
}: TemplatePreviewProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const isPreview = mode === "preview";

  const preparedSections = useMemo<PreviewSectionContent[]>(() => {
    if (mainSections && mainSections.length > 0) return mainSections;
    return [
      {
        title: "Context and objectives",
        number: "1",
        body: (
          <div className="space-y-2">
            <p>Summarise why this template is being used and the decision or deliverable it supports.</p>
            <ul className="list-disc pl-5 text-sm text-slate-700">
              <li>Drivers: regulatory, customer, resilience, or efficiency.</li>
              <li>Scope: systems, data, teams, and partners involved.</li>
              <li>Timeframe: what must be true by key milestones.</li>
            </ul>
          </div>
        ),
        metrics: [
          { label: "Confidence", value: "High" },
          { label: "Risk posture", value: "Moderate" },
        ],
      },
      {
        title: "Approach and safeguards",
        number: "2",
        body: (
          <div className="space-y-2">
            <p>Lay out the key steps, safeguards, and accountability needed to execute safely.</p>
            <p>
              Include data handling, access control, observability, change management, and fallback plans. Focus on the decisions an executive or reviewer
              must see to confirm quality.
            </p>
          </div>
        ),
        metrics: [
          { label: "Probability of success", value: "0.82" },
          { label: "Residual risk", value: "Low" },
        ],
      },
      {
        title: "Next actions and owners",
        number: "3",
        body: (
          <div className="space-y-2">
            <p>Identify the next three actions, who owns them, and what “done” looks like.</p>
            <p>Capture checkpoints, evidence expected, and how progress will be reported to stakeholders.</p>
          </div>
        ),
      },
    ];
  }, [mainSections]);

  const preparedAppendices = useMemo<PreviewSectionContent[]>(() => {
    if (appendices && appendices.length > 0) return appendices;
    return [
      {
        title: "Appendix A — References",
        body: (
          <div className="space-y-1 text-sm">
            <p>Links to standards, runbooks, or prior decisions that inform this template.</p>
            <p>Include relevant policies, architectural decision records, and supporting analyses.</p>
          </div>
        ),
      },
    ];
  }, [appendices]);

  return (
    <div className="template-preview-shell" data-mode={mode}>
      <PreviewToggle mode={mode} onChange={setMode} />

      <div className="template-preview-layout">
        <div
          className={`template-edit-region ${isPreview ? "template-edit-region--locked" : ""}`}
          aria-label="Editable template content"
          aria-disabled={isPreview}
        >
          {editContent || <p className="text-sm text-slate-700">Form controls render here. Switch to preview to see the output style.</p>}
        </div>

        <div className="template-preview-document" aria-label="Template export preview">
          <div className="preview-page preview-page--a4">
            <PreviewHeader
              title={title}
              organisation={branding?.organisation}
              department={branding?.department}
              classification={branding?.classification}
              author={author}
              date={dateGenerated}
              logoPlaceholder={branding?.logoPlaceholder}
            />
            <div className="preview-section" aria-label="Executive summary">
              <h2 className="preview-section__title">Executive summary</h2>
              <p className="preview-section__body">{executiveSummary}</p>
            </div>
          </div>

          <span className="preview-page-break" aria-hidden="true" />

          <div className="preview-page preview-page--a4">
            {preparedSections.map((section) => (
              <PreviewSection key={section.title} title={section.title} number={section.number} metrics={section.metrics}>
                {section.body}
              </PreviewSection>
            ))}
          </div>

          {preparedAppendices.length > 0 && (
            <>
              <span className="preview-page-break" aria-hidden="true" />
              <div className="preview-page preview-page--a4">
                {preparedAppendices.map((section) => (
                  <PreviewSection key={section.title} title={section.title}>
                    {section.body}
                  </PreviewSection>
                ))}
              </div>
            </>
          )}

          <PreviewFooter />
        </div>
      </div>
    </div>
  );
}
