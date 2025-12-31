"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Code, 
  Rocket, 
  Database, 
  Layers,
  Zap,
  Settings,
  FileCode,
  GitBranch,
  Cloud,
  Shield,
  TrendingUp
} from "lucide-react";
import StudioNavigation from "@/components/studios/StudioNavigation";
import StudioPageHeader from "@/components/studios/StudioPageHeader";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { getAudienceProfile, getDefaultAudience } from "@/lib/studios/audiences";
import OnboardingFlow from "@/components/studios/OnboardingFlow";
import { devStudioOnboardingSteps } from "@/lib/studios/onboarding/dev-studio-onboarding";
import FeatureExplanation from "@/components/studios/FeatureExplanation";
import HelpTooltip from "@/components/studios/HelpTooltip";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

const tools = [
  {
    id: "project-builder",
    name: "Project Builder",
    description: "Visual project scaffolding with stack selection",
    icon: <Code className="w-6 h-6" />,
    href: "/dev-studio/projects",
    color: "sky",
    credits: 50
  },
  {
    id: "api-designer",
    name: "API Designer",
    description: "Design, test, and document APIs with OpenAPI export",
    icon: <FileCode className="w-6 h-6" />,
    href: "/dev-studio/api-designer",
    color: "blue",
    credits: 75
  },
  {
    id: "schema-designer",
    name: "Database Schema Designer",
    description: "Visual schema builder with migration generation",
    icon: <Database className="w-6 h-6" />,
    href: "/dev-studio/schema-designer",
    color: "indigo",
    credits: 52
  },
  {
    id: "cicd-builder",
    name: "CI/CD Pipeline Builder",
    description: "Visual pipeline designer with GitHub Actions export",
    icon: <GitBranch className="w-6 h-6" />,
    href: "/dev-studio/cicd",
    color: "purple",
    credits: 83
  },
  {
    id: "deployment",
    name: "Deployment Wizard",
    description: "Multi-cloud deployment (Vercel, AWS, GCP, Azure)",
    icon: <Cloud className="w-6 h-6" />,
    href: "/dev-studio/deployment",
    color: "emerald",
    credits: 270
  },
  {
    id: "security",
    name: "Security Scanner",
    description: "Automated security checklist and vulnerability scanning",
    icon: <Shield className="w-6 h-6" />,
    href: "/dev-studio/security",
    color: "rose",
    credits: 550
  },
  {
    id: "performance",
    name: "Performance Profiler",
    description: "Load testing and performance analysis",
    icon: <TrendingUp className="w-6 h-6" />,
    href: "/dev-studio/performance",
    color: "amber",
    credits: 400
  },
  {
    id: "cost-calculator",
    name: "Cost Calculator",
    description: "Real-time infrastructure cost estimation",
    icon: <Zap className="w-6 h-6" />,
    href: "/dev-studio/cost",
    color: "yellow",
    credits: 10
  }
];

export default function DevStudioPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [audience, setAudience] = useState<"enterprise" | "professional" | "student" | "child">("professional");
  
  useEffect(() => {
    // Always set loading to false after mount, even if there's an error
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    if (typeof window !== "undefined") {
      try {
        setAudience(getDefaultAudience());
        setIsLoading(false);
        clearTimeout(timer);
      } catch (error) {
        console.error("Error loading audience profile:", error);
        setIsLoading(false);
        clearTimeout(timer);
      }
    } else {
      clearTimeout(timer);
      setIsLoading(false);
    }
    
    return () => clearTimeout(timer);
  }, []);
  
  const profile = getAudienceProfile(audience);

  useEffect(() => {
    if (!isLoading) {
      auditLogger.log(AuditActions.TOOL_OPENED, "dev-studio", { page: "dashboard" });
    }
  }, [isLoading]);

  return (
    <SecureErrorBoundary studio="dev-studio">
      <OnboardingFlow
        flowId="dev-studio"
        steps={devStudioOnboardingSteps}
        showProgress={true}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Dev Studio..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <StudioPageHeader
              studioType="dev"
              title="Dev Studio"
              description="Production-ready tools for building real software systems. Create projects, design APIs and databases, set up automated testing and deployment, and deploy to cloud platforms."
              learnHref="/dev-studios"
              liveHref="/dev-studio"
              icon={<Code className="w-6 h-6" />}
              color="sky"
            />

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Code className="w-5 h-5 text-sky-600" />
                  <span className="text-sm font-semibold text-slate-700">Projects</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">Active projects</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-semibold text-slate-700">Deployments</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">Successful deployments</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-semibold text-slate-700">Credits Used</span>
                </div>
                <p className="text-3xl font-bold text-slate-900">0</p>
                <p className="text-xs text-slate-600 mt-1">This month</p>
              </div>
            </div>

            {/* Introduction */}
            <section className="mb-8 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Code className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">What is Dev Studio?</h2>
                  <p className="text-sm text-slate-700 mb-3">
                    Dev Studio is your workspace for building real software applications. Here you can create projects, 
                    design systems, and deploy them to cloud platforms like Vercel, AWS, Google Cloud, or Microsoft Azure.
                  </p>
                  <p className="text-sm text-slate-700">
                    <strong>New to software development?</strong> Start with the{" "}
                    <Link href="/dev-studios" className="text-blue-600 hover:underline font-semibold">
                      learning studio
                    </Link>
                    {" "}to understand the concepts first. Each tool below has a help icon (?) you can click to learn more.
                  </p>
                </div>
              </div>
            </section>

            {/* Tools Grid */}
            <section className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Development Tools</h2>
                <HelpTooltip
                  title="Development Tools"
                  content={
                    <div className="space-y-4">
                      <p>
                        These tools help you build software applications. Each tool has a specific purpose:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-sm text-slate-700">
                        <li><strong>Project Builder:</strong> Creates the starting structure for new projects</li>
                        <li><strong>API Designer:</strong> Designs how programs communicate with each other</li>
                        <li><strong>Schema Designer:</strong> Plans how information is stored in databases</li>
                        <li><strong>CI/CD Builder:</strong> Sets up automated testing and deployment</li>
                        <li><strong>Deployment Wizard:</strong> Puts your application on the internet</li>
                        <li><strong>Security Scanner:</strong> Checks your code for security problems</li>
                        <li><strong>Performance Profiler:</strong> Measures how fast your application runs</li>
                        <li><strong>Cost Calculator:</strong> Estimates how much it costs to run your application</li>
                      </ul>
                    </div>
                  }
                  examples={[
                    "Start with Project Builder to create a new website project",
                    "Use API Designer to create an API that lets a mobile app get data from your server",
                    "Use Schema Designer to plan how user accounts and posts are stored in a database"
                  ]}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {tools.map((tool) => {
                  const colorClasses = {
                    sky: "from-sky-500 to-sky-600",
                    blue: "from-blue-500 to-blue-600",
                    indigo: "from-indigo-500 to-indigo-600",
                    purple: "from-purple-500 to-purple-600",
                    emerald: "from-emerald-500 to-emerald-600",
                    rose: "from-rose-500 to-rose-600",
                    amber: "from-amber-500 to-amber-600",
                    yellow: "from-yellow-500 to-yellow-600"
                  };

                  const toolExplanations: Record<string, { whatItDoes: string; whyItMatters: string; howToUse: string[] }> = {
                    "project-builder": {
                      whatItDoes: "Creates the starting files and folder structure for a new software project. It is like getting a new house with all the rooms already built.",
                      whyItMatters: "Saves time by setting up everything you need to start coding. You do not have to create files and folders manually.",
                      howToUse: [
                        "Click 'Open' to start the Project Builder",
                        "Choose what type of project you want (website, mobile app, API, etc.)",
                        "Select the programming languages and tools you want to use",
                        "The builder creates all the starting files for you",
                        "You can then start writing your code in these files"
                      ]
                    },
                    "api-designer": {
                      whatItDoes: "Helps you design APIs (Application Programming Interfaces) that let different programs talk to each other. An API is like a menu that tells other programs what information is available and how to request it.",
                      whyItMatters: "APIs allow your application to share data and functionality with other applications, like how a weather app gets weather data from a weather service.",
                      howToUse: [
                        "Define what questions (requests) your API can answer",
                        "Specify what information (data) it will return",
                        "Test your API to make sure it works correctly",
                        "Generate documentation so others know how to use it"
                      ]
                    },
                    "schema-designer": {
                      whatItDoes: "Helps you plan how information is organised in a database. A database is like a digital filing cabinet, and a schema is like the labels and folders you use to organise information.",
                      whyItMatters: "A well-designed database makes it easy to store and find information. It is like organising a library so books are easy to find.",
                      howToUse: [
                        "Create tables (like sections in a library) to organise information",
                        "Define fields (like Title, Author) for each type of information",
                        "Set up relationships between different pieces of information",
                        "Generate code to create the database structure"
                      ]
                    },
                    "cicd-builder": {
                      whatItDoes: "Creates automated workflows that test your code and deploy it to the internet. CI/CD stands for Continuous Integration and Continuous Deployment.",
                      whyItMatters: "Automates repetitive tasks so you do not have to manually test and deploy code every time you make changes. It is like having an assistant that does these tasks for you.",
                      howToUse: [
                        "Define when the pipeline should run (for example, when you save code)",
                        "Set up automated tests to check if your code works",
                        "Configure deployment steps to put your code on the internet",
                        "The pipeline runs automatically whenever you trigger it"
                      ]
                    },
                    "deployment": {
                      whatItDoes: "Guides you through putting your application on the internet so others can use it. Deployment is like publishing a book so others can read it.",
                      whyItMatters: "Makes your application accessible to users on the internet. Without deployment, your application only exists on your computer.",
                      howToUse: [
                        "Choose a cloud platform (Vercel, AWS, Google Cloud, or Azure)",
                        "Follow the wizard to configure your deployment",
                        "The wizard copies your code to a server and makes it accessible",
                        "Your application gets a web address (URL) so people can access it"
                      ]
                    },
                    "security": {
                      whatItDoes: "Scans your code to find security problems before attackers can exploit them. It is like having a security guard check your house for unlocked doors.",
                      whyItMatters: "Prevents security breaches that could expose user data or allow attackers to break into your application.",
                      howToUse: [
                        "Run the scanner on your code",
                        "Review the security issues it finds",
                        "Fix the problems using the suggestions provided",
                        "Run the scanner again to verify the fixes"
                      ]
                    },
                    "performance": {
                      whatItDoes: "Measures how fast your application runs and identifies parts that are slow. It helps you make your application faster.",
                      whyItMatters: "Fast applications provide a better experience for users. Slow applications frustrate users and may cause them to stop using your application.",
                      howToUse: [
                        "Run performance tests on your application",
                        "Review the results to see which parts are slow",
                        "Optimise the slow parts to make them faster",
                        "Run tests again to verify the improvements"
                      ]
                    },
                    "cost-calculator": {
                      whatItDoes: "Estimates how much it will cost to run your application on cloud platforms. It helps you plan your budget.",
                      whyItMatters: "Cloud services cost money. Understanding costs helps you choose the right platform and plan your budget.",
                      howToUse: [
                        "Enter details about your application (number of users, data storage, etc.)",
                        "Select the cloud platform you want to use",
                        "The calculator shows estimated monthly and yearly costs",
                        "Compare costs across different platforms to find the best option"
                      ]
                    }
                  };

                  const explanation = toolExplanations[tool.id] || {
                    whatItDoes: tool.description,
                    whyItMatters: "This tool helps you build better software applications.",
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
                        className="block w-full text-center px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
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
            <section className="rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Getting Started</h2>
              <p className="text-sm text-slate-700 mb-6">
                Follow these steps to build your first application. Each step builds on the previous one, 
                so it is best to do them in order.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Create a Project</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Use the Project Builder to create a new project. This sets up all the files and folders 
                    you need to start coding. It is like getting a new house with all the rooms already built.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Choose "Website" and "React" to create a new website project. 
                    The builder creates files for your homepage, styles, and configuration.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Design Your System</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Design APIs (how programs communicate), database schemas (how information is stored), 
                    and pipelines (automated workflows) using our visual tools.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Use the API Designer to create an API that lets a mobile app 
                    get user information from your server. Use the Schema Designer to plan how user accounts 
                    are stored in a database.
                  </p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-sky-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-600 text-white font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900">Deploy & Monitor</h3>
                  </div>
                  <p className="text-sm text-slate-700 mb-3">
                    Deploy your application to a cloud platform (like Vercel or AWS) so others can use it. 
                    Then monitor its performance to make sure it runs well.
                  </p>
                  <p className="text-xs text-slate-600">
                    <strong>Example:</strong> Use the Deployment Wizard to put your website on Vercel. 
                    It gives your website a web address (URL) like "mywebsite.vercel.app" so people can visit it.
                  </p>
                </div>
              </div>
            </section>

            {/* Learn More */}
            <section className="mt-8 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Need More Help?</h3>
              <div className="space-y-3 text-sm text-slate-700">
                <p>
                  <strong>New to software development?</strong> Start with the{" "}
                  <Link href="/dev-studios" className="font-semibold text-sky-600 hover:underline">
                    learning studio
                  </Link>
                  {" "}to understand the fundamentals before building real projects.
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

