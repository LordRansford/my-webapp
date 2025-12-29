 "use client";

/**
 * AI Studio POC Showcase Page
 * 
 * This page demonstrates all proof-of-concept components for the AI Studio upgrade.
 */

import React, { useState } from "react";
import AIStudioErrorBoundary from "@/components/ai-studio/AIStudioErrorBoundary";
import BrowserTrainingPOC from "@/components/ai-studio/poc/BrowserTrainingPOC";
import DataValidationPOC from "@/components/ai-studio/poc/DataValidationPOC";
import ModelBuilderPOC from "@/components/ai-studio/poc/ModelBuilderPOC";
import AgentOrchestratorPOC from "@/components/ai-studio/poc/AgentOrchestratorPOC";
import { Sparkles, Shield, Layers, Zap } from "lucide-react";

type POCType = "training" | "validation" | "builder" | "orchestrator";

export default function AISStudioPOCShowcase() {
  const [activePOC, setActivePOC] = useState<POCType>("training");

  const pocs = [
    {
      id: "training" as POCType,
      title: "Browser Training",
      description: "Train neural networks directly in your browser",
      icon: Sparkles,
      color: "blue",
    },
    {
      id: "validation" as POCType,
      title: "Data Validation",
      description: "Legal compliance and quality checking",
      icon: Shield,
      color: "green",
    },
    {
      id: "builder" as POCType,
      title: "Model Builder",
      description: "Visual drag-and-drop model architecture builder",
      icon: Layers,
      color: "purple",
    },
    {
      id: "orchestrator" as POCType,
      title: "Agent Orchestrator",
      description: "Build and execute multi-agent workflows",
      icon: Zap,
      color: "amber",
    },
  ];

  const renderPOC = () => {
    switch (activePOC) {
      case "training":
        return <BrowserTrainingPOC />;
      case "validation":
        return <DataValidationPOC />;
      case "builder":
        return <ModelBuilderPOC />;
      case "orchestrator":
        return <AgentOrchestratorPOC />;
      default:
        return <BrowserTrainingPOC />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">AI Studio POC Showcase</h1>
                <p className="text-lg text-slate-600 mt-1">
                  Proof-of-concept implementations for the enterprise AI Studio upgrade
                </p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> These are proof-of-concept implementations demonstrating
                feasibility and architecture. Full production implementation will follow the
                comprehensive plan in the documentation.
              </p>
            </div>
          </div>
        </header>

        {/* POC Selector */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pocs.map((poc) => {
              const Icon = poc.icon;
              const isActive = activePOC === poc.id;
              return (
                <button
                  key={poc.id}
                  onClick={() => setActivePOC(poc.id)}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    isActive
                      ? "border-primary-500 bg-primary-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`p-3 rounded-xl ${
                        isActive
                          ? "bg-primary-500 text-white"
                          : `bg-${poc.color}-100 text-${poc.color}-600`
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{poc.title}</h3>
                  </div>
                  <p className="text-sm text-slate-600">{poc.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active POC Display */}
        <div className="mb-8">
          <AIStudioErrorBoundary>{renderPOC()}</AIStudioErrorBoundary>
        </div>

        {/* Documentation Link */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h3 className="font-semibold text-slate-900 mb-4">Documentation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/docs/development/ai-studio-expanded-plan.md"
              className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="font-medium text-slate-900">Expanded Plan</div>
              <div className="text-sm text-slate-600 mt-1">
                Complete implementation plan with all sections
              </div>
            </a>
            <a
              href="/docs/development/ai-studio-api-specification.md"
              className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="font-medium text-slate-900">API Specification</div>
              <div className="text-sm text-slate-600 mt-1">
                Complete REST, GraphQL, and WebSocket APIs
              </div>
            </a>
            <a
              href="/docs/development/ai-studio-database-schema.md"
              className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="font-medium text-slate-900">Database Schema</div>
              <div className="text-sm text-slate-600 mt-1">
                Complete PostgreSQL schema with indexes
              </div>
            </a>
            <a
              href="/docs/development/ai-studio-ui-ux-design.md"
              className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:shadow-md transition-all"
            >
              <div className="font-medium text-slate-900">UI/UX Design System</div>
              <div className="text-sm text-slate-600 mt-1">
                Complete design system and components
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

