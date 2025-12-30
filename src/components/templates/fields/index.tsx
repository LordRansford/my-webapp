"use client";

import React from "react";
import { FieldWrapper } from "./FieldWrapper";

type BaseProps = {
  id: string;
  label: string;
  value: any;
  onChange: (value: any) => void;
  help?: string;
  example?: string;
  required?: boolean;
  validationMessage?: string;
  why?: string;
  placeholder?: string;
};

export function FieldText(props: BaseProps & { type?: "text" | "email" }) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, placeholder, type = "text" } = props;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <input
        id={id}
        name={id}
        type={type}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function FieldTextarea(props: BaseProps & { rows?: number }) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, placeholder, rows = 3 } = props;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function FieldSelect(
  props: BaseProps & {
    options: { label: string; value: string }[];
  }
) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, options } = props;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <select
        id={id}
        name={id}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

export function FieldMultiSelect(
  props: BaseProps & {
    options: { label: string; value: string }[];
  }
) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, options } = props;
  const selected = Array.isArray(value) ? value : [];
  const toggle = (val: string) => {
    if (selected.includes(val)) onChange(selected.filter((v: string) => v !== val));
    else onChange([...selected, val]);
  };
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggle(opt.value)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
                active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
              }`}
              aria-pressed={active}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </FieldWrapper>
  );
}

export function FieldNumber(props: BaseProps & { min?: number; max?: number; step?: number }) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, placeholder, min, max, step } = props;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <input
        id={id}
        name={id}
        type="number"
        min={min}
        max={max}
        step={step || 1}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
      />
    </FieldWrapper>
  );
}

export function FieldSlider(props: BaseProps & { min?: number; max?: number; step?: number }) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, min = 0, max = 10, step = 1 } = props;
  const val = typeof value === "number" ? value : Number(value) || 0;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <div className="flex items-center gap-3">
        <input
          id={id}
          name={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 accent-slate-900"
        />
        <span className="w-10 text-right text-sm font-semibold text-slate-900">{val}</span>
      </div>
    </FieldWrapper>
  );
}

export function FieldToggle(props: BaseProps & { onLabel?: string; offLabel?: string }) {
  const { id, label, value, onChange, help, example, required, validationMessage, why, onLabel = "On", offLabel = "Off" } = props;
  const active = Boolean(value);
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <button
        type="button"
        onClick={() => onChange(!active)}
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 ${
          active ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50"
        }`}
        aria-pressed={active}
      >
        <span
          aria-hidden="true"
          className={`relative inline-flex h-5 w-9 items-center rounded-full border ${active ? "border-emerald-300 bg-emerald-500" : "border-slate-300 bg-slate-200"}`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white transition ${active ? "translate-x-4" : "translate-x-0.5"}`}
          />
        </span>
        {active ? onLabel : offLabel}
      </button>
    </FieldWrapper>
  );
}

export function FieldDate(props: BaseProps) {
  const { id, label, value, onChange, help, example, required, validationMessage, why } = props;
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <input
        id={id}
        name={id}
        type="date"
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
      />
    </FieldWrapper>
  );
}

export function FieldFileUpload(props: BaseProps & { accept?: string; onSafeParse?: (text: string) => void }) {
  const { id, label, onChange, help, example, required, validationMessage, why, accept = ".txt,.csv,.json", onSafeParse } = props;
  const { sanitizeFileName, validateFileType } = require("@/lib/studios/security/inputSanitizer");
  const { auditLogger, AuditActions } = require("@/lib/studios/security/auditLogger");
  
  // Parse allowed extensions from accept string
  const allowedExtensions = accept.split(",").map(ext => ext.trim().startsWith(".") ? ext.trim() : `.${ext.trim()}`);
  
  return (
    <FieldWrapper id={id} label={label} help={help} example={example} required={required} validationMessage={validationMessage} why={why}>
      <input
        id={id}
        name={id}
        type="file"
        accept={accept}
        className="w-full text-sm text-slate-800"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;

          // Sanitize file name
          const sanitizedName = sanitizeFileName(file.name);
          const sanitizedFile = sanitizedName !== file.name 
            ? new File([file], sanitizedName, { type: file.type })
            : file;

          // Validate file size
          if (sanitizedFile.size > 2 * 1024 * 1024) {
            auditLogger.log(AuditActions.ERROR_OCCURRED, "template-field", {
              error: "file_too_large",
              fileName: sanitizedName,
              fileSize: sanitizedFile.size
            });
            onChange(null);
            return;
          }

          // Validate file type
          const ext = "." + sanitizedFile.name.split(".").pop()?.toLowerCase();
          const validation = validateFileType(sanitizedFile, [], allowedExtensions);
          if (!validation.valid) {
            auditLogger.log(AuditActions.ERROR_OCCURRED, "template-field", {
              error: "invalid_file_type",
              fileName: sanitizedName,
              extension: ext
            });
            onChange(null);
            return;
          }

          // Check for dangerous file types
          const dangerousExtensions = [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar"];
          if (dangerousExtensions.includes(ext)) {
            auditLogger.log(AuditActions.ERROR_OCCURRED, "template-field", {
              error: "dangerous_file_type",
              fileName: sanitizedName,
              extension: ext
            });
            onChange(null);
            return;
          }

          auditLogger.log(AuditActions.FILE_UPLOADED, "template-field", {
            fileName: sanitizedName,
            fileSize: sanitizedFile.size
          });

          const text = await sanitizedFile.text();
          onChange(sanitizedName);
          onSafeParse?.(text);
        }}
      />
      <p className="text-xs text-slate-700">Processed locally in your browser. No uploads are stored.</p>
    </FieldWrapper>
  );
}
