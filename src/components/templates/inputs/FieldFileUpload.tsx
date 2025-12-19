import React from "react";
import FieldWrapper from "./FieldWrapper";

type Props = {
  id: string;
  label: string;
  value: File | null;
  onChange: (value: File | null) => void;
  help?: string;
  required?: boolean;
  example?: string;
  error?: string | null;
  why?: string;
};

export default function FieldFileUpload({ id, label, value, onChange, help, required, example, error, why }: Props) {
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <input
        id={id}
        name={id}
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          onChange(file);
        }}
        className="w-full text-sm text-slate-800"
      />
      {value ? <p className="text-xs text-slate-700">Loaded locally: {value.name}</p> : <p className="text-xs text-slate-600">Processed locally in your browser.</p>}
    </FieldWrapper>
  );
}
