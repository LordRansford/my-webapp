"use client";

import React, { useState, useCallback, useMemo } from "react";
import { FileText, Code, Settings, TestTube, Download, Copy, CheckCircle2, Loader2, Package } from "lucide-react";

export type OutputType = "code" | "config" | "documentation" | "tests" | "package";

export interface OutputFile {
  id: string;
  name: string;
  type: OutputType;
  content: string;
  language?: string;
  format?: string;
}

interface OutputGeneratorProps {
  outputs: OutputFile[];
  onGenerate?: (type: OutputType) => Promise<string>;
  onExport?: (files: OutputFile[]) => void;
  showPreview?: boolean;
  className?: string;
}

const outputTypeIcons = {
  code: Code,
  config: Settings,
  documentation: FileText,
  tests: TestTube,
  package: Package
};

const outputTypeLabels = {
  code: "Code",
  config: "Configuration",
  documentation: "Documentation",
  tests: "Tests",
  package: "Package"
};

export function OutputGenerator({
  outputs,
  onGenerate,
  onExport,
  showPreview = true,
  className = ""
}: OutputGeneratorProps) {
  const [selectedOutput, setSelectedOutput] = useState<OutputFile | null>(null);
  const [generating, setGenerating] = useState<Set<OutputType>>(new Set());
  const [copied, setCopied] = useState<Set<string>>(new Set());

  const groupedOutputs = useMemo(() => {
    const groups: Record<OutputType, OutputFile[]> = {
      code: [],
      config: [],
      documentation: [],
      tests: [],
      package: []
    };
    outputs.forEach(output => {
      if (groups[output.type]) {
        groups[output.type].push(output);
      }
    });
    return groups;
  }, [outputs]);

  const handleGenerate = useCallback(async (type: OutputType) => {
    if (!onGenerate) return;
    
    setGenerating(prev => new Set([...prev, type]));
    try {
      await onGenerate(type);
    } catch (error) {
      console.error(`Failed to generate ${type}:`, error);
    } finally {
      setGenerating(prev => {
        const next = new Set(prev);
        next.delete(type);
        return next;
      });
    }
  }, [onGenerate]);

  const handleCopy = useCallback(async (fileId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(prev => new Set([...prev, fileId]));
      setTimeout(() => {
        setCopied(prev => {
          const next = new Set(prev);
          next.delete(fileId);
          return next;
        });
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, []);

  const handleDownload = useCallback((file: OutputFile) => {
    const extension = file.language === "typescript" ? "ts"
      : file.language === "javascript" ? "js"
      : file.language === "python" ? "py"
      : file.format || "txt";
    
    const blob = new Blob([file.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleExportAll = useCallback(() => {
    if (onExport) {
      onExport(outputs);
    } else {
      // Default: download all as zip (would need a zip library in production)
      outputs.forEach(file => handleDownload(file));
    }
  }, [outputs, onExport, handleDownload]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Production Outputs</h2>
          <p className="text-sm text-slate-600 mt-1">
            Generate and export production-ready code, configs, docs, and tests
          </p>
        </div>
        {outputs.length > 0 && (
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
        )}
      </div>

      {/* Output Types */}
      {Object.entries(groupedOutputs).map(([type, files]) => {
        if (files.length === 0 && !onGenerate) return null;
        
        const Icon = outputTypeIcons[type as OutputType];
        const label = outputTypeLabels[type as OutputType];
        const isGenerating = generating.has(type as OutputType);

        return (
          <div key={type} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-sky-600" />
                <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
                {files.length > 0 && (
                  <span className="text-sm text-slate-500">({files.length} files)</span>
                )}
              </div>
              {onGenerate && (
                <button
                  onClick={() => handleGenerate(type as OutputType)}
                  disabled={isGenerating}
                  className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon className="w-4 h-4" />
                      Generate {label}
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Files List */}
            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate">{file.name}</div>
                        {file.language && (
                          <div className="text-xs text-slate-500">{file.language}</div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {showPreview && (
                        <button
                          onClick={() => setSelectedOutput(file)}
                          className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                          Preview
                        </button>
                      )}
                      <button
                        onClick={() => handleCopy(file.id, file.content)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Copy"
                      >
                        {copied.has(file.id) ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDownload(file)}
                        className="p-1.5 text-slate-600 hover:text-slate-900 transition-colors"
                        aria-label="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No {label.toLowerCase()} files generated yet.
              </div>
            )}
          </div>
        );
      })}

      {/* Preview Modal */}
      {selectedOutput && showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                {selectedOutput.language && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                    {selectedOutput.language}
                  </span>
                )}
                <h3 className="font-semibold text-slate-900">{selectedOutput.name}</h3>
              </div>
              <button
                onClick={() => setSelectedOutput(null)}
                className="text-slate-600 hover:text-slate-900"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <pre className="text-xs text-slate-800 bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                <code>{selectedOutput.content}</code>
              </pre>
            </div>
            <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-200">
              <button
                onClick={() => handleCopy(selectedOutput.id, selectedOutput.content)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                {copied.has(selectedOutput.id) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy
                  </>
                )}
              </button>
              <button
                onClick={() => handleDownload(selectedOutput)}
                className="px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
