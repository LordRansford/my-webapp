"use client";

/**
 * Dataset Explorer Component
 * 
 * Displays dataset information, statistics, and preview
 */

import React, { useState } from "react";
import { Database, FileText, BarChart3, AlertCircle, CheckCircle } from "lucide-react";

interface Dataset {
  id: string;
  name: string;
  type: string;
  size: number;
  rows: number;
  columns: number;
  license: string;
  status: string;
  qualityScore?: number;
  schema?: {
    columns: Array<{
      name: string;
      type: string;
      nullable: boolean;
      min?: number;
      max?: number;
      mean?: number;
      categories?: string[];
      distribution?: Record<string, number>;
    }>;
  };
}

interface DatasetExplorerProps {
  dataset: Dataset;
  onSelect?: (datasetId: string) => void;
}

export default function DatasetExplorer({ dataset, onSelect }: DatasetExplorerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "schema" | "statistics" | "preview">(
    "overview"
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary-100 rounded-xl">
              <Database className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{dataset.name}</h3>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-slate-600 capitalize">{dataset.type}</span>
                <span className="text-slate-300">•</span>
                <span className="text-sm text-slate-600">{formatBytes(dataset.size)}</span>
                <span className="text-slate-300">•</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    dataset.status
                  )}`}
                >
                  {dataset.status}
                </span>
              </div>
            </div>
          </div>
          {onSelect && (
            <button
              onClick={() => onSelect(dataset.id)}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              Select Dataset
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-1 px-6">
          {[
            { id: "overview", label: "Overview", icon: FileText },
            { id: "schema", label: "Schema", icon: Database },
            { id: "statistics", label: "Statistics", icon: BarChart3 },
            { id: "preview", label: "Preview", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600 font-semibold"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Rows</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {dataset.rows.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Columns</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{dataset.columns}</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="text-sm text-slate-600">Quality Score</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">
                  {dataset.qualityScore ? (dataset.qualityScore * 100).toFixed(1) : "N/A"}%
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">License</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-slate-900 capitalize">{dataset.license}</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-slate-700 mb-1">Status</div>
                <div className="flex items-center gap-2">
                  {dataset.status === "verified" ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="text-slate-900 capitalize">{dataset.status}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "schema" && dataset.schema && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Column Schema</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Column
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Type
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Nullable
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                      Range
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {dataset.schema.columns.map((col, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-3 px-4 text-sm font-medium text-slate-900">{col.name}</td>
                      <td className="py-3 px-4 text-sm text-slate-600 capitalize">{col.type}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {col.nullable ? "Yes" : "No"}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {col.min !== undefined && col.max !== undefined
                          ? `${col.min} - ${col.max}`
                          : col.categories
                          ? `${col.categories.length} categories`
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "statistics" && dataset.schema && (
          <div className="space-y-6">
            <h4 className="font-semibold text-slate-900">Column Statistics</h4>
            {dataset.schema.columns.map((col, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg">
                <div className="font-medium text-slate-900 mb-3">{col.name}</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {col.mean !== undefined && (
                    <div>
                      <span className="text-slate-600">Mean:</span>
                      <span className="ml-2 font-semibold text-slate-900">
                        {col.mean.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {col.min !== undefined && (
                    <div>
                      <span className="text-slate-600">Min:</span>
                      <span className="ml-2 font-semibold text-slate-900">{col.min}</span>
                    </div>
                  )}
                  {col.max !== undefined && (
                    <div>
                      <span className="text-slate-600">Max:</span>
                      <span className="ml-2 font-semibold text-slate-900">{col.max}</span>
                    </div>
                  )}
                  {col.distribution && (
                    <div className="col-span-2">
                      <div className="text-slate-600 mb-2">Distribution:</div>
                      <div className="space-y-1">
                        {Object.entries(col.distribution).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2">
                            <div className="w-24 text-sm text-slate-700">{key}:</div>
                            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-primary-500 transition-all"
                                style={{ width: `${value * 100}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-slate-600 text-right">
                              {(value * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "preview" && (
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Data Preview</h4>
            <div className="p-4 bg-slate-50 rounded-lg text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Data preview would be displayed here</p>
              <p className="text-sm mt-1">First 10 rows of the dataset</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

