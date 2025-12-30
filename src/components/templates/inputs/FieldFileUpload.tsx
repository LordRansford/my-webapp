import React, { useState } from "react";
import FieldWrapper from "./FieldWrapper";
import { sanitizeFileName, validateFileType } from "@/lib/studios/security/inputSanitizer";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

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
          if (!file) {
            onChange(null);
            return;
          }

          // Sanitize file name
          const sanitizedName = sanitizeFileName(file.name);
          const sanitizedFile = sanitizedName !== file.name 
            ? new File([file], sanitizedName, { type: file.type })
            : file;

          // Validate file size
          if (sanitizedFile.size > maxBytes) {
            const errorMsg = `That file is too large for this tool right now. Max is ${formatMb(maxBytes)}.`;
            setLocalError(errorMsg);
            onChange(null);
            auditLogger.log(AuditActions.ERROR_OCCURRED, "template-tool", {
              error: "file_too_large",
              fileName: sanitizedName,
              fileSize: sanitizedFile.size,
              maxSize: maxBytes
            });
            return;
          }

          // Validate file type if extensions are specified
          if (allowedExtensions.length > 0) {
            const ext = "." + sanitizedFile.name.split(".").pop()?.toLowerCase();
            const validation = validateFileType(sanitizedFile, [], allowedExtensions);
            if (!validation.valid) {
              const errorMsg = validation.error || `File type ${ext} is not allowed. Allowed types: ${allowedExtensions.join(", ")}.`;
              setLocalError(errorMsg);
              onChange(null);
              auditLogger.log(AuditActions.ERROR_OCCURRED, "template-tool", {
                error: "invalid_file_type",
                fileName: sanitizedName,
                fileType: sanitizedFile.type,
                extension: ext
              });
              return;
            }
          }

          // Check for dangerous file types
          const ext = "." + sanitizedFile.name.split(".").pop()?.toLowerCase();
          const dangerousExtensions = [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar"];
          if (dangerousExtensions.includes(ext)) {
            const errorMsg = "This file type is not allowed for security reasons.";
            setLocalError(errorMsg);
            onChange(null);
            auditLogger.log(AuditActions.ERROR_OCCURRED, "template-tool", {
              error: "dangerous_file_type",
              fileName: sanitizedName,
              extension: ext
            });
            return;
          }

          setLocalError(null);
          auditLogger.log(AuditActions.FILE_UPLOADED, "template-tool", {
            fileName: sanitizedName,
            fileSize: sanitizedFile.size,
            fileType: sanitizedFile.type
          });
          onChange(sanitizedFile);
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
