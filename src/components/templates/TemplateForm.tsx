"use client";

import React, { useMemo, useState } from "react";
import CalculatedField from "@/components/templates/CalculatedField";
import ConfidenceIndicator from "@/components/templates/ConfidenceIndicator";
import FormSection from "@/components/templates/FormSection";
import ProbabilityMeter from "@/components/templates/ProbabilityMeter";
import {
  calculateCompliancePercentage,
  calculateMaturityIndex,
  calculateProbabilityRange,
  calculateRiskScore,
  formatPercentage,
  formatScore,
} from "@/utils/templateMath";
import { TemplateField, TemplateFormSchema, TemplateSection } from "@/types/templateForm";

type TemplateFormProps = {
  schema: TemplateFormSchema;
  onChange?: (state: { values: Record<string, unknown>; errors: Record<string, string | null> }) => void;
};

type FormulaExecutor = (values: Record<string, unknown>, inputs: string[]) => number | string | { low: number; high: number };

const formulaLibrary: Record<string, FormulaExecutor> = {
  riskScore: (values, inputs) => calculateRiskScore(values[inputs[0]] as number, values[inputs[1]] as number),
  compliance: (values, inputs) => calculateCompliancePercentage(values[inputs[0]] as number, values[inputs[1]] as number),
  maturity: (values, inputs) => calculateMaturityIndex(inputs.map((id) => values[id] as number)),
  probabilityRange: (values, inputs) => {
    const base = Number(values[inputs[0]]) || 0;
    const variance = Number(values[inputs[1]]) || 0;
    return calculateProbabilityRange(base * 10, variance * 5);
  },
};

const inputBaseClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2";

const helperTextClass = "text-xs text-slate-600";

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "" || (typeof value === "boolean" && value === false);

const getInitialValues = (sections: TemplateSection[]) => {
  const defaults: Record<string, unknown> = {};
  sections.forEach((section) => {
    section.fields.forEach((field) => {
      defaults[field.id] = field.defaultValue ?? (field.type === "checkbox" ? false : "");
    });
  });
  return defaults;
};

const validateField = (field: TemplateField, value: unknown) => {
  const rules = field.validation;
  if (!rules) return null;

  if (rules.required && isEmpty(value)) {
    return rules.message || "Add a quick note so we can calculate reliably.";
  }

  if (typeof value === "number") {
    if (typeof rules.min === "number" && value < rules.min) return `Use ${rules.min} or higher.`;
    if (typeof rules.max === "number" && value > rules.max) return `Keep this at ${rules.max} or below.`;
  }

  if (typeof value === "string" && rules.pattern && !rules.pattern.test(value)) {
    return rules.message || "Use the suggested format.";
  }

  return null;
};

function TemplateForm({ schema, onChange }: TemplateFormProps) {
  const initialValues = useMemo(() => getInitialValues(schema.sections), [schema.sections]);
  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (field: TemplateField, newValue: unknown) => {
    const nextValues = { ...values, [field.id]: newValue };
    const nextErrors = { ...errors, [field.id]: validateField(field, newValue) };
    setValues(nextValues);
    setErrors(nextErrors);
    onChange?.({ values: nextValues, errors: nextErrors });
  };

  const handleBlur = (field: TemplateField) => {
    setTouched((prev) => ({ ...prev, [field.id]: true }));
  };

  const shouldShowSection = (section: TemplateSection, index: number) => {
    if (section.condition && !section.condition(values)) return false;
    if (!section.progressive || index === 0) return true;
    const previousFields = schema.sections[index - 1]?.fields || [];
    const visibleFields = previousFields.filter((field) => !field.dependsOn || field.dependsOn(values));
    const requiredCount = visibleFields.length || 1;
    const completed = visibleFields.filter((field) => !isEmpty(values[field.id]) || field.type === "calculated").length;
    return completed / requiredCount >= 0.5;
  };

  const renderField = (field: TemplateField) => {
    if (field.dependsOn && !field.dependsOn(values)) return null;
    const error = errors[field.id];
    const hasError = Boolean(error) && touched[field.id];

    const commonLabel = (
      <label htmlFor={field.id} className="flex items-center justify-between text-sm font-semibold text-slate-900">
        <span>{field.label}</span>
        {field.validation?.required && <span className="text-xs font-medium text-amber-700">Required</span>}
      </label>
    );

    const guidance = (field.description || field.helperText || field.example) && (
      <div className="space-y-1">
        {field.description && <p className="text-sm text-slate-700">{field.description}</p>}
        {field.helperText && <p className={helperTextClass}>{field.helperText}</p>}
        {field.example && <p className="text-sm text-slate-500">Example: {field.example}</p>}
      </div>
    );

    const feedback = hasError && (
      <p className="text-xs font-medium text-rose-700" role="alert">
        {error}
      </p>
    );

    if (field.type === "calculated" && field.formula) {
      const fn = formulaLibrary[field.formula.key];
      const computed = fn ? fn(values, field.formula.inputs) : "";
      if (typeof computed === "object" && "low" in computed && "high" in computed) {
        return (
          <div className="space-y-2">
            {commonLabel}
            <ProbabilityMeter
              label={field.label}
              value={computed.high}
              subtitle={`Range ${computed.low}% - ${computed.high}%`}
            />
            {guidance}
          </div>
        );
      }

      return (
        <div className="space-y-2">
          {commonLabel}
          <CalculatedField
            label={field.label}
            value={field.formula.formatter ? field.formula.formatter(computed as number) : (computed as number)}
            format={field.formula.formatter ? "plain" : "score"}
            suffix={field.formula.suffix}
            description={field.helperText}
          />
          {guidance}
        </div>
      );
    }

    const sharedProps = {
      id: field.id,
      name: field.id,
      onBlur: () => handleBlur(field),
      className: `${inputBaseClasses} ${hasError ? "ring-1 ring-rose-400" : ""}`,
      "aria-invalid": hasError,
      "aria-describedby": hasError ? `${field.id}-error` : undefined,
      placeholder: field.placeholder,
    };

    let input: React.ReactNode = null;
    switch (field.type) {
      case "textarea":
        input = (
          <textarea
            {...sharedProps}
            rows={3}
            value={(values[field.id] as string) ?? ""}
            onChange={(event) => handleChange(field, event.target.value)}
          />
        );
        break;
      case "number":
        input = (
          <input
            {...sharedProps}
            type="number"
            inputMode="decimal"
            value={values[field.id] as number | ""}
            onChange={(event) => handleChange(field, event.target.value === "" ? "" : Number(event.target.value))}
          />
        );
        break;
      case "select":
        input = (
          <select
            {...sharedProps}
            value={(values[field.id] as string) ?? ""}
            onChange={(event) => handleChange(field, event.target.value)}
          >
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
      case "checkbox":
        input = (
          <div className="flex items-center gap-2">
            <input
              id={field.id}
              name={field.id}
              type="checkbox"
              checked={Boolean(values[field.id])}
              onChange={(event) => handleChange(field, event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            />
            <span className="text-sm text-slate-800">{field.description || field.label}</span>
          </div>
        );
        break;
      case "radio":
        input = (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-sm text-slate-800">
                <input
                  type="radio"
                  name={field.id}
                  value={option.value}
                  checked={values[field.id] === option.value}
                  onChange={() => handleChange(field, option.value)}
                  className="h-4 w-4 rounded-full border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        );
        break;
      default:
        input = (
          <input
            {...sharedProps}
            type="text"
            value={(values[field.id] as string) ?? ""}
            onChange={(event) => handleChange(field, event.target.value)}
          />
        );
    }

    return (
      <div className={`space-y-2 ${field.inline ? "sm:grid sm:grid-cols-2 sm:items-start sm:gap-3" : ""}`}>
        <div className="space-y-1">
          {commonLabel}
          {guidance}
        </div>
        <div className="space-y-1">
          {input}
          {feedback && (
            <span id={`${field.id}-error`} className="block text-xs font-medium text-rose-700">
              {error}
            </span>
          )}
        </div>
      </div>
    );
  };

  const totalFillableFields = schema.sections
    .flatMap((section) => section.fields)
    .filter((field) => field.type !== "calculated");
  const completedFields = totalFillableFields.filter(
    (field) => (field.dependsOn ? field.dependsOn(values) : true) && !isEmpty(values[field.id])
  );
  const completionRatio = totalFillableFields.length ? completedFields.length / totalFillableFields.length : 0;
  const validationErrors = Object.values(errors).filter(Boolean).length;

  return (
    <div className="space-y-5 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Template interaction engine</p>
        <h1 className="text-2xl font-semibold text-slate-900">{schema.title}</h1>
        {schema.summary && <div className="text-sm text-slate-700">{schema.summary}</div>}
      </div>

      {schema.showConfidence && (
        <ConfidenceIndicator completionRatio={completionRatio} validationErrors={validationErrors} />
      )}

      <div className="space-y-4">
        {schema.sections.map((section, index) => (
          <FormSection
            key={section.id}
            id={section.id}
            title={section.title}
            description={section.description}
            helperText={section.helperText}
            hidden={!shouldShowSection(section, index)}
          >
            {section.fields.map((field) => (
              <div key={field.id}>{renderField(field)}</div>
            ))}
          </FormSection>
        ))}
      </div>
    </div>
  );
}

// Demo schema to keep this deliverable self-contained.
export const exampleTemplateSchema: TemplateFormSchema = {
  id: "booktrack-readiness",
  title: "BookTrack readiness and risk workbook",
  summary: (
    <p>
      Capture quick answers, see live calculations, and decide if this template is ready for a dry run. Nothing leaves
      the browser.
    </p>
  ),
  showConfidence: true,
  sections: [
    {
      id: "context",
      title: "Context and scope",
      description: "Capture the essentials so downstream calculations stay relevant.",
      fields: [
        {
          id: "systemName",
          label: "System name",
          type: "text",
          placeholder: "BookTrack beta",
          helperText: "Keep it short so labels stay readable.",
          validation: { required: true },
        },
        {
          id: "handlesPersonalData",
          label: "Does this handle personal data?",
          type: "select",
          options: [
            { value: "yes", label: "Yes, we process personal data" },
            { value: "no", label: "No personal data handled" },
          ],
          validation: { required: true, message: "Select an option so conditional sections can load." },
        },
      ],
    },
    {
      id: "risk-shaping",
      title: "Risk shaping",
      description: "Light-touch risk view with colour coded outputs.",
      progressive: true,
      fields: [
        {
          id: "likelihood",
          label: "Likelihood (1-10)",
          type: "number",
          placeholder: "6",
          inline: true,
          helperText: "Higher numbers mean more likely to occur.",
          validation: { required: true, min: 1, max: 10 },
        },
        {
          id: "impact",
          label: "Impact (1-10)",
          type: "number",
          placeholder: "7",
          inline: true,
          helperText: "Think about customer harm and operational pain.",
          validation: { required: true, min: 1, max: 10 },
        },
        {
          id: "riskScore",
          label: "Risk score",
          type: "calculated",
          formula: { key: "riskScore", inputs: ["likelihood", "impact"], suffix: "/100" },
          helperText: "Updates live as likelihood and impact change.",
        },
        {
          id: "probabilityRange",
          label: "Probability range",
          type: "calculated",
          formula: { key: "probabilityRange", inputs: ["likelihood", "impact"] },
          helperText: "Shows a quick range using the inputs above.",
        },
      ],
    },
    {
      id: "controls",
      title: "Controls in place",
      description: "Show progress and guide the next action.",
      progressive: true,
      fields: [
        {
          id: "controlsCompleted",
          label: "Controls completed",
          type: "number",
          placeholder: "8",
          validation: { required: true, min: 0, message: "Use zero if none are done yet." },
        },
        {
          id: "controlsTotal",
          label: "Total controls planned",
          type: "number",
          placeholder: "12",
          defaultValue: 12,
          validation: { required: true, min: 1, message: "Keep at least 1 so percentage works." },
        },
        {
          id: "complianceRate",
          label: "Compliance rate",
          type: "calculated",
          formula: { key: "compliance", inputs: ["controlsCompleted", "controlsTotal"], formatter: formatPercentage },
          helperText: "Percent complete, updates instantly.",
        },
      ],
    },
    {
      id: "data-protection",
      title: "Data protection focus",
      description: "Only appears if personal data is involved.",
      progressive: true,
      condition: (values) => values.handlesPersonalData === "yes",
      fields: [
        {
          id: "dataCategory",
          label: "Data category",
          type: "select",
          options: [
            { value: "customer", label: "Customer data" },
            { value: "employee", label: "Employee data" },
            { value: "analytics", label: "Analytics / behavioural" },
          ],
          validation: { required: true },
          helperText: "Pick the dominant category so guidance stays focused.",
        },
        {
          id: "dataNotes",
          label: "Safeguards and notes",
          type: "textarea",
          placeholder: "Encryption, access controls, retention windows…",
          helperText: "Plain language is fine; keep it concise.",
        },
        {
          id: "confidenceScore",
          label: "Confidence score",
          type: "calculated",
          formula: { key: "maturity", inputs: ["likelihood", "impact", "controlsCompleted"], formatter: formatScore },
          helperText: "Blends risk and execution signals for a quick gut check.",
        },
      ],
    },
  ],
};

export function ExampleTemplateForm() {
  return <TemplateForm schema={exampleTemplateSchema} />;
}

export default TemplateForm;
