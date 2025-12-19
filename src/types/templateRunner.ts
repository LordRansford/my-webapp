export type FieldKind =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number"
  | "slider"
  | "toggle"
  | "date"
  | "file";

export type FieldOption = { label: string; value: string };

export type TemplateField = {
  id: string;
  type: FieldKind;
  label: string;
  help?: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  example?: string;
  options?: FieldOption[];
  why?: string;
  step?: number;
};

export type TemplateCalcResult = {
  scores: Record<string, number>;
  riskBand?: string;
  matrix?: { row: number; col: number };
  explanation: string;
  assumptions: string[];
  nextSteps: string[];
  outputs: Record<string, string | number>;
  charts?: Record<string, number[]>;
  tags?: string[];
};

export type TemplateDefinition = {
  slug: string;
  title: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  fields: TemplateField[];
  disclaimer: string;
  exportProfile: {
    formats: Array<"pdf" | "docx" | "xlsx" | "json">;
    copySummary?: boolean;
  };
  charts: string[];
  calcFn: (values: Record<string, unknown>) => TemplateCalcResult;
};
