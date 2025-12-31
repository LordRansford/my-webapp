"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, HelpCircle, Plus, Trash2, Download, CheckCircle2, Database, Tag } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type DataType = "table" | "view" | "file" | "api" | "stream";
type Sensitivity = "public" | "internal" | "confidential" | "restricted";

interface DataAsset {
  id: string;
  name: string;
  type: DataType;
  description: string;
  owner: string;
  location: string;
  sensitivity: Sensitivity;
  tags: string[];
  schema?: string;
  lastUpdated?: string;
}

export default function CatalogPage() {
  const [catalogName, setCatalogName] = useState("");
  const [assets, setAssets] = useState<DataAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [catalogDoc, setCatalogDoc] = useState<string>("");

  function addAsset() {
    const newAsset: DataAsset = {
      id: Date.now().toString(),
      name: "New Asset",
      type: "table",
      description: "",
      owner: "",
      location: "",
      sensitivity: "internal",
      tags: [],
    };
    setAssets([...assets, newAsset]);
    setSelectedAsset(newAsset.id);
  }

  function removeAsset(id: string) {
    setAssets(assets.filter((a) => a.id !== id));
    if (selectedAsset === id) {
      setSelectedAsset(null);
    }
  }

  function updateAsset(id: string, updates: Partial<DataAsset>) {
    setAssets(assets.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }

  function addTag(assetId: string, tag: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset || asset.tags.includes(tag)) return;
    updateAsset(assetId, { tags: [...asset.tags, tag] });
  }

  function removeTag(assetId: string, tag: string) {
    const asset = assets.find((a) => a.id === assetId);
    if (!asset) return;
    updateAsset(assetId, { tags: asset.tags.filter((t) => t !== tag) });
  }

  function generateCatalog() {
    if (!catalogName.trim()) {
      alert("Please enter a catalog name");
      return;
    }

    if (assets.length === 0) {
      alert("Please add at least one data asset");
      return;
    }

    const doc = {
      catalog: {
        name: catalogName,
        generatedAt: new Date().toISOString(),
        totalAssets: assets.length,
      },
      assets: assets.map((asset) => ({
        ...asset,
        lastUpdated: asset.lastUpdated || new Date().toISOString(),
      })),
      summary: {
        byType: assets.reduce((acc, a) => {
          acc[a.type] = (acc[a.type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        bySensitivity: assets.reduce((acc, a) => {
          acc[a.sensitivity] = (acc[a.sensitivity] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        allTags: Array.from(new Set(assets.flatMap((a) => a.tags))),
      },
    };

    setCatalogDoc(JSON.stringify(doc, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!catalogDoc) return;
    const blob = new Blob([catalogDoc], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${catalogName || "data-catalog"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setCatalogName("");
    setAssets([]);
    setSelectedAsset(null);
    setGenerated(false);
    setCatalogDoc("");
  }

  const selectedAssetData = assets.find((a) => a.id === selectedAsset);
  const dataTypes = [
    { value: "table", label: "Table" },
    { value: "view", label: "View" },
    { value: "file", label: "File" },
    { value: "api", label: "API" },
    { value: "stream", label: "Stream" },
  ];

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
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Data Catalog Builder</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Organize and document your data assets</p>
                </div>
                <HelpTooltip
                  title="Data Catalog Builder"
                  content={
                    <div className="space-y-4">
                      <p>Create a comprehensive catalog of your data assets to improve discoverability and governance.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Document data assets</li>
                          <li>Classify by type and sensitivity</li>
                          <li>Add tags and metadata</li>
                          <li>Track ownership and location</li>
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
              <CreditEstimate toolId="data-studio-catalog" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Catalog Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Catalog Name</label>
                  <input
                    type="text"
                    value={catalogName}
                    onChange={(e) => setCatalogName(e.target.value)}
                    placeholder="My Data Catalog"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Assets List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Data Assets</label>
                    <button
                      onClick={addAsset}
                      className="flex items-center gap-2 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Asset
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {assets.map((asset) => {
                      const colorClasses = {
                        public: "bg-green-100 text-green-800",
                        internal: "bg-blue-100 text-blue-800",
                        confidential: "bg-yellow-100 text-yellow-800",
                        restricted: "bg-red-100 text-red-800",
                      };
                      return (
                        <div
                          key={asset.id}
                          onClick={() => setSelectedAsset(asset.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedAsset === asset.id
                              ? "border-amber-500 bg-amber-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{asset.name}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeAsset(asset.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-amber-100 text-amber-800 text-xs font-medium">
                              {asset.type}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${colorClasses[asset.sensitivity]}`}>
                              {asset.sensitivity}
                            </span>
                          </div>
                          {asset.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {asset.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs">
                                  {tag}
                                </span>
                              ))}
                              {asset.tags.length > 3 && (
                                <span className="text-xs text-slate-500">+{asset.tags.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Asset Editor */}
                {selectedAssetData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Asset</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Asset Name</label>
                        <input
                          type="text"
                          value={selectedAssetData.name}
                          onChange={(e) => updateAsset(selectedAssetData.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                          <select
                            value={selectedAssetData.type}
                            onChange={(e) => updateAsset(selectedAssetData.id, { type: e.target.value as DataType })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                          >
                            {dataTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Sensitivity</label>
                          <select
                            value={selectedAssetData.sensitivity}
                            onChange={(e) =>
                              updateAsset(selectedAssetData.id, { sensitivity: e.target.value as Sensitivity })
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                          >
                            <option value="public">Public</option>
                            <option value="internal">Internal</option>
                            <option value="confidential">Confidential</option>
                            <option value="restricted">Restricted</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedAssetData.description}
                          onChange={(e) => updateAsset(selectedAssetData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                          rows={3}
                          placeholder="Describe the data asset..."
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Owner</label>
                          <input
                            type="text"
                            value={selectedAssetData.owner}
                            onChange={(e) => updateAsset(selectedAssetData.id, { owner: e.target.value })}
                            placeholder="Data owner or team"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                          <input
                            type="text"
                            value={selectedAssetData.location}
                            onChange={(e) => updateAsset(selectedAssetData.id, { location: e.target.value })}
                            placeholder="Database, file path, or API endpoint"
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedAssetData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm"
                            >
                              {tag}
                              <button
                                onClick={() => removeTag(selectedAssetData.id, tag)}
                                className="text-amber-600 hover:text-amber-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add a tag and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              addTag(selectedAssetData.id, e.currentTarget.value.trim());
                              e.currentTarget.value = "";
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateCatalog}
                    disabled={!catalogName.trim() || assets.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Data Catalog
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Data catalog generated successfully!</span>
                </div>

                {/* Catalog Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Data Catalog</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{catalogDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Catalog
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Catalog
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}
