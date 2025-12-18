"use client";

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
 * Note: this is client-side only; revalidate server-side if/when a backend is added.
 */
export function validateUpload(files: FileList | File[] | null | undefined, rule: UploadRule): UploadResult {
  if (!files) return { safeFiles: [], errors: [] };
  const arr = Array.from(files);
  const allowed = rule.allowedExtensions.map((e) => e.toLowerCase().replace(/^\./, ""));
  const safeFiles: File[] = [];
  const errors: string[] = [];

  arr.forEach((file) => {
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const sizeOk = file.size <= rule.maxBytes;
    const extOk = allowed.includes(ext);
    if (sizeOk && extOk) {
      safeFiles.push(file);
    } else {
      errors.push(
        `${file.name}: ${!extOk ? "blocked type" : ""}${!extOk && !sizeOk ? " & " : ""}${!sizeOk ? "too large" : ""} (max ${
          rule.maxBytes / (1024 * 1024)
        }MB, allowed: ${allowed.join(", ")})`
      );
    }
  });

  return { safeFiles, errors };
}
