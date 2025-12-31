"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, HelpCircle, Plus, Trash2, Download, CheckCircle2, Network, Lock } from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import StudioNavigation from "@/components/studios/StudioNavigation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import CreditEstimate from "@/components/studios/CreditEstimate";

type ComponentType = "firewall" | "load_balancer" | "web_server" | "database" | "api_gateway" | "cache" | "cdn" | "vpn";
type TrustZone = "public" | "dmz" | "internal" | "restricted";

interface SecurityComponent {
  id: string;
  name: string;
  type: ComponentType;
  trustZone: TrustZone;
  description: string;
  securityControls: string[];
  vulnerabilities: string[];
}

interface SecurityConnection {
  from: string;
  to: string;
  protocol: string;
  encrypted: boolean;
}

export default function SecurityArchitecturePage() {
  const [architectureName, setArchitectureName] = useState("");
  const [components, setComponents] = useState<SecurityComponent[]>([]);
  const [connections, setConnections] = useState<SecurityConnection[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [generated, setGenerated] = useState(false);
  const [architectureDoc, setArchitectureDoc] = useState<string>("");

  function addComponent() {
    const newComponent: SecurityComponent = {
      id: Date.now().toString(),
      name: `Component ${components.length + 1}`,
      type: "web_server",
      trustZone: "dmz",
      description: "",
      securityControls: [],
      vulnerabilities: [],
    };
    setComponents([...components, newComponent]);
    setSelectedComponent(newComponent.id);
  }

  function removeComponent(id: string) {
    setComponents(components.filter((c) => c.id !== id));
    setConnections(connections.filter((conn) => conn.from !== id && conn.to !== id));
    if (selectedComponent === id) {
      setSelectedComponent(null);
    }
  }

  function updateComponent(id: string, updates: Partial<SecurityComponent>) {
    setComponents(components.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  function addControl(componentId: string, control: string) {
    const component = components.find((c) => c.id === componentId);
    if (!component || component.securityControls.includes(control)) return;
    updateComponent(componentId, { securityControls: [...component.securityControls, control] });
  }

  function removeControl(componentId: string, control: string) {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;
    updateComponent(componentId, { securityControls: component.securityControls.filter((c) => c !== control) });
  }

  function addVulnerability(componentId: string, vulnerability: string) {
    const component = components.find((c) => c.id === componentId);
    if (!component || component.vulnerabilities.includes(vulnerability)) return;
    updateComponent(componentId, { vulnerabilities: [...component.vulnerabilities, vulnerability] });
  }

  function removeVulnerability(componentId: string, vulnerability: string) {
    const component = components.find((c) => c.id === componentId);
    if (!component) return;
    updateComponent(componentId, { vulnerabilities: component.vulnerabilities.filter((v) => v !== vulnerability) });
  }

  function generateArchitecture() {
    if (!architectureName.trim()) {
      alert("Please enter an architecture name");
      return;
    }

    if (components.length === 0) {
      alert("Please add at least one component");
      return;
    }

    const doc = {
      architecture: {
        name: architectureName,
        generatedAt: new Date().toISOString(),
        totalComponents: components.length,
      },
      components: components.map((comp) => ({
        ...comp,
        attackSurface: comp.trustZone === "public" || comp.trustZone === "dmz" ? "high" : "low",
      })),
      connections: connections,
      summary: {
        byTrustZone: components.reduce((acc, c) => {
          acc[c.trustZone] = (acc[c.trustZone] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        totalVulnerabilities: components.reduce((sum, c) => sum + c.vulnerabilities.length, 0),
        totalControls: components.reduce((sum, c) => sum + c.securityControls.length, 0),
      },
    };

    setArchitectureDoc(JSON.stringify(doc, null, 2));
    setGenerated(true);
  }

  function handleDownload() {
    if (!architectureDoc) return;
    const blob = new Blob([architectureDoc], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${architectureName || "security-architecture"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function handleReset() {
    setArchitectureName("");
    setComponents([]);
    setConnections([]);
    setSelectedComponent(null);
    setGenerated(false);
    setArchitectureDoc("");
  }

  const selectedComponentData = components.find((c) => c.id === selectedComponent);
  const componentTypes = [
    { value: "firewall", label: "Firewall" },
    { value: "load_balancer", label: "Load Balancer" },
    { value: "web_server", label: "Web Server" },
    { value: "database", label: "Database" },
    { value: "api_gateway", label: "API Gateway" },
    { value: "cache", label: "Cache" },
    { value: "cdn", label: "CDN" },
    { value: "vpn", label: "VPN" },
  ];

  const trustZones = [
    { value: "public", label: "Public", color: "bg-red-100 text-red-800" },
    { value: "dmz", label: "DMZ", color: "bg-orange-100 text-orange-800" },
    { value: "internal", label: "Internal", color: "bg-yellow-100 text-yellow-800" },
    { value: "restricted", label: "Restricted", color: "bg-green-100 text-green-800" },
  ];

  return (
    <SecureErrorBoundary studio="cyber-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
          <header className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Link href="/cyber-studio" className="text-slate-600 hover:text-slate-900 transition-colors" aria-label="Back to Cyber Studio">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Security Architecture Designer</h1>
                  <p className="text-base sm:text-lg text-slate-600 mt-1">Visual security architecture with attack surface mapping</p>
                </div>
                <HelpTooltip
                  title="Security Architecture Designer"
                  content={
                    <div className="space-y-4">
                      <p>Design and document your security architecture with trust zones and attack surface mapping.</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Features:</h3>
                        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
                          <li>Define security components and trust zones</li>
                          <li>Map attack surfaces</li>
                          <li>Document security controls</li>
                          <li>Identify vulnerabilities</li>
                        </ul>
                      </div>
                    </div>
                  }
                />
              </div>
              <StudioNavigation studioType="cyber" showHub={true} />
            </div>
          </header>

          <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
            {/* Credit Estimate */}
            <div className="mb-6">
              <CreditEstimate toolId="cyber-studio-security-architecture" />
            </div>

            {!generated ? (
              <div className="space-y-6">
                {/* Architecture Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Architecture Name</label>
                  <input
                    type="text"
                    value={architectureName}
                    onChange={(e) => setArchitectureName(e.target.value)}
                    placeholder="My Security Architecture"
                    className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Components List */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700">Security Components</label>
                    <button
                      onClick={addComponent}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Component
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {components.map((component) => {
                      const zone = trustZones.find((z) => z.value === component.trustZone);
                      return (
                        <div
                          key={component.id}
                          onClick={() => setSelectedComponent(component.id)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedComponent === component.id
                              ? "border-indigo-500 bg-indigo-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-semibold text-slate-900">{component.name}</div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeComponent(component.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-medium">
                              {component.type.replace("_", " ")}
                            </span>
                            {zone && (
                              <span className={`px-2 py-1 rounded text-xs font-medium ${zone.color}`}>
                                {zone.label}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-600">
                            {component.securityControls.length} controls, {component.vulnerabilities.length} vulnerabilities
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Component Editor */}
                {selectedComponentData && (
                  <div className="p-6 rounded-lg border border-slate-200 bg-slate-50">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Edit Component</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Component Name</label>
                        <input
                          type="text"
                          value={selectedComponentData.name}
                          onChange={(e) => updateComponent(selectedComponentData.id, { name: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                          <select
                            value={selectedComponentData.type}
                            onChange={(e) => updateComponent(selectedComponentData.id, { type: e.target.value as ComponentType })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            {componentTypes.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Trust Zone</label>
                          <select
                            value={selectedComponentData.trustZone}
                            onChange={(e) => updateComponent(selectedComponentData.id, { trustZone: e.target.value as TrustZone })}
                            className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            {trustZones.map((zone) => (
                              <option key={zone.value} value={zone.value}>
                                {zone.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                        <textarea
                          value={selectedComponentData.description}
                          onChange={(e) => updateComponent(selectedComponentData.id, { description: e.target.value })}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                          placeholder="Describe the component and its role..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Security Controls</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedComponentData.securityControls.map((control) => (
                            <span
                              key={control}
                              className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm"
                            >
                              {control}
                              <button
                                onClick={() => removeControl(selectedComponentData.id, control)}
                                className="text-green-600 hover:text-green-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add a security control and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              addControl(selectedComponentData.id, e.currentTarget.value.trim());
                              e.currentTarget.value = "";
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Known Vulnerabilities</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {selectedComponentData.vulnerabilities.map((vuln) => (
                            <span
                              key={vuln}
                              className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm"
                            >
                              {vuln}
                              <button
                                onClick={() => removeVulnerability(selectedComponentData.id, vuln)}
                                className="text-red-600 hover:text-red-800"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          type="text"
                          placeholder="Add a vulnerability and press Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              addVulnerability(selectedComponentData.id, e.currentTarget.value.trim());
                              e.currentTarget.value = "";
                            }
                          }}
                          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate Button */}
                <div className="pt-4">
                  <button
                    onClick={generateArchitecture}
                    disabled={!architectureName.trim() || components.length === 0}
                    className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Generate Security Architecture
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Security architecture generated successfully!</span>
                </div>

                {/* Architecture Preview */}
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">Security Architecture Document</h3>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">{architectureDoc}</pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Architecture
                  </button>
                  <button
                    onClick={handleReset}
                    className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 rounded-lg font-semibold transition-colors"
                  >
                    Create Another Architecture
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
