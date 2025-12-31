"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileSearch, HelpCircle, Upload, Download, CheckCircle2, AlertCircle } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

interface FieldInfo {
  name: string;
  type: string;
  nullable: boolean;
  sampleValues: unknown[];
  unique: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
}

interface SchemaValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export default function SchemaPage() {
  const [jsonData, setJsonData] = useState<string>("");
  const [schema, setSchema] = useState<Record<string, FieldInfo>>({});
  const [validation, setValidation] = useState<SchemaValidation | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  function inferType(value: unknown): string {
    if (value === null || value === undefined) return "null";
    if (typeof value === "string") {
      if (/^\d{4}-\d{2}-\d{2}/.test(value)) return "date";
      if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return "datetime";
      if (/^https?:\/\//.test(value)) return "url";
      if (/^[\w.-]+@[\w.-]+\.\w+/.test(value)) return "email";
      return "string";
    }
    if (typeof value === "number") {
      if (Number.isInteger(value)) return "integer";
      return "number";
    }
    if (typeof value === "boolean") return "boolean";
    if (Array.isArray(value)) return "array";
    if (typeof value === "object") return "object";
    return "unknown";
  }

  function analyzeSchema() {
    if (!jsonData.trim()) {
      alert("Please enter JSON data");
      return;
    }

    try {
      const data = JSON.parse(jsonData);
      const arrayData = Array.isArray(data) ? data : [data];
      if (arrayData.length === 0) {
        alert("Data array is empty");
        return;
      }

      const schemaMap: Record<string, FieldInfo> = {};

      arrayData.forEach((item) => {
        Object.keys(item).forEach((key) => {
          if (!schemaMap[key]) {
            schemaMap[key] = {
              name: key,
              type: inferType(item[key]),
              nullable: false,
              sampleValues: [],
              unique: true,
            };
          }

          const field = schemaMap[key];
          const value = item[key];

          // Update type if more specific
          const inferredType = inferType(value);
          if (inferredType !== "unknown" && field.type === "unknown") {
            field.type = inferredType;
          }

          // Check nullable
          if (value === null || value === undefined) {
            field.nullable = true;
          }

          // Collect sample values
          if (field.sampleValues.length < 5 && value !== null && value !== undefined) {
            field.sampleValues.push(value);
          }

          // Check uniqueness
          if (field.sampleValues.length > 1) {
            const uniqueValues = new Set(field.sampleValues);
            field.unique = uniqueValues.size === field.sampleValues.length;
          }

          // Update length constraints for strings
          if (typeof value === "string") {
            if (field.minLength === undefined || value.length < field.minLength) {
              field.minLength = value.length;
            }
            if (field.maxLength === undefined || value.length > field.maxLength) {
              field.maxLength = value.length;
            }
          }

          // Update value constraints for numbers
          if (typeof value === "number") {
            if (field.minValue === undefined || value < field.minValue) {
              field.minValue = value;
            }
            if (field.maxValue === undefined || value > field.maxValue) {
              field.maxValue = value;
            }
          }
        });
      });

      setSchema(schemaMap);
      setAnalyzed(true);

      // Validate schema
      const errors: string[] = [];
      const warnings: string[] = [];

      Object.values(schemaMap).forEach((field) => {
        if (field.type === "unknown") {
          errors.push(`Field "${field.name}" has unknown type`);
        }
        if (field.nullable && arrayData.every((item) => item[field.name] === null || item[field.name] === undefined)) {
          warnings.push(`Field "${field.name}" is always null - consider removing it`);
        }
        if (field.type === "string" && field.maxLength && field.maxLength > 1000) {
          warnings.push(`Field "${field.name}" has very long strings (max ${field.maxLength} chars)`);
        }
      });

      setValidation({
        valid: errors.length === 0,
        errors,
        warnings,
      });
    } catch (error) {
      alert(`Invalid JSON: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  function handleDownload() {
    const report = {
      schema: Object.values(schema),
      validation,
      analyzedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema-report.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setJsonData("");
    setSchema({});
    setValidation(null);
    setAnalyzed(false);
  }

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/data-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Data Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                  <FileSearch className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Schema Inspector</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Inspect and validate data schemas</p>
                </div>
                <HelpTooltip
                  title="Schema Inspector"
                  content={
                    <div className="space-y-4">
                      <p>Analyze JSON data to infer schema structure and validate data quality.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Automatic schema inference</li>
                          <li>Field type detection</li>
                          <li>Data validation</li>
                          <li>Schema comparison</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="data" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="data-studio-schema" />
            </div>

            <div className="space-y-6">
              {/* JSON Input */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  JSON Data
                </label>
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder='[{"name": "John", "age": 30, "email": "john@example.com"}, {"name": "Jane", "age": 25, "email": "jane@example.com"}]'
                  className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500 font-mono text-sm"
                  rows={8}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Enter JSON array or object. The inspector will analyze the structure and infer the schema.
                </p>
              </div>

              {/* Analyze Button */}
              <div>
                <button
                  onClick={analyzeSchema}
                  disabled={!jsonData.trim()}
                  className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Schema
                </button>
              </div>

              {/* Validation Results */}
              {validation && (
                <div className={`rounded-lg border p-4 ${
                  validation.valid
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                }`}>
                  <div className="flex items-center gap-2 mb-3">
                    {validation.valid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <h3 className="font-semibold text-slate-900">
                      {validation.valid ? "Schema Valid" : "Schema Validation Failed"}
                    </h3>
                  </div>
                  {validation.errors.length > 0 && (
                    <div className="mb-3">
                      <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-800">
                        {validation.errors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {validation.warnings.length > 0 && (
                    <div>
                      <h4 className="font-medium text-amber-900 mb-2">Warnings:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
                        {validation.warnings.map((warning, idx) => (
                          <li key={idx}>{warning}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Schema Results */}
              {analyzed && Object.keys(schema).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Inferred Schema</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-4">
                      {Object.values(schema).map((field) => (
                        <div key={field.name} className="p-4 rounded-lg border border-slate-200 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{field.name}</div>
                            <div className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                              {field.type}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-slate-600">
                            <div>
                              <span className="font-medium">Nullable:</span> {field.nullable ? "Yes" : "No"}
                            </div>
                            <div>
                              <span className="font-medium">Unique:</span> {field.unique ? "Yes" : "No"}
                            </div>
                            {field.minLength !== undefined && (
                              <div>
                                <span className="font-medium">Length:</span> {field.minLength} - {field.maxLength}
                              </div>
                            )}
                            {field.minValue !== undefined && (
                              <div>
                                <span className="font-medium">Range:</span> {field.minValue} - {field.maxValue}
                              </div>
                            )}
                          </div>
                          {field.sampleValues.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-slate-600">Sample values: </span>
                              <span className="text-xs text-slate-500">
                                {field.sampleValues.slice(0, 3).map(String).join(", ")}
                                {field.sampleValues.length > 3 && "..."}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              {analyzed && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Schema Report
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Analyze Another Schema
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
