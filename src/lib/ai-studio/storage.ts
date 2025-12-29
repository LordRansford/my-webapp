/**
 * AI Studio Storage Utilities
 * 
 * File storage abstraction for AI Studio
 * Currently configured for Vercel Blob Storage
 * Can be migrated to S3/R2 later if needed
 */

import { put, list, del, head, getDownloadUrl } from "@vercel/blob";

export interface StorageConfig {
  provider: "vercel-blob" | "s3" | "r2" | "supabase";
  maxFileSize: number;
  allowedTypes: string[];
}

export const STORAGE_CONFIG: StorageConfig = {
  provider: "vercel-blob",
  maxFileSize: 100 * 1024 * 1024, // 100MB
  allowedTypes: [".csv", ".json", ".jsonl", ".parquet", ".hdf5"],
};

/**
 * Upload file to storage
 */
export async function uploadFile(
  file: File,
  userId: string,
  metadata?: {
    datasetId?: string;
    modelId?: string;
    type?: string;
  }
): Promise<{
  url: string;
  pathname: string;
  size: number;
  uploadedAt: Date;
}> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  }

  // Validate file
  if (file.size > STORAGE_CONFIG.maxFileSize) {
    throw new Error(`File size exceeds maximum of ${STORAGE_CONFIG.maxFileSize / (1024 * 1024)}MB`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!STORAGE_CONFIG.allowedTypes.includes(`.${ext}`)) {
    throw new Error(`File type .${ext} not allowed`);
  }

  // Create path: ai-studio/{userId}/{type}/{filename}
  const type = metadata?.type || "datasets";
  const pathname = `ai-studio/${userId}/${type}/${Date.now()}-${file.name}`;

  // Upload to Vercel Blob
  // Convert File to Blob for upload (File extends Blob)
  const fileBlob = new Blob([file], { type: file.type || "application/octet-stream" });
  const blob = await put(pathname, fileBlob, {
    access: "private" as const,
    contentType: file.type || "application/octet-stream",
  });

  return {
    url: blob.url,
    pathname: blob.pathname,
    size: blob.size,
    uploadedAt: blob.uploadedAt,
  };
}

/**
 * Get signed URL for temporary access
 */
export async function getSignedUrl(
  pathname: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  // Vercel Blob doesn't have built-in signed URLs
  // Instead, we'll use a proxy route that checks authentication
  // For now, return the pathname to be used with our API route
  return `/api/ai-studio/storage/download?path=${encodeURIComponent(pathname)}&expires=${expiresIn}`;
}

/**
 * Delete file from storage
 */
export async function deleteFile(pathname: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  }

  await del(pathname);
}

/**
 * Check if file exists
 */
export async function fileExists(pathname: string): Promise<boolean> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return false;
  }

  try {
    await head(pathname);
    return true;
  } catch {
    return false;
  }
}

/**
 * List files for a user
 */
export async function listUserFiles(
  userId: string,
  prefix?: string
): Promise<Array<{ pathname: string; size: number; uploadedAt: Date }>> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return [];
  }

  const searchPrefix = prefix || `ai-studio/${userId}/`;
  const { blobs } = await list({ prefix: searchPrefix });

  return blobs.map((blob) => ({
    pathname: blob.pathname,
    size: blob.size,
    uploadedAt: blob.uploadedAt,
  }));
}

/**
 * Get file metadata
 */
export async function getFileMetadata(pathname: string): Promise<{
  size: number;
  uploadedAt: Date;
  contentType?: string;
}> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error("BLOB_READ_WRITE_TOKEN not configured");
  }

  const blob = await head(pathname);

  return {
    size: blob.size,
    uploadedAt: blob.uploadedAt,
    contentType: blob.contentType,
  };
}

