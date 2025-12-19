import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
  id: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  help?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
};

export default function FieldToggle({ id, label, value, onChange, help, required, example, error, why }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <label className="inline-flex items-center gap-2 text-sm text-slate-900">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        />
        <span>{value ? "Enabled" : "Disabled"}</span>
      </label>
    </FieldWrapper>
  );
}
