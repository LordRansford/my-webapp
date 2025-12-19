"use client";

import { useEffect, useMemo, useState } from "react";
import TemplateHeader from "./TemplateHeader";
import TemplateInstructions from "./TemplateInstructions";
import TemplateFormSection from "./TemplateFormSection";
import TemplateOutput from "./TemplateOutput";
import TemplateLicenceNotice from "./TemplateLicenceNotice";
import TemplateAttributionFooter from "./TemplateAttributionFooter";

const defaultInstructions = [
  "Set the template category and ensure it maps to the taxonomy.",
  "Confirm the intended audience and spell out the scenarios where this template applies.",
  "Complete required inputs in the editable area below.",
  "Review outputs and document decisions before sharing.",
];

export default function TemplateLayout({
  title = "Template pending title",
  description = "Concise description of what this template delivers and when to use it.",
  audience = "List the roles or teams that should use this template.",
  useCases = ["Describe the primary problems this template solves."],
  instructions = defaultInstructions,
  children,
  outputTitle = "Output and interpretation",
  outputSummary = "Summarise the output that will be generated from the completed template.",
  outputInterpretation = "Explain how to interpret the results and what to do next.",
  outputNextSteps = ["Note the approvals, follow-on tasks, or publishing steps."],
  usageType = "commercial",
  author = "Ransford",
  brand = "Ransfords Notes",
  version = "1.0.0",
  attributionText,
  onRequestOverride,
  showAttributionFooter = true,
}) {
  const resolvedAttribution =
    attributionText ||
    `Created by ${author} for ${brand}. Commercial downloads must keep this notice.`;
  const consentKey = useMemo(() => `recording-consent-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, [title]);
  const [captureAgreed, setCaptureAgreed] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(consentKey) : null;
    if (stored === "true") setCaptureAgreed(true);
  }, [consentKey]);

  const handleCaptureToggle = (checked) => {
    setCaptureAgreed(checked);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(consentKey, checked ? "true" : "false");
    }
  };

  return (
    <main className="template-layout template-capture-root mx-auto max-w-6xl space-y-8 px-4 py-10 md:px-6 lg:px-8" aria-label="Template">
      <TemplateHeader title={title} description={description} audience={audience} useCases={useCases} />

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-800">
        <p className="font-semibold">Usage reminder</p>
        <p className="mt-1">
          This is an educational and planning support tool. It is not legal advice and does not replace professional security
          testing. Use only on systems and data you are permitted to work on.
        </p>
      </div>

      <div className="rounded-2xl border border-sky-100 bg-sky-50/80 p-4 text-sm text-slate-800 shadow-sm">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-lg">🎥</span>
          <div>
            <p className="font-semibold">Screen capture agreement</p>
            <p className="mt-1 text-sm">
              Only capture when permitted and avoid showing sensitive data. Keep attribution visible in captures.
            </p>
            <button
              type="button"
              onClick={() => handleCaptureToggle(!captureAgreed)}
              className={`mt-3 inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-semibold shadow-sm ring-1 transition ${
                captureAgreed
                  ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
                  : "bg-white text-slate-800 ring-slate-200"
              }`}
              aria-pressed={captureAgreed}
            >
              <span
                aria-hidden="true"
                className={`relative inline-flex h-5 w-9 items-center rounded-full border ${
                  captureAgreed ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition ${
                    captureAgreed ? "translate-x-4" : "translate-x-0.5"
                  }`}
                />
              </span>
              {captureAgreed ? "Capture allowed (with permission)" : "Enable capture (with permission)"}
            </button>
          </div>
        </div>
      </div>

      <TemplateInstructions steps={instructions} />

      <TemplateFormSection>
        {children || (
          <p className="template-layout__placeholder text-sm text-slate-600">
            Editable form or dashboard components will be inserted here in later stages.
          </p>
        )}
      </TemplateFormSection>

      <TemplateOutput
        title={outputTitle}
        summary={outputSummary}
        interpretation={outputInterpretation}
        nextSteps={outputNextSteps}
      />

      <TemplateLicenceNotice
        usageType={usageType}
        author={author}
        brand={brand}
        attributionText={resolvedAttribution}
        onRequestOverride={onRequestOverride}
      />

      {showAttributionFooter && (
        <TemplateAttributionFooter
          brand={brand}
          author={author}
          version={version}
          note={resolvedAttribution}
        />
      )}
    </main>
  );
}
