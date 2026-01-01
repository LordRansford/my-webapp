"use client";

import React, { useState, useCallback } from "react";
import { Settings, Download, Copy, CheckCircle2, Loader2 } from "lucide-react";

interface ConfigOption {
  id: string;
  label: string;
  type: "string" | "number" | "boolean" | "select" | "array";
  value: any;
  description?: string;
  options?: string[];
  required?: boolean;
}

interface AutoConfigGeneratorProps {
  configName: string;
  options: ConfigOption[];
  onGenerate?: (config: Record<string, any>) => string;
  format?: "json" | "yaml" | "env" | "toml";
  className?: string;
}

const defaultGenerator = (config: Record<string, any>, format: string): string => {
  switch (format) {
    case "json":
      return JSON.stringify(config, null, 2);
    case "yaml":
      // Simple YAML conversion (would use a library in production)
      return Object.entries(config)
        .map(([key, value]) => {
          if (typeof value === "object" && !Array.isArray(value)) {
            return `${key}:\n${Object.entries(value).map(([k, v]) => `  ${k}: ${v}`).join("\n")}`;
          }
          return `${key}: ${value}`;
        })
        .join("\n");
    case "env":
      return Object.entries(config)
        .map(([key, value]) => `${key.toUpperCase()}=${value}`)
        .join("\n");
    case "toml":
      return Object.entries(config)
        .map(([key, value]) => `${key} = "${value}"`)
        .join("\n");
    default:
      return JSON.stringify(config, null, 2);
  }
};

export function AutoConfigGenerator({
  configName,
  options,
  onGenerate = (config) => defaultGenerator(config, "json"),
  format = "json",
  className = ""
}: AutoConfigGeneratorProps) {
  const [configValues, setConfigValues] = useState<Record<string, any>>(
    options.reduce((acc, opt) => ({ ...acc, [opt.id]: opt.value }), {})
  );
  const [generatedConfig, setGeneratedConfig] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOptionChange = useCallback((optionId: string, value: any) => {
    setConfigValues(prev => ({ ...prev, [optionId]: value }));
  }, []);

  const generateConfig = useCallback(() => {
    setIsGenerating(true);
    try {
      const config = onGenerate(configValues);
      setGeneratedConfig(config);
    } catch (error) {
      console.error("Config generation failed:", error);
      setGeneratedConfig("Error generating config");
    } finally {
      setIsGenerating(false);
    }
  }, [configValues, onGenerate]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(generatedConfig);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [generatedConfig]);

  const downloadConfig = useCallback(() => {
    const blob = new Blob([generatedConfig], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${configName}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedConfig, configName, format]);

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-sky-600" />
          <h3 className="text-lg font-semibold text-slate-900">Auto Config Generator</h3>
        </div>
        <div className="flex gap-2">
          <select
            value={format}
            onChange={(e) => {/* Handle format change */}}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="json">JSON</option>
            <option value="yaml">YAML</option>
            <option value="env">.env</option>
            <option value="toml">TOML</option>
          </select>
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-4 mb-6">
        {options.map((option) => (
          <div key={option.id} className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              {option.label}
              {option.required && <span className="text-rose-600 ml-1">*</span>}
            </label>
            {option.description && (
              <p className="text-xs text-slate-500">{option.description}</p>
            )}
            {option.type === "select" && option.options ? (
              <select
                value={configValues[option.id] || ""}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {option.options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : option.type === "boolean" ? (
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={configValues[option.id] || false}
                  onChange={(e) => handleOptionChange(option.id, e.target.checked)}
                  className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                />
                <span className="text-sm text-slate-700">Enable</span>
              </label>
            ) : option.type === "number" ? (
              <input
                type="number"
                value={configValues[option.id] || ""}
                onChange={(e) => handleOptionChange(option.id, Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            ) : (
              <input
                type="text"
                value={configValues[option.id] || ""}
                onChange={(e) => handleOptionChange(option.id, e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            )}
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateConfig}
        disabled={isGenerating}
        className="w-full px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Settings className="w-4 h-4" />
            Generate Config
          </>
        )}
      </button>

      {/* Generated Config */}
      {generatedConfig && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Generated Config</span>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Copy to clipboard"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={downloadConfig}
                className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          <pre className="text-xs text-slate-800 bg-white p-3 rounded border border-slate-200 overflow-x-auto max-h-64 overflow-y-auto">
            {generatedConfig}
          </pre>
        </div>
      )}
    </div>
  );
}
