"use client";

import { sanitizeFileName, validateFileType } from "@/lib/studios/security/inputSanitizer";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

export type UploadRule = {
  maxBytes: number;
  allowedExtensions: string[];
};

export type UploadResult = {
  safeFiles: File[];
  errors: string[];
};

/**
 * Validate files on the client: size + extension. Blocks unknown types by default.
 * Enhanced with security features: file name sanitization, dangerous file type blocking, and audit logging.
 * Note: this is client-side only; revalidate server-side if/when a backend is added.
 */
export function validateUpload(files: FileList | File[] | null | undefined, rule: UploadRule): UploadResult {
  if (!files) return { safeFiles: [], errors: [] };
  const arr = Array.from(files);
  const allowed = rule.allowedExtensions.map((e) => e.toLowerCase().replace(/^\./, ""));
  const safeFiles: File[] = [];
  const errors: string[] = [];

  // Dangerous file types that should always be blocked
  const dangerousExtensions = ["exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "sh", "ps1"];

  arr.forEach((file) => {
    // Sanitize file name to prevent path traversal
    const sanitizedName = sanitizeFileName(file.name);
    const sanitizedFile = sanitizedName !== file.name 
      ? new File([file], sanitizedName, { type: file.type })
      : file;

    const ext = (sanitizedFile.name.split(".").pop() || "").toLowerCase();
    const sizeOk = sanitizedFile.size <= rule.maxBytes;
    const extOk = allowed.includes(ext);
    const isDangerous = dangerousExtensions.includes(ext);

    // Block dangerous file types
    if (isDangerous) {
      const errorMsg = `${sanitizedName}: This file type is not allowed for security reasons.`;
      errors.push(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "file-upload", {
        error: "dangerous_file_type",
        fileName: sanitizedName,
        extension: ext
      });
      return;
    }

    // Validate file type
    if (!extOk) {
      const errorMsg = `${sanitizedName}: File type not allowed. Allowed types: ${allowed.join(", ")}.`;
      errors.push(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "file-upload", {
        error: "invalid_file_type",
        fileName: sanitizedName,
        extension: ext
      });
      return;
    }

    // Validate file size
    if (!sizeOk) {
      const errorMsg = `${sanitizedName}: File is too large. Maximum size is ${rule.maxBytes / (1024 * 1024)}MB.`;
      errors.push(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "file-upload", {
        error: "file_too_large",
        fileName: sanitizedName,
        fileSize: sanitizedFile.size,
        maxSize: rule.maxBytes
      });
      return;
    }

    // Additional validation using validateFileType
    const allowedExts = rule.allowedExtensions.map(e => e.startsWith(".") ? e : `.${e}`);
    const validation = validateFileType(sanitizedFile, [], allowedExts);
    if (!validation.valid) {
      const errorMsg = validation.error || `${sanitizedName}: File validation failed.`;
      errors.push(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "file-upload", {
        error: "validation_failed",
        fileName: sanitizedName,
        errorDetails: validation.error
      });
      return;
    }

    // File is safe
    safeFiles.push(sanitizedFile);
    auditLogger.log(AuditActions.FILE_UPLOADED, "file-upload", {
      fileName: sanitizedName,
      fileSize: sanitizedFile.size,
      fileType: sanitizedFile.type
    });
  });

  return { safeFiles, errors };
}
