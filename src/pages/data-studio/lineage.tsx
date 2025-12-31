"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Network, HelpCircle, Plus, Trash2, Download, CheckCircle2, Database, ArrowRight } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type DataNodeType = "source" | "transform" | "destination";
type TransformType = "filter" | "aggregate" | "join" | "enrich" | "validate";

interface DataNode {
  id: string;
  name: string;
  type: DataNodeType;
  transformType?: TransformType;
  description: string;
  location: string;
}

interface DataFlow {
  from: string;
  to: string;
  transformation?: string;
}

export default function LineagePage() {
  const [lineageName, setLineageName] = useState("");
  const [nodes, setNodes] = useState<DataNode[]>([]);
  const [flows, setFlows] = useState<DataFlow[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [lineageDoc, setLineageDoc] = useState<string>("");

  function addNode(type: DataNodeType) {
    const newNode: DataNode = {
      id: Date.now().toString(),
      name: `${type}_${nodes.length + 1}`,
      type,
      description: "",
      location: "",
    };
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  }

  function removeNode(id: string) {
    setNodes(nodes.filter((n) => n.id !== id));
    setFlows(flows.filter((f) => f.from !== id && f.to !== id));
    if (selectedNode === id) {
      setSelectedNode(null);
    }
  }

  function updateNode(id: string, updates: Partial<DataNode>) {
    setNodes(nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)));
  }

  function addFlow(from: string, to: string) {
    if (flows.some((f) => f.from === from && f.to === to)) return;
    setFlows([...flows, { from, to }]);
  }

  function removeFlow(from: string, to: string) {
    setFlows(flows.filter((f) => !(f.from === from && f.to === to)));
  }

  function generateLineage() {
    if (!lineageName.trim()) {
      alert("Please enter a lineage name");
      return;
    }

    if (nodes.length === 0) {
      alert("Please add at least one data node");
      return;
    }

    const doc = {
      lineage: {
        name: lineageName,
        generatedAt: new Date().toISOString(),
        totalNodes: nodes.length,
        totalFlows: flows.length,
      },
      nodes: nodes.map((node) => ({
        ...node,
        dependencies: flows.filter((f) => f.to === node.id).map((f) => f.from),
        dependents: flows.filter((f) => f.from === node.id).map((f) => f.to),
      })),
      flows: flows.map((flow) => ({
        ...flow,
        fromNode: nodes.find((n) => n.id === flow.from)?.name,
        toNode: nodes.find((n) => n.id === flow.to)?.name,
      })),
      summary: {
        sources: nodes.filter((n) => n.type === "source").length,
        transforms: nodes.filter((n) => n.type === "transform").length,
        destinations: nodes.filter((n) => n.type === "destination").length,
      },
    };

    setLineageDoc(JSON.stringify(doc, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!lineageDoc) return;
    const blob = new Blob([lineageDoc], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${lineageName || "data-lineage"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setLineageName("");
    setNodes([]);
    setFlows([]);
    setSelectedNode(null);
    setGenerated(false);
    setLineageDoc("");
  }

  const selectedNodeData = nodes.find((n) => n.id === selectedNode);
  const availableNodes = nodes.filter((n) => n.id !== selectedNode);

  return (
    <SecureErrorBoundary studio="data-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/data-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Data Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <Network className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Data Lineage Mapper</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Visualize data flow and transformations</p>
                </div>
                <HelpTooltip
                  title="Data Lineage Mapper"
                  content={
                    <div className="space-y-4">
                      <p>Map and visualize how data flows through your systems, from sources to destinations.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Create data nodes (sources, transforms, destinations)</li>
                          <li>Map data flows between nodes</li>
                          <li>Track data transformations</li>
                          <li>Export lineage documentation</li>
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
              <CreditEstimate toolId="data-studio-lineage" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Lineage Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Lineage Name</label>
                  <input
                    type="text"
                    value={lineageName}
                    onChange={(e) => setLineageName(e.target.value)}
                    placeholder="My Data Lineage"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Add Nodes */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Add Data Nodes</label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => addNode("source")}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                    >
                      <Database className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">Source</span>
                    </button>
                    <button
                      onClick={() => addNode("transform")}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                    >
                      <Network className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">Transform</span>
                    </button>
                    <button
                      onClick={() => addNode("destination")}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                    >
                      <Database className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-medium text-slate-700">Destination</span>
                    </button>
                  </div>
                </div>

                {/* Nodes List */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Data Nodes</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {nodes.map((node) => {
                      const colorClasses = {
                        source: "bg-blue-100 text-blue-800",
                        transform: "bg-purple-100 text-purple-800",
                        destination: "bg-green-100 text-green-800",
                      };
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedNode === node.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{node.name}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNode(node.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${colorClasses[node.type]}`}>
                            {node.type}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Node Editor */}
                {selectedNodeData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Node</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Node Name</label>
                        <input
                          type="text"
                          value={selectedNodeData.name}
                          onChange={(e) => updateNode(selectedNodeData.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      {selectedNodeData.type === "transform" && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Transform Type</label>
                          <select
                            value={selectedNodeData.transformType || "filter"}
                            onChange={(e) =>
                              updateNode(selectedNodeData.id, { transformType: e.target.value as TransformType })
                            }
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="filter">Filter</option>
                            <option value="aggregate">Aggregate</option>
                            <option value="join">Join</option>
                            <option value="enrich">Enrich</option>
                            <option value="validate">Validate</option>
                          </select>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedNodeData.description}
                          onChange={(e) => updateNode(selectedNodeData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                          placeholder="Describe this data node..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                        <input
                          type="text"
                          value={selectedNodeData.location}
                          onChange={(e) => updateNode(selectedNodeData.id, { location: e.target.value })}
                          placeholder="Database, file path, or API endpoint"
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      {availableNodes.length > 0 && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Create Flow To</label>
                          <div className="flex flex-wrap gap-2">
                            {availableNodes.map((node) => {
                              const flowExists = flows.some((f) => f.from === selectedNodeData.id && f.to === node.id);
                              return (
                                <button
                                  key={node.id}
                                  onClick={() => {
                                    if (flowExists) {
                                      removeFlow(selectedNodeData.id, node.id);
                                    } else {
                                      addFlow(selectedNodeData.id, node.id);
                                    }
                                  }}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    flowExists
                                      ? "bg-indigo-600 text-white"
                                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                                  }`}
                                >
                                  {node.name}
                                  {flowExists && <CheckCircle2 className="w-4 h-4" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Flows Summary */}
                {flows.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-slate-700 mb-2">Data Flows ({flows.length})</h3>
                    <div className="space-y-1">
                      {flows.map((flow, index) => {
                        const fromNode = nodes.find((n) => n.id === flow.from);
                        const toNode = nodes.find((n) => n.id === flow.to);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded bg-slate-50 text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-slate-900">{fromNode?.name}</span>
                              <ArrowRight className="w-4 h-4 text-slate-500" />
                              <span className="font-medium text-slate-900">{toNode?.name}</span>
                            </div>
                            <button
                              onClick={() => removeFlow(flow.from, flow.to)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateLineage}
                    disabled={!lineageName.trim() || nodes.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Data Lineage
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Data lineage generated successfully!</span>
                </div>

                {/* Lineage Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Data Lineage Document</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{lineageDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Lineage
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Lineage
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
