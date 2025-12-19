import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
  id: string;
  label: string;
  value: number | "";
  onChange: (value: number | "") => void;
  help?: string;
  placeholder?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function FieldNumber({ id, label, value, onChange, help, placeholder, required, example, error, why, min, max, step }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <input
        id={id}
        name={id}
        type="number"
        min={min}
        max={max}
        step={step}
        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        value={value}
        onChange={(e) => {
          const next = e.target.value === "" ? "" : Number(e.target.value);
          onChange(next);
        }}
        placeholder={placeholder}
      />
    </FieldWrapper>
  );
}
