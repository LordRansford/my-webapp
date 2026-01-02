"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { 
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
  Database,
  Layers,
  Bot,
  TrendingUp
} from "lucide-react";
import ErrorBoundaryWrapper from "@/components/ai-studio/ErrorBoundaryWrapper";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";

interface ProgressItem {
  id: string;
  label: string;
  completed: boolean;
  link: string;
}

export default function AIHubPage() {
  const [learningProgress, setLearningProgress] = useState<ProgressItem[]>([]);
  const [buildProgress, setBuildProgress] = useState({
    models: 0,
    datasets: 0,
    agents: 0,
    jobs: 0,
  });

  useEffect(() => {
    // Load progress from localStorage
    const saved = localStorage.getItem("ai-studio-learning-progress");
    if (saved) {
      setLearningProgress(JSON.parse(saved));
    } else {
      // Initialize default progress
      const defaultProgress: ProgressItem[] = [
        { id: "overview", label: "Overview", completed: false, link: "/ai-studios#overview" },
        { id: "what-ai-is", label: "What AI is and is not", completed: false, link: "/ai-studios#what-ai-is" },
        { id: "model-types", label: "Model types and capabilities", completed: false, link: "/ai-studios#model-types" },
        { id: "data-training", label: "Data and training basics", completed: false, link: "/ai-studios#data-training" },
        { id: "inference", label: "Inference and limitations", completed: false, link: "/ai-studios#inference" },
        { id: "eval-bias", label: "Evaluation and bias", completed: false, link: "/ai-studios#eval-bias" },
        { id: "responsible", label: "Responsible AI", completed: false, link: "/ai-studios#responsible" },
        { id: "tools", label: "Practical experimentation tools", completed: false, link: "/ai-studios#tools" },
        { id: "use-cases", label: "Practical use cases", completed: false, link: "/ai-studios#use-cases" },
      ];
      setLearningProgress(defaultProgress);
    }

    // Load build progress (would come from API in production)
    // For now, using localStorage
    const buildData = localStorage.getItem("ai-studio-build-progress");
    if (buildData) {
      setBuildProgress(JSON.parse(buildData));
    }
  }, []);

  const learningCompleted = learningProgress.filter(p => p.completed).length;
  const learningTotal = learningProgress.length;
  const learningPercentage = learningTotal > 0 ? (learningCompleted / learningTotal) * 100 : 0;

  return (
    <ErrorBoundaryWrapper>
      <Suspense fallback={<LoadingSpinner message="Loading AI Studio Hub..." />}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <header className="mb-12">
          <div className="rounded-3xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-200 p-8 sm:p-12 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">AI Studio Hub</h1>
                <p className="text-lg text-slate-600 mt-2">
                  Learn AI concepts safely, then build real-world AI systems
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Learn AI</h2>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Understand AI fundamentals, model types, data training, and responsible AI practices. 
                  All experiments run safely in your browser.
                </p>
                <Link
                  href="/ai-studios"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm"
                >
                  Start Learning
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="p-6 bg-purple-50 border border-purple-200 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="w-6 h-6 text-purple-600" />
                  <h2 className="text-xl font-semibold text-slate-900">Build AI</h2>
                </div>
                <p className="text-sm text-slate-700 mb-4">
                  Create, train, and deploy AI models. Manage datasets, orchestrate agents, 
                  and build production-ready AI systems with cloud integration.
                </p>
                <Link
                  href="/ai-studio"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
                >
                  Start Building
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Tracking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Learning Progress */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Learning Progress
              </h3>
              <span className="text-sm font-medium text-slate-600">
                {learningCompleted}/{learningTotal} completed
              </span>
            </div>
            <div className="mb-4">
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${learningPercentage}%` }}
                />
              </div>
              <p className="text-xs text-slate-600 mt-2">{Math.round(learningPercentage)}% complete</p>
            </div>
            <div className="space-y-2">
              {learningProgress.slice(0, 5).map((item) => (
                <Link
                  key={item.id}
                  href={item.link}
                  className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 transition-colors"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400" />
                  )}
                  <span className={item.completed ? "line-through text-slate-500" : ""}>
                    {item.label}
                  </span>
                </Link>
              ))}
              {learningProgress.length > 5 && (
                <Link
                  href="/ai-studios"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                >
                  View all sections
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Build Progress */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Rocket className="w-5 h-5 text-purple-600" />
                Your Projects
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700">Models</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{buildProgress.models}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Database className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium text-slate-700">Datasets</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{buildProgress.datasets}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">Agents</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{buildProgress.agents}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-medium text-slate-700">Jobs</span>
                </div>
                <p className="text-2xl font-bold text-slate-900">{buildProgress.jobs}</p>
              </div>
            </div>
            <Link
              href="/ai-studio"
              className="mt-4 inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              View all projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-12">
          <Link
            href="/ai-studios#overview"
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900">New to AI?</h3>
            </div>
            <p className="text-sm text-slate-600">
              Start with the fundamentals. Learn what AI is, how models work, and why evaluation matters.
            </p>
          </Link>

          <Link
            href="/ai-studio"
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <Briefcase className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900">Ready to Build?</h3>
            </div>
            <p className="text-sm text-slate-600">
              Jump into the live studio. Create your first model, upload datasets, or explore examples.
            </p>
          </Link>

          <Link
            href="/ai-studio/poc-showcase"
            className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-amber-100 rounded-xl group-hover:bg-amber-200 transition-colors">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900">See Examples</h3>
            </div>
            <p className="text-sm text-slate-600">
              Explore proof-of-concept implementations and see what&apos;s possible with AI Studio.
            </p>
          </Link>
        </div>

        {/* Audience-Specific Paths */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm mb-12">
          <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-slate-600" />
            Choose Your Path
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link
              href="/ai-studio/children-mode"
              className="p-4 border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all"
            >
              <div className="text-2xl mb-2">👶</div>
              <h4 className="font-semibold text-slate-900 mb-1">Children</h4>
              <p className="text-xs text-slate-600">Safe, fun projects with visual interfaces</p>
            </Link>
            <Link
              href="/ai-studios"
              className="p-4 border border-slate-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all"
            >
              <div className="text-2xl mb-2">🎓</div>
              <h4 className="font-semibold text-slate-900 mb-1">Students</h4>
              <p className="text-xs text-slate-600">Learn fundamentals and build projects</p>
            </Link>
            <Link
              href="/ai-studio"
              className="p-4 border border-slate-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              <div className="text-2xl mb-2">💼</div>
              <h4 className="font-semibold text-slate-900 mb-1">Professionals</h4>
              <p className="text-xs text-slate-600">Production-ready tools and workflows</p>
            </Link>
            <Link
              href="/ai-studios"
              className="p-4 border border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50 transition-all"
            >
              <div className="text-2xl mb-2">🔬</div>
              <h4 className="font-semibold text-slate-900 mb-1">Researchers</h4>
              <p className="text-xs text-slate-600">Advanced models and experimentation</p>
            </Link>
          </div>
        </div>

        {/* Navigation Help */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">How It Works</h3>
          <div className="space-y-3 text-sm text-slate-700">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <strong>Learn</strong> in the Learning Studio (`/ai-studios`) - Understand concepts safely in your browser
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <strong>Practice</strong> with examples - Load pre-built templates and customize them
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                3
              </div>
              <div>
                <strong>Build</strong> in the Live Studio (`/ai-studio`) - Create real projects with cloud integration
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold">
                4
              </div>
              <div>
                <strong>Deploy</strong> your models - Connect to AWS, GCP, Azure, or Hugging Face
              </div>
            </div>
          </div>
        </div>
      </div>
        </div>
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

