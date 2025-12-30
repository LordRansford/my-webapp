"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  BookOpen, 
  Layers, 
  FileText,
  CheckCircle2,
  ArrowRight,
  Code,
  Image,
  Download
} from "lucide-react";
import StudioNavigation from "@/components/studios/StudioNavigation";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import ReadyToBuildCTA from "@/components/ai-studio/ReadyToBuildCTA";

const diagramPatterns = [
  {
    id: "c4",
    name: "C4 Model",
    description: "Context, Container, Component, and Code diagrams",
    useCase: "System architecture documentation",
    icon: <Layers className="w-6 h-6" />
  },
  {
    id: "uml",
    name: "UML",
    description: "Unified Modeling Language diagrams",
    useCase: "Software design and documentation",
    icon: <Code className="w-6 h-6" />
  },
  {
    id: "archimate",
    name: "Archimate",
    description: "Enterprise architecture modeling",
    useCase: "Enterprise architecture documentation",
    icon: <FileText className="w-6 h-6" />
  },
  {
    id: "mermaid",
    name: "Mermaid",
    description: "Text-based diagram generation",
    useCase: "Quick documentation and markdown",
    icon: <Image className="w-6 h-6" />
  }
];

const tutorials = [
  {
    id: "getting-started",
    title: "Getting Started with Architecture Diagrams",
    description: "Learn the basics of creating effective architecture diagrams",
    steps: [
      "Understand your audience",
      "Choose the right level of detail",
      "Use consistent notation",
      "Keep it simple and clear"
    ]
  },
  {
    id: "best-practices",
    title: "Best Practices",
    description: "Follow these guidelines for professional diagrams",
    steps: [
      "Use standard notation where possible",
      "Include legends and explanations",
      "Version control your diagrams",
      "Keep diagrams up to date"
    ]
  },
  {
    id: "common-mistakes",
    title: "Common Mistakes to Avoid",
    description: "Learn from common pitfalls",
    steps: [
      "Too much detail in one diagram",
      "Inconsistent notation",
      "Missing context or boundaries",
      "Outdated diagrams"
    ]
  }
];

export default function ArchitectureDiagramStudioLearnPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SecureErrorBoundary studio="architecture-diagram-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Architecture Diagram Studio..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">Architecture Diagram Studio - Learn</h1>
                  <p className="text-lg text-slate-600 mt-2">
                    Learn how to create professional architecture diagrams
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StudioNavigation studioType="architecture" showHub={true} />
                </div>
              </div>
            </header>

            {/* Diagram Patterns */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Diagram Patterns</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {diagramPatterns.map((pattern) => (
                  <div
                    key={pattern.id}
                    className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-white mb-4">
                      {pattern.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{pattern.name}</h3>
                    <p className="text-sm text-slate-600 mb-3">{pattern.description}</p>
                    <p className="text-xs text-slate-500">Use case: {pattern.useCase}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tutorials */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Tutorials</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tutorials.map((tutorial) => (
                  <div
                    key={tutorial.id}
                    className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                      <h3 className="text-lg font-semibold text-slate-900">{tutorial.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-4">{tutorial.description}</p>
                    <ul className="space-y-2">
                      {tutorial.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* Export Formats */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Export Formats</h2>
              <div className="rounded-3xl bg-white border border-slate-200 p-8">
                <p className="text-sm text-slate-700 mb-6">
                  Architecture diagrams can be exported in multiple formats for different use cases:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["PNG", "SVG", "PDF", "Markdown", "JSON", "PlantUML", "Mermaid", "OpenAPI"].map((format) => (
                    <div
                      key={format}
                      className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-900">{format}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Ready to Build */}
            <ReadyToBuildCTA 
              studioName="Architecture Diagram Studio"
              buildHref="/studios/architecture-diagram-studio"
              description="Ready to create diagrams? Try the live Architecture Diagram Studio with advanced features."
            />

            {/* Quick Links */}
            <section className="mt-8 text-center">
              <Link
                href="/studios/architecture-diagram-studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Open Live Studio
                <ArrowRight className="w-5 h-5" />
              </Link>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}


