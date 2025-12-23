import crypto from "node:crypto";

export type UploadTier = "anon" | "authed";

export type UploadFileInput = {
  filename: string;
  mimeType: string;
  bytes: Uint8Array;
};

export type ValidatedUpload = {
  id: string;
  safeFilename: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
};

const DEFAULT_MAX_FILES = 3;
const DEFAULT_MAX_BYTES_AUTED = 2 * 1024 * 1024;
const DEFAULT_MAX_BYTES_ANON = 512 * 1024;

function sanitiseFilename(name: string) {
  const base = String(name || "").replace(/[/\\?%*:|"<>]/g, "_").trim();
  const trimmed = base.slice(0, 120);
  return trimmed || "upload";
}

function sha256(bytes: Uint8Array) {
  return crypto.createHash("sha256").update(Buffer.from(bytes)).digest("hex");
}

function looksLikeJson(bytes: Uint8Array) {
  const s = Buffer.from(bytes.subarray(0, 64)).toString("utf8").trim();
  return s.startsWith("{") || s.startsWith("[");
}

function looksLikeText(bytes: Uint8Array) {
  const sample = bytes.subarray(0, Math.min(256, bytes.length));
  for (const b of sample) {
    if (b === 0) return false;
  }
  return true;
}

export type UploadPolicy = {
  allowedMimeTypes: string[];
  maxFiles: number;
  maxBytesAnon: number;
  maxBytesAuthed: number;
};

// Deny by default. Add tool-specific allowlists as new upload needs are introduced.
export const UPLOAD_POLICIES: Record<string, UploadPolicy> = {
  // Stage 4 foundation: no tools use uploads yet.
};

export function validateUpload(params: {
  toolId: string;
  tier: UploadTier;
  files: UploadFileInput[];
}): { ok: true; uploads: ValidatedUpload[] } | { ok: false; error: string } {
  const toolId = String(params.toolId || "").trim();
  const policy = UPLOAD_POLICIES[toolId];
  if (!policy) return { ok: false, error: "Uploads are not enabled for this tool." };

  const files = Array.isArray(params.files) ? params.files : [];
  const maxFiles = Math.max(0, policy.maxFiles ?? DEFAULT_MAX_FILES);
  if (files.length > maxFiles) return { ok: false, error: `Too many files. Max is ${maxFiles}.` };

  const maxBytes = params.tier === "authed" ? policy.maxBytesAuthed ?? DEFAULT_MAX_BYTES_AUTED : policy.maxBytesAnon ?? DEFAULT_MAX_BYTES_ANON;
  const allowed = new Set(policy.allowedMimeTypes || []);

  const uploads: ValidatedUpload[] = [];
  for (const f of files) {
    const safeFilename = sanitiseFilename(f.filename);
    const mimeType = String(f.mimeType || "").toLowerCase().trim();
    if (!allowed.has(mimeType)) return { ok: false, error: "File type is not allowed." };

    const sizeBytes = f.bytes?.byteLength ?? 0;
    if (sizeBytes <= 0) return { ok: false, error: "Empty file is not allowed." };
    if (sizeBytes > maxBytes) return { ok: false, error: `File is too large. Max is ${maxBytes} bytes.` };

    // Basic MIME verification (defense in depth, not extension-based).
    if (mimeType === "application/json" && !looksLikeJson(f.bytes)) return { ok: false, error: "File does not match declared type." };
    if (mimeType.startsWith("text/") && !looksLikeText(f.bytes)) return { ok: false, error: "File does not match declared type." };

    uploads.push({
      id: crypto.randomUUID(),
      safeFilename,
      mimeType,
      sizeBytes,
      sha256: sha256(f.bytes),
    });
  }

  return { ok: true, uploads };
}


