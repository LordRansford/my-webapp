import React from "react";
import FieldWrapper from "./FieldWrapper";
import { FieldOption } from "@/types/templateRunner";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: FieldOption[];
  help?: string;
  placeholder?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
};

export default function FieldSelect({ id, label, value, onChange, options, help, required, example, error, why, placeholder }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <select
        id={id}
        name={id}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder || "Select an option"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}
