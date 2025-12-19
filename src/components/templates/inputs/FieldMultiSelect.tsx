import React from "react";
import FieldWrapper from "./FieldWrapper";
import { FieldOption } from "@/types/templateRunner";

type Props = {
  id: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: FieldOption[];
  help?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
};

export default function FieldMultiSelect({ id, label, value, onChange, options, help, required, example, error, why }: Props) {
  const toggleValue = (opt: string) => {
    if (value.includes(opt)) {
      onChange(value.filter((v) => v !== opt));
    } else {
      onChange([...value, opt]);
    }
  };

  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = value.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleValue(opt.value)}
              className={`rounded-full border px-3 py-1 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 ${
                active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}
