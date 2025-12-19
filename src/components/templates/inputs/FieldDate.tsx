import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
};

export default function FieldDate({ id, label, value, onChange, help, required, example, error, why }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <input
        id={id}
        name={id}
        type="date"
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  );
}
