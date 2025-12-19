export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect"
  | "number"
  | "slider"
  | "toggle"
  | "date"
  | "file";

export type TemplateField = {
  id: string;
  type: FieldType;
  label: string;
  help?: string;
  placeholder?: string;
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: { label: string; value: string }[];
  example?: string;
  why?: string;
  defaultValue?: string | number | boolean | string[];
  step?: number;
};

export type TemplateChart =
  | { id: string; type: "radar"; title: string; series: { key: string; label: string }[] }
  | { id: string; type: "line"; title: string; xKey: string; yKey: string }
  | { id: string; type: "bar"; title: string; xKey: string; yKeys: string[] }
  | { id: string; type: "matrix"; title: string };

export type TemplateCalcResult = {
  scores: Record<string, number>;
  riskBand?: string;
  explanation: string;
  assumptions: string[];
  nextSteps: string[];
  chartData?: Record<string, any>[];
  matrixPlacement?: { row: number; col: number };
  meaning?: string;
  whyItMatters?: string;
  whenItBreaks?: string;
};

export type TemplateCalcFn = (values: Record<string, any>) => TemplateCalcResult;

export type TemplateDefinition = {
  slug: string;
  title: string;
  category: string;
  description: string;
  estimatedMinutes: number;
  version?: string;
  fields: TemplateField[];
  calcFn: TemplateCalcFn;
  charts: TemplateChart[];
  exportProfile: {
    allowPDF: boolean;
    allowDOCX: boolean;
    allowXLSX: boolean;
    allowJSON: boolean;
  };
  disclaimer: string;
};
