"use client";

import React, { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import Link from "next/link";
import { 
  Code, 
  Shield, 
  Database, 
  Layers,
  BookOpen, 
  Rocket, 
  Sparkles,
  ArrowRight, 
  CheckCircle2, 
  Circle,
  GraduationCap,
  Briefcase,
  Users,
  Zap,
  TrendingUp,
  Target,
  BarChart3,
  Layout
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import ComplianceSettings from "@/components/studios/ComplianceSettings";
import HelpTooltip from "@/components/studios/HelpTooltip";
import FeatureExplanation from "@/components/studios/FeatureExplanation";
import { auditLogger, AuditActions } from "@/lib/studios/security/auditLogger";

interface StudioInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  learnHref: string;
  liveHref: string;
  color: string;
  features: string[];
}

const studios: StudioInfo[] = [
  {
    id: "dev",
    name: "Software Development Studio",
    description: "Learn software architecture, design patterns, and build production-ready applications",
    icon: <Code className="w-6 h-6" />,
    learnHref: "/dev-studios",
    liveHref: "/dev-studio",
    color: "sky",
    features: ["Project Builder", "API Designer", "Schema Designer", "CI/CD Builder", "Deployment Wizard"]
  },
  {
    id: "cyber",
    name: "Cybersecurity Studio",
    description: "Master security architecture, threat modeling, and build secure systems",
    icon: <Shield className="w-6 h-6" />,
    learnHref: "/cyber-studios",
    liveHref: "/cyber-studio",
    color: "rose",
    features: ["Threat Modeling", "Risk Register", "Compliance Auditor", "Security Metrics", "IR Playbooks"]
  },
  {
    id: "data",
    name: "Data & Digitalisation Studio",
    description: "Design data pipelines, ensure quality, and build analytics systems",
    icon: <Database className="w-6 h-6" />,
    learnHref: "/data-studios",
    liveHref: "/data-studio",
    color: "amber",
    features: ["Pipeline Designer", "Quality Monitor", "Catalog Builder", "Dashboard Builder", "Governance"]
  },
  {
    id: "ai",
    name: "AI Studio",
    description: "Learn AI fundamentals and build production AI systems",
    icon: <Sparkles className="w-6 h-6" />,
    learnHref: "/ai-studios",
    liveHref: "/ai-studio",
    color: "purple",
    features: ["Model Training", "Dataset Management", "Agent Builder", "Workflow Builder", "Cloud Integration"]
  },
  {
    id: "architecture",
    name: "Architecture Diagram Studio",
    description: "Create professional architecture diagrams and system designs",
    icon: <Layers className="w-6 h-6" />,
    learnHref: "/studios/architecture-diagram-studio/learn",
    liveHref: "/studios/architecture-diagram-studio",
    color: "indigo",
    features: ["Multi-Format Support", "Real-Time Collaboration", "Version Control", "Export to Code", "Validation"]
  }
];

interface ProgressData {
  studioId: string;
  learningProgress: number;
  liveProjects: number;
  lastActivity?: string;
}

export default function StudiosHubPage() {
  const [progress, setProgress] = useState<Record<string, ProgressData>>({});
  const [selectedRole, setSelectedRole] = useState<"enterprise" | "professional" | "student" | "child">("professional");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsLoading(false);
      return;
    }
    
    // Load progress from localStorage
    const loadProgress = () => {
      const saved = localStorage.getItem("studios-hub-progress");
      if (saved) {
        try {
          setProgress(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load progress", e);
        }
      } else {
        // Initialize default progress
        const defaultProgress: Record<string, ProgressData> = {};
        studios.forEach(studio => {
          defaultProgress[studio.id] = {
            studioId: studio.id,
            learningProgress: 0,
            liveProjects: 0
          };
        });
        setProgress(defaultProgress);
      }
      setIsLoading(false);
    };

    loadProgress();
  }, []);

  // Memoize computed values for performance
  const totalLearningProgress = useMemo(() => 
    Object.values(progress).reduce((sum, p) => sum + p.learningProgress, 0),
    [progress]
  );
  
  const totalLiveProjects = useMemo(() => 
    Object.values(progress).reduce((sum, p) => sum + p.liveProjects, 0),
    [progress]
  );
  
  const studiosWithProgress = useMemo(() => 
    Object.values(progress).filter(p => p.learningProgress > 0 || p.liveProjects > 0).length,
    [progress]
  );

  // Memoize role info to prevent unnecessary re-renders
  const roleInfo = useMemo(() => ({
    enterprise: {
      label: "Enterprise",
      icon: <Briefcase className="w-5 h-5" />,
      description: "Advanced features, team collaboration, compliance tools"
    },
    professional: {
      label: "Professional",
      icon: <Users className="w-5 h-5" />,
      description: "Full feature access, standard limits, export capabilities"
    },
    student: {
      label: "Student",
      icon: <GraduationCap className="w-5 h-5" />,
      description: "Learning-focused features, educational discounts, progress tracking"
    },
    child: {
      label: "Child",
      icon: <Target className="w-5 h-5" />,
      description: "Simplified UI, safe sandbox, visual learning aids"
    }
  }), []);
  
  // Memoize role change handler
  const handleRoleChange = useCallback((role: typeof selectedRole) => {
    setSelectedRole(role);
  }, []);

  useEffect(() => {
    if (!isLoading) {
      auditLogger.log(AuditActions.TOOL_OPENED, "studios-hub", { page: "hub" });
    }
  }, [isLoading]);

  return (
    <SecureErrorBoundary studio="studios-hub">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
        {isLoading ? (
          <LoadingSpinner message="Loading Studios Hub..." />
        ) : (
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <header className="mb-12">
              <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 p-8 sm:p-12 shadow-lg">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                    <Layout className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">Unified Studios Hub</h1>
                    <p className="text-lg text-slate-600 mt-2">
                      Learn safely, then build real-world systems across all domains
                    </p>
                  </div>
                </div>

                {/* Role Selector */}
                <div className="mt-8">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Select your role:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.entries(roleInfo).map(([key, info]) => (
                      <button
                        key={key}
                        onClick={() => handleRoleChange(key as typeof selectedRole)}
                        className={`p-4 rounded-2xl border-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                          selectedRole === key
                            ? "border-emerald-500 bg-emerald-50 shadow-md"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                        aria-pressed={selectedRole === key}
                        aria-label={`Select ${info.label} role`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`${selectedRole === key ? "text-emerald-600" : "text-slate-600"}`}>
                            {info.icon}
                          </div>
                          <span className="text-sm font-semibold text-slate-900">{info.label}</span>
                        </div>
                        <p className="text-xs text-slate-600 text-left">{info.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>

            {/* Progress Overview */}
            <section className="mb-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-700">Learning Progress</h3>
                  <HelpTooltip
                    title="Learning Progress"
                    content={
                      <div className="space-y-2 text-sm text-slate-700">
                        <p>
                          This shows your overall progress across all learning studios. It&apos;s calculated by averaging
                          your completion percentage in each studio&apos;s learning mode.
                        </p>
                        <p>
                          <strong>How to improve:</strong> Complete sections in the learning studios to increase your progress.
                        </p>
                      </div>
                    }
                  />
                </div>
                <p className="text-3xl font-bold text-slate-900">{totalLearningProgress}%</p>
                <p className="text-xs text-slate-600 mt-1">Across {studiosWithProgress} studios</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Rocket className="w-5 h-5 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-700">Live Projects</h3>
                  <HelpTooltip
                    title="Live Projects"
                    content={
                      <div className="space-y-2 text-sm text-slate-700">
                        <p>
                          This is the total number of active projects you have across all build studios. These are
                          real projects that you&apos;re working on or have deployed.
                        </p>
                        <p>
                          <strong>What counts:</strong> Any project you&apos;ve created in a build studio, whether it&apos;s
                          in progress, completed, or deployed.
                        </p>
                      </div>
                    }
                  />
                </div>
                <p className="text-3xl font-bold text-slate-900">{totalLiveProjects}</p>
                <p className="text-xs text-slate-600 mt-1">Active projects</p>
              </div>
              <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-semibold text-slate-700">Studios Active</h3>
                  <HelpTooltip
                    title="Studios Active"
                    content={
                      <div className="space-y-2 text-sm text-slate-700">
                        <p>
                          This shows how many studios you&apos;ve used. A studio is considered &quot;active&quot; if you have
                          learning progress or live projects in it.
                        </p>
                        <p>
                          <strong>Goal:</strong> Try all studios to get a well-rounded understanding of different
                          domains!
                        </p>
                      </div>
                    }
                  />
                </div>
                <p className="text-3xl font-bold text-slate-900">{studiosWithProgress}</p>
                <p className="text-xs text-slate-600 mt-1">Of {studios.length} studios</p>
              </div>
            </section>

            {/* Studios Grid */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">All Studios</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studios.map((studio) => {
                  const studioProgress = progress[studio.id] || { learningProgress: 0, liveProjects: 0 };
                  const colorClasses = {
                    sky: "from-sky-500 to-sky-600",
                    rose: "from-rose-500 to-rose-600",
                    amber: "from-amber-500 to-amber-600",
                    purple: "from-purple-500 to-purple-600",
                    indigo: "from-indigo-500 to-indigo-600"
                  };

                  return (
                    <div
                      key={studio.id}
                      className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colorClasses[studio.color as keyof typeof colorClasses]} text-white mb-4`}>
                        {studio.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">{studio.name}</h3>
                      <p className="text-sm text-slate-600 mb-4">{studio.description}</p>

                      {/* Progress */}
                      <div className="mb-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Learning</span>
                          <span className="font-semibold text-slate-900">{studioProgress.learningProgress}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${studioProgress.learningProgress}%` }}
                          />
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <p className="text-xs font-semibold text-slate-700 mb-2">Key Features:</p>
                        <ul className="space-y-1">
                          {studio.features.slice(0, 3).map((feature, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Actions */}
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={studio.learnHref}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-semibold text-slate-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                          aria-label={`Learn ${studio.name}`}
                        >
                          <BookOpen className="w-4 h-4" aria-hidden="true" />
                          Learn
                        </Link>
                        <Link
                          href={studio.liveHref}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-lg text-sm font-semibold text-white transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                          aria-label={`Build with ${studio.name}`}
                        >
                          <Rocket className="w-4 h-4" aria-hidden="true" />
                          Build
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Quick Links */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Link
                  href="/studios"
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900">All Studios</p>
                  <p className="text-xs text-slate-600 mt-1">Browse all available studios</p>
                </Link>
                <Link
                  href="/compute"
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900">Compute Credits</p>
                  <p className="text-xs text-slate-600 mt-1">Manage your compute usage</p>
                </Link>
                <Link
                  href="/examples"
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900">Examples</p>
                  <p className="text-xs text-slate-600 mt-1">Browse project templates</p>
                </Link>
                <Link
                  href="/help"
                  className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all"
                >
                  <p className="text-sm font-semibold text-slate-900">Help & Support</p>
                  <p className="text-xs text-slate-600 mt-1">Get help and documentation</p>
                </Link>
              </div>
            </section>

            {/* Recommended Path */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Recommended Path</h2>
              <div className="rounded-3xl bg-gradient-to-br from-emerald-50 to-blue-50 border border-emerald-200 p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">Start Your Journey</h3>
                    <p className="text-sm text-slate-700 mb-4">
                      Based on your role as <strong>{roleInfo[selectedRole].label}</strong>, we recommend starting with:
                    </p>
                    <div className="space-y-2">
                      {selectedRole === "enterprise" && (
                        <>
                          <p className="text-sm text-slate-700">1. Explore the <strong>Dev Studio</strong> for architecture and compliance tools</p>
                          <p className="text-sm text-slate-700">2. Set up <strong>Cyber Studio</strong> for security posture assessment</p>
                          <p className="text-sm text-slate-700">3. Configure <strong>Data Studio</strong> for governance and quality</p>
                        </>
                      )}
                      {selectedRole === "professional" && (
                        <>
                          <p className="text-sm text-slate-700">1. Start with <strong>Dev Studio</strong> to build your first project</p>
                          <p className="text-sm text-slate-700">2. Learn security basics in <strong>Cyber Studio</strong></p>
                          <p className="text-sm text-slate-700">3. Explore <strong>AI Studio</strong> for modern applications</p>
                        </>
                      )}
                      {selectedRole === "student" && (
                        <>
                          <p className="text-sm text-slate-700">1. Begin with <strong>AI Studio</strong> learning mode</p>
                          <p className="text-sm text-slate-700">2. Practice in <strong>Dev Studio</strong> with guided tours</p>
                          <p className="text-sm text-slate-700">3. Explore <strong>Architecture Diagram Studio</strong> for visual learning</p>
                        </>
                      )}
                      {selectedRole === "child" && (
                        <>
                          <p className="text-sm text-slate-700">1. Start with <strong>AI Studio</strong> child mode</p>
                          <p className="text-sm text-slate-700">2. Try <strong>Dev Studio</strong> visual programming</p>
                          <p className="text-sm text-slate-700">3. Create diagrams in <strong>Architecture Studio</strong> simple mode</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Compliance & Governance */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Compliance & Governance</h2>
              <ComplianceSettings />
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}

