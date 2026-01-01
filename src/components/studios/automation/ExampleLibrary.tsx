"use client";

import React, { useState, useMemo, useCallback } from "react";
import { FileText, Upload, Search, Filter, Download, Trash2, Eye, CheckCircle2 } from "lucide-react";

interface Example {
  id: string;
  name: string;
  description?: string;
  category: string;
  fileType: string;
  size?: number;
  uploadedAt: string;
  tags?: string[];
  preview?: any;
  data?: any;
}

interface ExampleLibraryProps {
  examples?: Example[];
  onSelect?: (example: Example) => void;
  onUpload?: (file: File) => Promise<Example>;
  onDelete?: (exampleId: string) => void;
  categories?: string[];
  className?: string;
}

const defaultExamples: Example[] = [
  {
    id: "example-1",
    name: "Customer Churn Dataset",
    description: "Sample customer data with churn labels",
    category: "data",
    fileType: "csv",
    size: 12000,
    uploadedAt: new Date().toISOString(),
    tags: ["churn", "customer", "classification"]
  },
  {
    id: "example-2",
    name: "Risk Assessment Template",
    description: "Pre-filled risk assessment form",
    category: "cybersecurity",
    fileType: "json",
    size: 5000,
    uploadedAt: new Date().toISOString(),
    tags: ["risk", "assessment", "template"]
  }
];

export function ExampleLibrary({
  examples = defaultExamples,
  onSelect,
  onUpload,
  onDelete,
  categories = ["all", "data", "cybersecurity", "ai", "architecture"],
  className = ""
}: ExampleLibraryProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedExample, setSelectedExample] = useState<Example | null>(null);
  const [showUpload, setShowUpload] = useState(false);

  const filteredExamples = useMemo(() => {
    let filtered = [...examples];

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(ex =>
        ex.name.toLowerCase().includes(query) ||
        ex.description?.toLowerCase().includes(query) ||
        ex.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(ex => ex.category === selectedCategory);
    }

    return filtered;
  }, [examples, search, selectedCategory]);

  const handleSelect = useCallback((example: Example) => {
    setSelectedExample(example);
    if (onSelect) {
      onSelect(example);
    }
  }, [onSelect]);

  const handleUpload = useCallback(async (file: File) => {
    if (onUpload) {
      try {
        await onUpload(file);
        setShowUpload(false);
      } catch (error) {
        console.error("Upload failed:", error);
      }
    }
  }, [onUpload]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getFileTypeColor = (fileType: string) => {
    const colors: Record<string, string> = {
      csv: "bg-emerald-100 text-emerald-700",
      json: "bg-amber-100 text-amber-700",
      pdf: "bg-rose-100 text-rose-700",
      txt: "bg-slate-100 text-slate-700",
      xlsx: "bg-green-100 text-green-700"
    };
    return colors[fileType.toLowerCase()] || "bg-slate-100 text-slate-700";
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Example Library</h3>
          <span className="text-sm text-slate-500">({filteredExamples.length})</span>
        </div>
        {onUpload && (
          <button
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Example
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search examples..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Examples Grid */}
      {filteredExamples.length === 0 ? (
        <div className="text-center py-12 text-slate-600">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <p>No examples found.</p>
          {onUpload && (
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 text-sky-600 hover:text-sky-700 underline"
            >
              Upload your first example
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredExamples.map((example) => (
            <div
              key={example.id}
              className={`rounded-xl border-2 p-4 cursor-pointer transition-all ${
                selectedExample?.id === example.id
                  ? "border-sky-500 bg-sky-50"
                  : "border-slate-200 hover:border-slate-300 hover:shadow-md"
              }`}
              onClick={() => handleSelect(example)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 truncate">{example.name}</h4>
                  {example.description && (
                    <p className="text-sm text-slate-600 mt-1 line-clamp-2">{example.description}</p>
                  )}
                </div>
                {selectedExample?.id === example.id && (
                  <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 ml-2" />
                )}
              </div>

              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getFileTypeColor(example.fileType)}`}>
                  {example.fileType.toUpperCase()}
                </span>
                {example.size && (
                  <span className="text-xs text-slate-500">{formatFileSize(example.size)}</span>
                )}
                {example.tags?.slice(0, 2).map(tag => (
                  <span key={tag} className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-2 mt-3 pt-3 border-t border-slate-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(example);
                  }}
                  className="flex-1 px-3 py-1.5 text-sm bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Use This
                </button>
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete ${example.name}?`)) {
                        onDelete(example.id);
                      }
                    }}
                    className="px-3 py-1.5 text-sm border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUpload && onUpload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">Upload Example</h3>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(file);
                }
              }}
              className="w-full mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(false)}
                className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
