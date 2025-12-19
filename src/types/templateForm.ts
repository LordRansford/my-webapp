import { ReactNode } from "react";

export type TemplateFieldType = "text" | "textarea" | "number" | "select" | "checkbox" | "radio" | "calculated";

export type TemplateOption = { label: string; value: string };

export type TemplateValidationRule = {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
};

export type TemplateField = {
  id: string;
  label: string;
  type: TemplateFieldType;
  description?: string;
  placeholder?: string;
  helperText?: string;
  example?: string;
  options?: TemplateOption[];
  defaultValue?: string | number | boolean;
  validation?: TemplateValidationRule;
  dependsOn?: (values: Record<string, unknown>) => boolean;
  readOnly?: boolean;
  inline?: boolean;
  formula?: {
    key: string;
    inputs: string[];
    formatter?: (value: number | string) => string;
    suffix?: string;
  };
};

export type TemplateSection = {
  id: string;
  title: string;
  description?: string;
  helperText?: string;
  progressive?: boolean;
  condition?: (values: Record<string, unknown>) => boolean;
  fields: TemplateField[];
};

export type TemplateFormSchema = {
  id: string;
  title: string;
  summary?: ReactNode;
  sections: TemplateSection[];
  showConfidence?: boolean;
};

export type TemplateFormState = {
  values: Record<string, unknown>;
  errors: Record<string, string | null>;
  touched: Record<string, boolean>;
};
