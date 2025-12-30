"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  TrendingDown, 
  ShieldCheck, 
  Users,
  ArrowLeft,
  Plus,
  Search,
  Filter
} from "lucide-react";
import StudioNavigation from "@/components/studios/StudioNavigation";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";

const enterpriseTools = [
  {
    id: "adr",
    name: "Architecture Decision Records",
    description: "Track and document architectural decisions",
    icon: <FileText className="w-6 h-6" />,
    href: "/dev-studio/enterprise/adr",
    color: "blue",
    credits: 50
  },
  {
    id: "technical-debt",
    name: "Technical Debt Tracker",
    description: "Quantify and prioritize technical debt",
    icon: <TrendingDown className="w-6 h-6" />,
    href: "/dev-studio/enterprise/technical-debt",
    color: "amber",
    credits: 75
  },
  {
    id: "compliance",
    name: "Compliance Checker",
    description: "GDPR, SOC2, HIPAA compliance validation",
    icon: <ShieldCheck className="w-6 h-6" />,
    href: "/dev-studio/enterprise/compliance",
    color: "green",
    credits: 200
  },
  {
    id: "workspaces",
    name: "Team Workspaces",
    description: "Multi-user collaboration with roles",
    icon: <Users className="w-6 h-6" />,
    href: "/dev-studio/enterprise/workspaces",
    color: "purple",
    credits: 100
  }
];

export default function DevStudioEnterprisePage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Enterprise Features..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-6 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      href="/dev-studio"
                      className="text-slate-600 hover:text-slate-900 transition-colors"
                      aria-label="Back to Dev Studio"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Enterprise Features</h1>
                  </div>
                  <p className="text-base sm:text-lg text-slate-600 mt-2">
                    Advanced tools for enterprise teams and compliance
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StudioNavigation studioType="dev" showHub={true} />
                </div>
              </div>
            </header>

            {/* Enterprise Tools Grid */}
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {enterpriseTools.map((tool) => {
                  const colorClasses = {
                    blue: "from-blue-500 to-blue-600",
                    amber: "from-amber-500 to-amber-600",
                    green: "from-green-500 to-green-600",
                    purple: "from-purple-500 to-purple-600"
                  };

                  return (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="group rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      aria-label={`Open ${tool.name}: ${tool.description}`}
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[tool.color as keyof typeof colorClasses]} text-white mb-4 group-hover:scale-110 transition-transform`}>
                        {tool.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          ~{tool.credits} credits
                        </span>
                        <span className="text-sm font-semibold text-slate-700 group-hover:text-sky-600 transition-colors">
                          Open →
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Enterprise Benefits */}
            <section className="rounded-3xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Enterprise Benefits</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Team Collaboration</h3>
                  <p className="text-sm text-slate-700">
                    Work together with your team using shared workspaces, role-based access, and real-time collaboration.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Compliance & Governance</h3>
                  <p className="text-sm text-slate-700">
                    Ensure your projects meet GDPR, SOC2, HIPAA, and other compliance requirements with automated checks.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Decision Tracking</h3>
                  <p className="text-sm text-slate-700">
                    Document architectural decisions with ADRs and track technical debt to make informed choices.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Export & Integration</h3>
                  <p className="text-sm text-slate-700">
                    Export to PDF, Markdown, JSON, OpenAPI, Terraform, and integrate with your existing tools.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

