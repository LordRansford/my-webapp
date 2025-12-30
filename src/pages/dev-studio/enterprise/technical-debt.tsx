"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  TrendingDown, 
  Plus, 
  Search,
  AlertTriangle,
  ArrowLeft,
  Filter,
  BarChart3
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import CreditConsent from "@/components/studios/CreditConsent";

interface TechnicalDebt {
  id: string;
  title: string;
  description: string;
  category: "code" | "architecture" | "documentation" | "testing" | "security" | "performance";
  severity: "low" | "medium" | "high" | "critical";
  effort: number; // in story points
  impact: number; // 1-10 scale
  priority: number; // calculated: impact * severity
  status: "identified" | "planned" | "in-progress" | "resolved";
  createdAt: string;
}

export default function TechnicalDebtPage() {
  const [debtItems, setDebtItems] = useState<TechnicalDebt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showNewDebt, setShowNewDebt] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");
  const [showCreditConsent, setShowCreditConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dev-studio-technical-debt");
      if (saved) {
        try {
          setDebtItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load technical debt", e);
        }
      }
    }
  }, []);

  const calculatePriority = (severity: TechnicalDebt["severity"], impact: number): number => {
    const severityWeight = {
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };
    return severityWeight[severity] * impact;
  };

  const filteredDebt = debtItems
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSeverity = selectedSeverity === "all" || item.severity === selectedSeverity;
      return matchesSearch && matchesCategory && matchesSeverity;
    })
    .sort((a, b) => b.priority - a.priority);

  const totalDebt = debtItems.reduce((sum, item) => sum + item.effort, 0);
  const criticalDebt = debtItems.filter(item => item.severity === "critical").length;
  const resolvedDebt = debtItems.filter(item => item.status === "resolved").length;

  const handleCreateDebt = () => {
    setShowCreditConsent(true);
  };

  const handleConsent = () => {
    setShowCreditConsent(false);
    setShowNewDebt(true);
  };

  const handleSaveDebt = (debt: Omit<TechnicalDebt, "id" | "priority" | "createdAt">) => {
    const priority = calculatePriority(debt.severity, debt.impact);
    const newDebt: TechnicalDebt = {
      ...debt,
      id: crypto.randomUUID(),
      priority,
      createdAt: new Date().toISOString()
    };
    const updated = [...debtItems, newDebt];
    setDebtItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-studio-technical-debt", JSON.stringify(updated));
    }
    setShowNewDebt(false);
  };

  const handleUpdateStatus = (id: string, status: TechnicalDebt["status"]) => {
    const updated = debtItems.map(item => 
      item.id === id ? { ...item, status } : item
    );
    setDebtItems(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("dev-studio-technical-debt", JSON.stringify(updated));
    }
  };

  const severityColors = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700"
  };

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Technical Debt..." />
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Technical Debt Tracker</h1>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mt-2">
                    Quantify and prioritize technical debt
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreateDebt}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-semibold text-white transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    New Debt Item
                  </button>
                </div>
              </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Total Debt</div>
                <div className="text-2xl font-bold text-slate-900">{totalDebt} SP</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Critical Items</div>
                <div className="text-2xl font-bold text-red-600">{criticalDebt}</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Resolved</div>
                <div className="text-2xl font-bold text-green-600">{resolvedDebt}</div>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-4">
                <div className="text-sm text-slate-600 mb-1">Total Items</div>
                <div className="text-2xl font-bold text-slate-900">{debtItems.length}</div>
              </div>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search technical debt..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="code">Code</option>
                <option value="architecture">Architecture</option>
                <option value="documentation">Documentation</option>
                <option value="testing">Testing</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
              </select>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Credit Consent */}
            {showCreditConsent && (
              <div className="mb-6">
                <CreditConsent
                  creditsRequired={75}
                  operation="Create Technical Debt Item"
                  onConsent={handleConsent}
                  onCancel={() => setShowCreditConsent(false)}
                />
              </div>
            )}

            {/* Debt List */}
            <div className="space-y-4">
              {filteredDebt.length === 0 ? (
                <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center">
                  <TrendingDown className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Technical Debt Found</h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {searchQuery || selectedCategory !== "all" || selectedSeverity !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first technical debt item to get started"}
                  </p>
                  {!searchQuery && selectedCategory === "all" && selectedSeverity === "all" && (
                    <button
                      onClick={handleCreateDebt}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-semibold text-white transition-colors inline-flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Debt Item
                    </button>
                  )}
                </div>
              ) : (
                filteredDebt.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${severityColors[item.severity]}`}>
                            {item.severity}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mb-3">{item.description}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span>Effort: {item.effort} SP</span>
                          <span>Impact: {item.impact}/10</span>
                          <span>Priority: {item.priority}</span>
                        </div>
                      </div>
                      <select
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value as TechnicalDebt["status"])}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                      >
                        <option value="identified">Identified</option>
                        <option value="planned">Planned</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* New Debt Form Modal */}
            {showNewDebt && (
              <NewDebtForm
                onSave={handleSaveDebt}
                onCancel={() => setShowNewDebt(false)}
              />
            )}
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

function NewDebtForm({ onSave, onCancel }: { onSave: (debt: Omit<TechnicalDebt, "id" | "priority" | "createdAt">) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "code" as TechnicalDebt["category"],
    severity: "medium" as TechnicalDebt["severity"],
    effort: 1,
    impact: 5,
    status: "identified" as TechnicalDebt["status"]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">New Technical Debt Item</h2>
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">Description</label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as TechnicalDebt["category"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="code">Code</option>
                <option value="architecture">Architecture</option>
                <option value="documentation">Documentation</option>
                <option value="testing">Testing</option>
                <option value="security">Security</option>
                <option value="performance">Performance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Severity</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as TechnicalDebt["severity"] })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Effort (Story Points)</label>
              <input
                type="number"
                min="1"
                required
                value={formData.effort}
                onChange={(e) => setFormData({ ...formData, effort: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Impact (1-10)</label>
              <input
                type="number"
                min="1"
                max="10"
                required
                value={formData.impact}
                onChange={(e) => setFormData({ ...formData, impact: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-semibold text-white transition-colors"
            >
              Save Debt Item
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

