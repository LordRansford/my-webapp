"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  FileText, 
  Plus, 
  Search,
  Calendar,
  Tag,
  ArrowLeft,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import CreditConsent from "@/components/studios/CreditConsent";

interface ADR {
  id: string;
  title: string;
  status: "proposed" | "accepted" | "deprecated" | "superseded";
  date: string;
  context: string;
  decision: string;
  consequences: string[];
  tags: string[];
}

export default function ADRPage() {
  const [adrs, setAdrs] = useState<ADR[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewADR, setShowNewADR] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [showCreditConsent, setShowCreditConsent] = useState(false);

  useEffect(() => {
    // Load ADRs from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dev-studio-adrs");
      if (saved) {
        try {
          setAdrs(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load ADRs", e);
        }
      }
    }
  }, []);

  const filteredADRs = adrs.filter(adr => {
    const matchesSearch = adr.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         adr.context.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || adr.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateADR = () => {
    setShowCreditConsent(true);
  };

  const handleConsent = () => {
    setShowCreditConsent(false);
    setShowNewADR(true);
  };

  const handleSaveADR = (adr: Omit<ADR, "id">) => {
    const newADR: ADR = {
      ...adr,
      id: crypto.randomUUID(),
    };
    const updated = [...adrs, newADR];
    setAdrs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-studio-adrs", JSON.stringify(updated));
    }
    setShowNewADR(false);
  };

  const handleDeleteADR = (id: string) => {
    const updated = adrs.filter(adr => adr.id !== id);
    setAdrs(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-studio-adrs", JSON.stringify(updated));
    }
  };

  const exportADRs = () => {
    const dataStr = JSON.stringify(adrs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "adrs.json";
    link.click();
  };

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading ADRs..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href="/dev-studio/enterprise"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                      aria-label="Back to Enterprise Features"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Architecture Decision Records</h1>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mt-2">
                    Document and track architectural decisions
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={exportADRs}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={handleCreateADR}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New ADR
                  </button>
                </div>
              </div>
            </header>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search ADRs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="proposed">Proposed</option>
                <option value="accepted">Accepted</option>
                <option value="deprecated">Deprecated</option>
                <option value="superseded">Superseded</option>
              </select>
            </div>

            {/* Credit Consent */}
            {showCreditConsent && (
              <div className="mb-6">
                <CreditConsent
                  creditsRequired={50}
                  operation="Create Architecture Decision Record"
                  onConsent={handleConsent}
                  onCancel={() => setShowCreditConsent(false)}
                />
              </div>
            )}

            {/* ADR List */}
            <div className="space-y-4">
              {filteredADRs.length === 0 ? (
                <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No ADRs Found</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {searchQuery || selectedStatus !== "all" 
                      ? "Try adjusting your filters"
                      : "Create your first Architecture Decision Record to get started"}
                  </p>
                  {!searchQuery && selectedStatus === "all" && (
                    <button
                      onClick={handleCreateADR}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create ADR
                    </button>
                  )}
                </div>
              ) : (
                filteredADRs.map((adr) => (
                  <div
                    key={adr.id}
                    className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900">{adr.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            adr.status === "accepted" ? "bg-green-100 text-green-700" :
                            adr.status === "proposed" ? "bg-blue-100 text-blue-700" :
                            adr.status === "deprecated" ? "bg-red-100 text-red-700" :
                            "bg-amber-100 text-amber-700"
                          }`}>
                            {adr.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {adr.date}
                          </div>
                          {adr.tags.map((tag, idx) => (
                            <span key={idx} className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDeleteADR(adr.id)}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                          aria-label="Delete ADR"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Context</h4>
                        <p className="text-sm text-slate-700">{adr.context}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 mb-1">Decision</h4>
                        <p className="text-sm text-slate-700">{adr.decision}</p>
                      </div>
                      {adr.consequences.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-1">Consequences</h4>
                          <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                            {adr.consequences.map((consequence, idx) => (
                              <li key={idx}>{consequence}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* New ADR Form Modal */}
            {showNewADR && (
              <NewADRForm
                onSave={handleSaveADR}
                onCancel={() => setShowNewADR(false)}
              />
            )}
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

function NewADRForm({ onSave, onCancel }: { onSave: (adr: Omit<ADR, "id">) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    status: "proposed" as ADR["status"],
    date: new Date().toISOString().split("T")[0],
    context: "",
    decision: "",
    consequences: [""],
    tags: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      consequences: formData.consequences.filter(c => c.trim() !== "")
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">New Architecture Decision Record</h2>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ADR["status"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="proposed">Proposed</option>
                <option value="accepted">Accepted</option>
                <option value="deprecated">Deprecated</option>
                <option value="superseded">Superseded</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Context</label>
            <textarea
              required
              rows={4}
              value={formData.context}
              onChange={(e) => setFormData({ ...formData, context: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the context and problem that requires a decision..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Decision</label>
            <textarea
              required
              rows={4}
              value={formData.decision}
              onChange={(e) => setFormData({ ...formData, decision: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe the decision that was made..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Consequences</label>
            {formData.consequences.map((consequence, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={consequence}
                  onChange={(e) => {
                    const newConsequences = [...formData.consequences];
                    newConsequences[idx] = e.target.value;
                    setFormData({ ...formData, consequences: newConsequences });
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Consequence..."
                />
                {formData.consequences.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newConsequences = formData.consequences.filter((_, i) => i !== idx);
                      setFormData({ ...formData, consequences: newConsequences });
                    }}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => setFormData({ ...formData, consequences: [...formData.consequences, ""] })}
              className="text-sm text-blue-600 hover:text-blue-700 font-semibold"
            >
              + Add Consequence
            </button>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              Save ADR
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

