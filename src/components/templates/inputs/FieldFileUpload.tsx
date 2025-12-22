import React, { useState } from "react";
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
  maxBytes?: number;
  allowedExtensions?: string[];
};

const MB = 1024 * 1024;

function formatMb(bytes: number) {
  return `${Math.max(0.1, Math.round((bytes / MB) * 10) / 10)}MB`;
}

export default function FieldFileUpload({
  id,
  label,
  value,
  onChange,
  help,
  required,
  example,
  error,
  why,
  maxBytes = 2 * MB,
  allowedExtensions = [],
}: Props) {
  const [localError, setLocalError] = useState<string | null>(null);
  const accept = allowedExtensions.length ? allowedExtensions.map((e) => (e.startsWith(".") ? e : `.${e}`)).join(",") : undefined;
  return (
    <FieldWrapper id={id} label={label} required={required} help={help} example={example} error={error} why={why}>
      <input
        id={id}
        name={id}
        type="file"
        accept={accept}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file && file.size > maxBytes) {
            setLocalError(`That file is too large for this tool right now. Max is ${formatMb(maxBytes)}.`);
            onChange(null);
            return;
          }
          setLocalError(null);
          onChange(file);
        }}
        className="w-full text-sm text-slate-800"
      />
      <p className="mt-1 text-xs text-slate-600">Max file size: {formatMb(maxBytes)}.</p>
      {localError ? (
        <p className="mt-1 text-xs font-semibold text-rose-700" role="alert" aria-live="polite">
          {localError}
        </p>
      ) : null}
      {value ? (
        <p className="text-xs text-slate-700">Loaded locally: {value.name}</p>
      ) : (
        <p className="text-xs text-slate-600">Processed locally in your browser.</p>
      )}
    </FieldWrapper>
  );
}
