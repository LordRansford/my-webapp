"use client";

import React, { useState, useRef, memo, useCallback, useMemo } from "react";
import { Upload, FileText, X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { supportedFormats, getFormatByExtension, FileFormatInfo } from "@/lib/studios/file-formats";
import { sanitizeFileName, validateFileType } from "@/lib/studios/security/inputSanitizer";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";
import HelpTooltip from "./HelpTooltip";

interface EnhancedFileUploadProps {
  id: string;
  label: string;
  accept?: string[];
  maxSize?: number; // in bytes
  required?: boolean;
  help?: string;
  example?: string;
  onChange?: (file: File | null) => void;
  onError?: (error: string) => void;
  className?: string;
}

const EnhancedFileUpload = memo(function EnhancedFileUpload({
  id,
  label,
  accept = [],
  maxSize = 10 * 1024 * 1024, // 10MB default
  required = false,
  help,
  example,
  onChange,
  onError,
  className = ""
}: EnhancedFileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);

    // Sanitize file name to prevent path traversal attacks
    const sanitizedName = sanitizeFileName(file.name);
    if (sanitizedName !== file.name) {
      // Create a new File object with sanitized name
      const sanitizedFile = new File([file], sanitizedName, { type: file.type });
      file = sanitizedFile;
    }

    // Check file size
    if (file.size > maxSize) {
      const errorMsg = `File is too large. Maximum size is ${formatBytes(maxSize)}.`;
      setError(errorMsg);
      if (onError) onError(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "studios", {
        error: "file_too_large",
        fileName: sanitizedName,
        fileSize: file.size,
        maxSize
      });
      return;
    }

    // Check file type
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    const formatInfo = getFormatByExtension(extension);
    
    if (accept.length > 0) {
      const acceptedExtensions = accept.map(ext => ext.toLowerCase().replace(/^\./, ""));
      const fileExtension = extension.replace(/^\./, "");
      const mimeTypes = accept.filter(ext => ext.includes("/")).map(ext => ext.toLowerCase());
      
      const validation = validateFileType(file, mimeTypes, acceptedExtensions);
      if (!validation.valid) {
        const errorMsg = validation.error || `File type not supported. Accepted formats: ${accept.join(", ")}`;
        setError(errorMsg);
        if (onError) onError(errorMsg);
        auditLogger.log(AuditActions.ERROR_OCCURRED, "studios", {
          error: "invalid_file_type",
          fileName: sanitizedName,
          fileType: file.type,
          extension
        });
        return;
      }
    }

    // Additional security: Check for dangerous file types
    const dangerousExtensions = [".exe", ".bat", ".cmd", ".com", ".pif", ".scr", ".vbs", ".js", ".jar"];
    if (dangerousExtensions.includes(extension)) {
      const errorMsg = "This file type is not allowed for security reasons.";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      auditLogger.log(AuditActions.ERROR_OCCURRED, "studios", {
        error: "dangerous_file_type",
        fileName: sanitizedName,
        extension
      });
      return;
    }

    setSelectedFile(file);
    
    // Log file upload for audit
    auditLogger.log(AuditActions.FILE_UPLOADED, "studios", {
      fileName: sanitizedName,
      fileSize: file.size,
      fileType: file.type,
      extension
    });
    
    if (onChange) onChange(file);
  }, [maxSize, accept, onChange, onError]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  }, [handleFile]);

  const removeFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) onChange(null);
  }, [onChange]);

  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }, []);

  const formatInfo = useMemo(() => 
    selectedFile ? getFormatByExtension("." + selectedFile.name.split(".").pop()?.toLowerCase()) : null,
    [selectedFile]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center gap-2">
        <label htmlFor={id} className="text-sm font-semibold text-slate-900">
          {label}
          {required && <span className="text-rose-600 ml-1">*</span>}
        </label>
        <HelpTooltip
          title="File Upload Help"
          content={
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What files can I upload?</h3>
                <p className="text-sm text-slate-700 mb-2">
                  You can upload various types of files depending on what you are working with:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                  {accept.length > 0 ? (
                    accept.map((ext, idx) => (
                      <li key={idx}>{ext.toUpperCase()} files</li>
                    ))
                  ) : (
                    <>
                      <li>Images (JPG, PNG, GIF)</li>
                      <li>Documents (PDF, DOC, DOCX, TXT)</li>
                      <li>Data files (CSV, JSON, XLSX)</li>
                      <li>Audio (MP3, WAV)</li>
                      <li>Video (MP4)</li>
                      <li>Presentations (PPT, PPTX)</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Why does file structure matter?</h3>
                <p className="text-sm text-slate-700">
                  Different file formats store information in different ways. Understanding the structure helps the computer 
                  read and process your file correctly. For example, a CSV file stores data in rows and columns separated by 
                  commas, while a JSON file uses a nested structure with curly braces and square brackets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What information can I store?</h3>
                <p className="text-sm text-slate-700">
                  The type of information you can store depends on the file format. For example:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-slate-700 mt-2">
                  <li><strong>CSV:</strong> Lists of data like names, ages, and addresses in a table format</li>
                  <li><strong>JSON:</strong> Structured data like settings, API responses, or nested information</li>
                  <li><strong>Images:</strong> Pictures, photos, diagrams, or graphics</li>
                  <li><strong>Documents:</strong> Text, reports, letters, or formatted content</li>
                </ul>
              </div>
              {help && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Additional Help</h3>
                  <p className="text-sm text-slate-700">{help}</p>
                </div>
              )}
              {example && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Example</h3>
                  <p className="text-sm text-slate-700">{example}</p>
                </div>
              )}
            </div>
          }
          examples={[
            "Upload a CSV file with customer data (name, email, age)",
            "Upload a JSON file with application settings",
            "Upload an image file (JPG or PNG) for processing"
          ]}
        />
      </div>

      {help && (
        <p className="text-xs text-slate-600">{help}</p>
      )}

      {example && (
        <p className="text-xs text-slate-500 italic">Example: {example}</p>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-colors ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : error
            ? "border-rose-300 bg-rose-50"
            : selectedFile
            ? "border-green-300 bg-green-50"
            : "border-slate-300 bg-slate-50 hover:border-slate-400"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept.length > 0 ? accept.join(",") : undefined}
          onChange={handleChange}
          className="hidden"
          required={required}
        />

        {selectedFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-600">{formatBytes(selectedFile.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={removeFile}
                className="text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formatInfo && (
              <div className="bg-white border border-slate-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-900 mb-1">{formatInfo.name}</p>
                    <p className="text-xs text-slate-700 mb-2">{formatInfo.description}</p>
                    <div className="bg-slate-50 p-2 rounded text-xs text-slate-600">
                      <strong>Structure:</strong> {formatInfo.structure}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor={id}
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-900 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-slate-600">
              Maximum size: {formatBytes(maxSize)}
              {accept.length > 0 && ` • Accepted: ${accept.join(", ")}`}
            </p>
          </label>
        )}

        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-rose-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default EnhancedFileUpload;

