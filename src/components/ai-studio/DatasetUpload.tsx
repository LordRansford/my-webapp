"use client";

/**
 * Dataset Upload Component
 * 
 * Handles file upload with progress and validation
 */

import React, { useState, useCallback } from "react";
import { Upload, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { sanitizeFileName, validateFileType } from "@/lib/studios/security/inputSanitizer";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

interface DatasetUploadProps {
  onUploadComplete?: (dataset: any) => void;
  onError?: (error: Error) => void;
  maxSize?: number;
  allowedTypes?: string[];
}

export default function DatasetUpload({
  onUploadComplete,
  onError,
  maxSize = 100 * 1024 * 1024, // 100MB
  allowedTypes = [".csv", ".json", ".jsonl", ".parquet"],
}: DatasetUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      setError(null);
      setSuccess(false);

      // Sanitize file name to prevent path traversal attacks
      const sanitizedName = sanitizeFileName(file.name);
      const sanitizedFile = sanitizedName !== file.name 
        ? new File([file], sanitizedName, { type: file.type })
        : file;

      // Validate file size
      if (sanitizedFile.size > maxSize) {
        const errorMsg = `File size exceeds maximum of ${maxSize / (1024 * 1024)}MB`;
        setError(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        auditLogger.log(AuditActions.ERROR_OCCURRED, "ai-studio", {
          error: "file_too_large",
          fileName: sanitizedName,
          fileSize: sanitizedFile.size,
          maxSize
        });
        return;
      }

      // Validate file type
      const ext = "." + sanitizedFile.name.split(".").pop()?.toLowerCase();
      const validation = validateFileType(sanitizedFile, [], allowedTypes);
      if (!validation.valid) {
        const errorMsg = validation.error || `File type ${ext} not allowed. Allowed types: ${allowedTypes.join(", ")}`;
        setError(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        auditLogger.log(AuditActions.ERROR_OCCURRED, "ai-studio", {
          error: "invalid_file_type",
          fileName: sanitizedName,
          fileType: sanitizedFile.type,
          extension: ext
        });
        return;
      }

      // Additional security: Check for dangerous file types
      const dangerousExtensions = [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar"];
      if (dangerousExtensions.includes(ext)) {
        const errorMsg = "This file type is not allowed for security reasons.";
        setError(errorMsg);
        if (onError) {
          onError(new Error(errorMsg));
        }
        auditLogger.log(AuditActions.ERROR_OCCURRED, "ai-studio", {
          error: "dangerous_file_type",
          fileName: sanitizedName,
          extension: ext
        });
        return;
      }

      // Upload file
      setIsUploading(true);
      setProgress(0);

      try {
        // Log file upload for audit
        auditLogger.log(AuditActions.FILE_UPLOADED, "ai-studio", {
          fileName: sanitizedName,
          fileSize: sanitizedFile.size,
          fileType: sanitizedFile.type,
          extension: ext
        });

        const formData = new FormData();
        formData.append("file", sanitizedFile);

        // Simulate progress (in production, use XMLHttpRequest for real progress)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch("/api/ai-studio/datasets/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        setSuccess(true);

        if (onUploadComplete) {
          onUploadComplete(data.data);
        }

        // Reset after 2 seconds
        setTimeout(() => {
          setSuccess(false);
          setProgress(0);
          if (event.target) {
            event.target.value = "";
          }
        }, 2000);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error.message);
        if (onError) {
          onError(error);
        }
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, allowedTypes, onUploadComplete, onError]
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          id="dataset-upload"
          onChange={handleFileSelect}
          disabled={isUploading}
          accept={allowedTypes.join(",")}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <label
          htmlFor="dataset-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all ${
            isUploading
              ? "border-primary-500 bg-primary-50"
              : success
              ? "border-green-500 bg-green-50"
              : error
              ? "border-red-500 bg-red-50"
              : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100"
          } ${isUploading ? "cursor-wait" : "cursor-pointer"}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin mb-2" />
              <span className="text-sm font-medium text-primary-900">Uploading...</span>
              <span className="text-xs text-primary-700 mt-1">{progress}%</span>
            </>
          ) : success ? (
            <>
              <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-green-900">Upload successful!</span>
            </>
          ) : error ? (
            <>
              <XCircle className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-red-900">{error}</span>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-medium text-slate-900">Click to upload dataset</span>
              <span className="text-xs text-slate-600 mt-1">
                Max {maxSize / (1024 * 1024)}MB • {allowedTypes.join(", ")}
              </span>
            </>
          )}
        </label>
      </div>

      {isUploading && (
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

