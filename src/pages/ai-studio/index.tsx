"use client";

/**
 * AI Studio Main Dashboard
 * 
 * Central hub for all AI Studio features
 */

import React, { useState } from "react";
import Link from "next/link";
import AIStudioErrorBoundary from "@/components/ai-studio/AIStudioErrorBoundary";
import {
  Sparkles,
  Database,
  Layers,
  Zap,
  TrendingUp,
  Shield,
  Play,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";
import BrowserTrainingPOC from "@/components/ai-studio/poc/BrowserTrainingPOC";
import DataValidationPOC from "@/components/ai-studio/poc/DataValidationPOC";
import ModelBuilderPOC from "@/components/ai-studio/poc/ModelBuilderPOC";
import AgentOrchestratorPOC from "@/components/ai-studio/poc/AgentOrchestratorPOC";
import DatasetExplorer from "@/components/ai-studio/DatasetExplorer";
import TrainingJobMonitor from "@/components/ai-studio/TrainingJobMonitor";

type ViewMode = "dashboard" | "training" | "validation" | "builder" | "orchestrator" | "datasets" | "jobs";

export default function AIStudioPage() {
  const [activeView, setActiveView] = useState<ViewMode>("dashboard");
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const quickStats = [
    { label: "Models", value: "12", icon: Layers, color: "blue" },
    { label: "Datasets", value: "8", icon: Database, color: "green" },
    { label: "Training Jobs", value: "3", icon: Play, color: "purple" },
    { label: "Agents", value: "5", icon: Zap, color: "amber" },
  ];

  const recentActivity = [
    { type: "training", message: "Purchase Predictor training completed", time: "2 hours ago" },
    { type: "validation", message: "Customer Data validated successfully", time: "5 hours ago" },
    { type: "deployment", message: "Sentiment Analyzer deployed to production", time: "1 day ago" },
  ];

  const renderContent = () => {
    switch (activeView) {
      case "training":
        return <BrowserTrainingPOC />;
      case "validation":
        return <DataValidationPOC />;
      case "builder":
        return <ModelBuilderPOC />;
      case "orchestrator":
        return <AgentOrchestratorPOC />;
      case "datasets":
        return selectedDataset ? (
          <DatasetExplorer
            dataset={{
              id: selectedDataset,
              name: "Sample Dataset",
              type: "csv",
              size: 1048576,
              rows: 10000,
              columns: 15,
              license: "user-owned",
              status: "verified",
              qualityScore: 0.95,
            }}
            onSelect={setSelectedDataset}
          />
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a dataset to explore</p>
          </div>
        );
      case "jobs":
        return selectedJob ? (
          <TrainingJobMonitor jobId={selectedJob} onCancel={() => setSelectedJob(null)} />
        ) : (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
            <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a training job to monitor</p>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickStats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                        <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveView("training")}
                className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-blue-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Train Model</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Train a neural network in your browser or on backend compute
                </p>
              </button>

              <button
                onClick={() => setActiveView("builder")}
                className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-purple-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Layers className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Build Model</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Create model architectures with visual drag-and-drop builder
                </p>
              </button>

              <button
                onClick={() => setActiveView("validation")}
                className="p-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-green-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Validate Data</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Check datasets for legal compliance and quality
                </p>
              </button>

              <button
                onClick={() => setActiveView("orchestrator")}
                className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-amber-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Orchestrate Agents</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Build and execute multi-agent workflows
                </p>
              </button>

              <button
                onClick={() => setActiveView("datasets")}
                className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-slate-500 rounded-xl group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Explore Datasets</h3>
                </div>
                <p className="text-sm text-slate-700">
                  View dataset schemas, statistics, and previews
                </p>
              </button>

              <button
                onClick={() => setActiveView("jobs")}
                className="p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-2xl hover:shadow-md transition-all text-left group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-indigo-500 rounded-xl group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Monitor Jobs</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Track training progress and metrics in real-time
                </p>
              </button>
            </div>

            {/* Recent Activity */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-primary-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                      <p className="text-xs text-slate-600">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Documentation Link */}
            <div className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 rounded-2xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary-500 rounded-xl">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Explore Documentation
                  </h3>
                  <p className="text-sm text-slate-700 mb-4">
                    Comprehensive guides, API documentation, and best practices for building AI
                    systems.
                  </p>
                  <Link
                    href="/docs/development/ai-studio-expanded-plan.md"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm"
                  >
                    View Documentation
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">AI Studio</h1>
                  <p className="text-lg text-slate-600 mt-1">
                    Build, train, deploy, and orchestrate AI systems
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/ai-studio/poc-showcase"
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-sm"
                >
                  POC Showcase
                </Link>
                <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        {activeView !== "dashboard" && (
          <div className="mb-6">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setActiveView("dashboard")}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Dashboard
              </button>
              <span className="text-slate-300">/</span>
              <span className="px-4 py-2 text-slate-900 font-medium capitalize">{activeView}</span>
            </nav>
          </div>
        )}

        {/* Content */}
        <main>
          <AIStudioErrorBoundary>{renderContent()}</AIStudioErrorBoundary>
        </main>
      </div>
    </div>
  );
}

