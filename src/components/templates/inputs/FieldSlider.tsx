import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  help?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
  min?: number;
  max?: number;
  step?: number;
};

export default function FieldSlider({ id, label, value, onChange, help, required, example, error, why, min = 0, max = 10, step = 1 }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full accent-slate-900"
        />
        <span className="w-10 text-right text-sm font-semibold text-slate-900">{value}</span>
      </div>
    </FieldWrapper>
  );
}
