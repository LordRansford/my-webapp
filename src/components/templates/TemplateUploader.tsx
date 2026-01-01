"use client";

import React, { useState, useCallback } from "react";
import { Upload, FileText, X, Check, AlertCircle } from "lucide-react";

interface TemplateUploaderProps {
  onUpload?: (template: any) => void;
  onCancel?: () => void;
  maxSize?: number; // in bytes
  allowedFormats?: string[];
}

export function TemplateUploader({
  onUpload,
  onCancel,
  maxSize = 5 * 1024 * 1024, // 5MB default
  allowedFormats = [".json"]
}: TemplateUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${(maxSize / 1024 / 1024).toFixed(0)}MB limit`;
    }

    const extension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedFormats.includes(extension)) {
      return `File format not allowed. Allowed formats: ${allowedFormats.join(", ")}`;
    }

    return null;
  };

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
      const droppedFile = e.dataTransfer.files[0];
      const validationError = validateFile(droppedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setError(null);
        setFile(droppedFile);
      }
    }
  }, [maxSize, allowedFormats]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const validationError = validateFile(selectedFile);
      if (validationError) {
        setError(validationError);
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const text = await file.text();
      let template;
      
      try {
        template = JSON.parse(text);
      } catch (parseError) {
        throw new Error("Invalid JSON format");
      }

      // Validate template structure
      if (!template.id || !template.title || !template.description) {
        throw new Error("Template must have id, title, and description fields");
      }

      if (onUpload) {
        onUpload(template);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload template");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900">Upload Custom Template</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <p className="text-sm text-slate-600 mb-6">
        Upload a custom template JSON file. Templates must include id, title, description, and other required fields.
        Maximum file size: {(maxSize / 1024 / 1024).toFixed(0)}MB
      </p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          dragActive
            ? "border-sky-500 bg-sky-50"
            : file
            ? "border-emerald-300 bg-emerald-50"
            : "border-slate-300 bg-slate-50"
        }`}
      >
        {file ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <Check className="w-5 h-5" />
              <span className="font-medium">File selected</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-slate-600" />
              <div className="text-left">
                <p className="font-medium text-slate-900">{file.name}</p>
                <p className="text-sm text-slate-600">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                onClick={handleRemove}
                className="text-slate-600 hover:text-slate-900"
                aria-label="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-12 h-12 mx-auto text-slate-400" />
            <div>
              <p className="text-slate-700 font-medium">
                Drag and drop your template file here
              </p>
              <p className="text-sm text-slate-500 mt-1">or</p>
              <label className="inline-block mt-2">
                <span className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors cursor-pointer">
                  Browse Files
                </span>
                <input
                  type="file"
                  accept={allowedFormats.join(",")}
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-slate-500">
              Supported formats: {allowedFormats.join(", ")}
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-rose-800">{error}</p>
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <span className="animate-spin">⏳</span>
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload Template
            </>
          )}
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-slate-50 text-sm text-slate-700">
        <p className="font-semibold mb-2">Template Format Requirements:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Must be valid JSON</li>
          <li>Required fields: id, title, description, category</li>
          <li>Optional fields: tags, difficulty, estimatedMinutes, route</li>
          <li>See documentation for full template schema</li>
        </ul>
      </div>
    </div>
  );
}
