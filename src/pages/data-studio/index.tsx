"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Database, 
  GitBranch, 
  BarChart3,
  Shield,
  Network,
  FileText,
  TrendingUp,
  Layers,
  Eye
} from "lucide-react";
import StudioNavigation from "@/components/studios/StudioNavigation";
import StudioPageHeader from "@/components/studios/StudioPageHeader";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { getAudienceProfile, getDefaultAudience } from "@/lib/studios/audiences";
import HelpTooltip from "@/components/studios/HelpTooltip";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";
import OnboardingFlow from "@/components/studios/OnboardingFlow";
import { dataStudioOnboardingSteps } from "@/lib/studios/onboarding/data-studio-onboarding";

const tools = [
  {
    id: "pipeline-designer",
    name: "Data Pipeline Designer",
    description: "Visual ETL/ELT pipeline builder",
    icon: <GitBranch className="w-6 h-6" />,
    href: "/data-studio/pipelines",
    color: "amber",
    credits: 83
  },
  {
    id: "quality-monitor",
    name: "Data Quality Monitor",
    description: "Automated data quality checks and alerts",
    icon: <Eye className="w-6 h-6" />,
    href: "/data-studio/quality",
    color: "emerald",
    credits: 42
  },
  {
    id: "catalog-builder",
    name: "Data Catalog Builder",
    description: "Automated metadata cataloging",
    icon: <Database className="w-6 h-6" />,
    href: "/data-studio/catalog",
    color: "blue",
    credits: 360
  },
  {
    id: "dashboard-builder",
    name: "Analytics Dashboard Builder",
    description: "Drag-and-drop dashboard creation",
    icon: <BarChart3 className="w-6 h-6" />,
    href: "/data-studio/dashboards",
    color: "purple",
    credits: 200
  },
  {
    id: "privacy-assessor",
    name: "Data Privacy Impact Assessor",
    description: "GDPR, CCPA compliance checker",
    icon: <Shield className="w-6 h-6" />,
    href: "/data-studio/privacy",
    color: "rose",
    credits: 150
  },
  {
    id: "lineage-tracker",
    name: "Data Lineage Tracker",
    description: "Automated lineage discovery and visualization",
    icon: <Network className="w-6 h-6" />,
    href: "/data-studio/lineage",
    color: "indigo",
    credits: 180
  },
  {
    id: "schema-designer",
    name: "Schema Designer",
    description: "Visual database schema design with validation",
    icon: <Layers className="w-6 h-6" />,
    href: "/data-studio/schema",
    color: "sky",
    credits: 52
  },
  {
    id: "governance",
    name: "Data Governance Framework",
    description: "Policy management and enforcement",
    icon: <FileText className="w-6 h-6" />,
    href: "/data-studio/governance",
    color: "slate",
    credits: 100
  }
];

export default function DataStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [audience, setAudience] = useState<"enterprise" | "professional" | "student" | "child">("professional");
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      setAudience(getDefaultAudience());
      setIsLoading(false);
    }
  }, []);
  
  const profile = getAudienceProfile(audience);

  useEffect(() => {
    if (!isLoading) {
      auditLogger.log(AuditActions.TOOL_OPENED, "data-studio", { page: "dashboard" });
    }
  }, [isLoading]);

  return (
    <SecureErrorBoundary studio="data-studio">
      <OnboardingFlow
        flowId="data-studio"
        steps={dataStudioOnboardingSteps}
        showProgress={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Data Studio..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <StudioPageHeader
              studioType="data"
              title="Data Studio"
              description="Production-ready tools for data pipelines, quality, and governance. Design data pipelines, monitor data quality, build catalogs, create dashboards, and ensure data privacy compliance."
              learnHref="/data-studios"
              liveHref="/data-studio"
              icon={<Database className="w-6 h-6" />}
              color="amber"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <GitBranch className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-700">Pipelines</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">Active pipelines</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Eye className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Quality Score</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">--</p>
                <p className="text-xs text-slate-600 mt-1">Average quality</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-700">Datasets</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">In catalog</p>
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8 rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Database className="w-8 h-8 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">What is Data Studio?</h2>
                  <p className="text-sm text-slate-700 mb-3">
                    Data Studio is your workspace for building data pipelines, monitoring data quality, and ensuring 
                    data governance. Here you can design pipelines, build catalogs, create dashboards, and ensure 
                    your data meets privacy and compliance requirements.
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>New to data engineering?</strong> Start with the{" "}
                    <Link href="/data-studios" className="text-amber-600 hover:underline font-semibold">
                      learning studio
                    </Link>
                    {" "}to understand data concepts first. Each tool below has a help icon (?) you can click to learn more.
                  </p>
                </div>
              </div>
            </section>

            {/* Tools Grid */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Data Tools</h2>
                <HelpTooltip
                  title="Data Tools"
                  content={
                    <div className="space-y-4">
                      <p>
                        These tools help you work with data. Each tool has a specific purpose:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        <li><strong>Pipeline Designer:</strong> Creates workflows to process data step by step</li>
                        <li><strong>Quality Monitor:</strong> Checks data for problems and alerts you</li>
                        <li><strong>Catalog Builder:</strong> Organises information about your data</li>
                        <li><strong>Dashboard Builder:</strong> Creates visual charts and graphs from data</li>
                        <li><strong>Privacy Assessor:</strong> Checks if data handling meets privacy rules</li>
                        <li><strong>Lineage Tracker:</strong> Shows where data comes from and where it goes</li>
                        <li><strong>Schema Designer:</strong> Plans how data is organised in databases</li>
                        <li><strong>Governance Framework:</strong> Manages data rules and policies</li>
                      </ul>
                    </div>
                  }
                  examples={[
                    "Start with Pipeline Designer to create a data processing workflow",
                    "Use Quality Monitor to check if your data has any problems",
                    "Use Catalog Builder to organise information about your datasets"
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tools.map((tool) => {
                  const colorClasses = {
                    amber: "from-amber-500 to-amber-600",
                    emerald: "from-emerald-500 to-emerald-600",
                    blue: "from-blue-500 to-blue-600",
                    purple: "from-purple-500 to-purple-600",
                    rose: "from-rose-500 to-rose-600",
                    indigo: "from-indigo-500 to-indigo-600",
                    sky: "from-sky-500 to-sky-600",
                    slate: "from-slate-500 to-slate-600"
                  };

                  const toolExplanations: Record<string, { whatItDoes: string; whyItMatters: string; howToUse: string[] }> = {
                    "pipeline-designer": {
                      whatItDoes: "Helps you create data pipelines that process information step by step. A pipeline is like a factory assembly line where data moves through different stages.",
                      whyItMatters: "Pipelines automate data processing, saving time and reducing errors. Instead of manually processing data each time, the pipeline does it automatically.",
                      howToUse: [
                        "Design the steps your data needs to go through",
                        "Connect the steps in order",
                        "Test the pipeline with sample data",
                        "Run the pipeline to process your data"
                      ]
                    },
                    "quality-monitor": {
                      whatItDoes: "Automatically checks your data for problems like missing values, duplicates, or incorrect formats. It alerts you when problems are found.",
                      whyItMatters: "Good data quality ensures your analyses and decisions are based on accurate information. Bad data leads to bad decisions.",
                      howToUse: [
                        "Set up quality checks for your data",
                        "The monitor runs checks automatically",
                        "Review alerts when problems are found",
                        "Fix problems and verify the fixes"
                      ]
                    },
                    "catalog-builder": {
                      whatItDoes: "Creates a catalog (like a library index) that organises information about your data. It helps you find and understand your data easily.",
                      whyItMatters: "A data catalog makes it easy to find and understand data. Without it, data can be hard to locate and use effectively.",
                      howToUse: [
                        "Add information about your datasets",
                        "Organise datasets into categories",
                        "Add descriptions and tags",
                        "Search and browse the catalog"
                      ]
                    },
                    "dashboard-builder": {
                      whatItDoes: "Helps you create visual dashboards with charts and graphs to understand your data. Dashboards show data in an easy-to-understand visual format.",
                      whyItMatters: "Visual dashboards make it easy to understand data at a glance. They help you spot trends and make decisions quickly.",
                      howToUse: [
                        "Choose what data to display",
                        "Select chart types (bar charts, line graphs, etc.)",
                        "Arrange charts on the dashboard",
                        "Share the dashboard with others"
                      ]
                    },
                    "privacy-assessor": {
                      whatItDoes: "Checks if your data handling meets privacy rules like GDPR (General Data Protection Regulation) or CCPA (California Consumer Privacy Act).",
                      whyItMatters: "Following privacy rules protects user data and prevents legal problems. It ensures you are handling personal information correctly.",
                      howToUse: [
                        "Select which privacy rules you need to follow",
                        "The assessor checks your data handling",
                        "Review any problems it finds",
                        "Fix the problems and run the assessment again"
                      ]
                    },
                    "lineage-tracker": {
                      whatItDoes: "Shows where your data comes from and where it goes. Data lineage is like a family tree, but for data instead of people.",
                      whyItMatters: "Understanding data lineage helps you trace problems back to their source and ensures data is used correctly throughout your systems.",
                      howToUse: [
                        "The tracker automatically discovers data connections",
                        "View the lineage map to see data flow",
                        "Trace data back to its source",
                        "See where data is used downstream"
                      ]
                    },
                    "schema-designer": {
                      whatItDoes: "Helps you plan how data is organised in a database. A schema is like a blueprint that defines the structure of your data.",
                      whyItMatters: "A well-designed schema makes it easy to store and find data. It is like organising a library so books are easy to find.",
                      howToUse: [
                        "Design tables to organise your data",
                        "Define fields (columns) for each table",
                        "Set up relationships between tables",
                        "Generate code to create the database structure"
                      ]
                    },
                    "governance": {
                      whatItDoes: "Manages data rules and policies. Data governance ensures data is used correctly and follows organisational rules.",
                      whyItMatters: "Good data governance ensures data is accurate, secure, and used appropriately. It helps organisations make better decisions.",
                      howToUse: [
                        "Define data policies and rules",
                        "Assign data owners and stewards",
                        "Monitor compliance with policies",
                        "Update policies as needed"
                      ]
                    }
                  };

                  const explanation = toolExplanations[tool.id] || {
                    whatItDoes: tool.description,
                    whyItMatters: "This tool helps you work with data more effectively.",
                    howToUse: ["Click 'Open' to start using this tool"]
                  };

                  return (
                    <div key={tool.id} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[tool.color as keyof typeof colorClasses]} text-white`}>
                          {tool.icon}
                        </div>
                        <HelpTooltip
                          title={tool.name}
                          content={
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">What is this?</h3>
                                <p className="text-sm text-slate-700">{tool.description}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">What does it do?</h3>
                                <p className="text-sm text-slate-700">{explanation.whatItDoes}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">Why does this matter?</h3>
                                <p className="text-sm text-slate-700">{explanation.whyItMatters}</p>
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-900 mb-2">How do I use it?</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
                                  {explanation.howToUse.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            </div>
                          }
                          examples={[
                            `Use ${tool.name} to ${tool.description.toLowerCase()}`,
                            `Click 'Open' to start using ${tool.name}`
                          ]}
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{tool.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{tool.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                          ~{tool.credits} credits
                        </span>
                      </div>
                      <Link
                        href={tool.href}
                        onClick={() => auditLogger.log(AuditActions.TOOL_OPENED, "data-studio", { tool: tool.id })}
                        className="block w-full text-center px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                        aria-label={`Open ${tool.name}: ${tool.description}`}
                      >
                        Open {tool.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Getting Started */}
            <section className="rounded-3xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Getting Started</h2>
              <p className="text-sm text-slate-700 mb-6">
                Follow these steps to work with data effectively. Each step builds on the previous one, 
                so it is best to do them in order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Design Pipelines</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Use the Pipeline Designer to create data processing workflows. A pipeline processes 
                    data step by step, like a factory assembly line.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Create a pipeline that reads customer data from a CSV file, 
                    cleans it (removes duplicates), and loads it into a database.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Monitor Quality</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Set up quality checks to automatically find problems in your data, like missing values 
                    or incorrect formats. The monitor alerts you when problems are found.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Set up a check to find missing email addresses in customer data. 
                    The monitor alerts you when missing emails are found.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-amber-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Build Dashboards</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Create visual dashboards with charts and graphs to understand your data. Dashboards 
                    make it easy to see trends and make decisions.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Create a dashboard showing sales over time with a line graph, 
                    and top products with a bar chart.
                  </p>
                </div>
              </div>
            </section>

            {/* Learn More */}
            <section className="mt-8 rounded-3xl bg-gradient-to-br from-slate-50 to-amber-50 border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Need More Help?</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>New to data engineering?</strong> Start with the{" "}
                  <Link href="/data-studios" className="font-semibold text-amber-600 hover:underline">
                    learning studio
                  </Link>
                  {" "}to understand data fundamentals before building real data systems.
                </p>
                <p>
                  <strong>Not sure what a tool does?</strong> Click the help icon (?) next to any tool or feature 
                  to see detailed explanations, examples, and step-by-step instructions.
                </p>
                <p>
                  <strong>Want to see examples?</strong> Each tool includes example templates you can load and 
                  customise. This helps you understand how to use the tool effectively.
                </p>
                <p>
                  <strong>Stuck on something?</strong> Use the contextual help button (?) throughout the studio 
                  for guidance on specific features and concepts.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

