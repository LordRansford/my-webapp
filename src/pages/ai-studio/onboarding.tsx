"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Circle,
  Sparkles,
  Database,
  Layers,
  Bot,
  Zap,
  Play,
  Shield,
  FileText,
  Loader2
} from "lucide-react";
import ErrorBoundaryWrapper from "@/components/ai-studio/ErrorBoundaryWrapper";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to AI Studio",
      description: "Let's get you started with building AI systems",
      icon: Sparkles,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            AI Studio is your platform for building, training, and deploying AI models. 
            Whether you're a beginner or an expert, we'll guide you through everything.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Learn First</h4>
              <p className="text-sm text-slate-700">
                New to AI? Start with our <a href="/ai-studios" className="text-blue-600 hover:underline">Learning Studio</a> to understand the fundamentals.
              </p>
            </div>
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
              <h4 className="font-semibold text-slate-900 mb-2">Build Now</h4>
              <p className="text-sm text-slate-700">
                Ready to build? We'll show you how to create your first model, upload datasets, and deploy.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "datasets",
      title: "Working with Datasets",
      description: "Upload and manage your training data",
      icon: Database,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Datasets are the foundation of AI. Upload your data, validate it for quality and compliance, 
            and prepare it for training.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Upload CSV, JSON, or image files</li>
            <li>Automatic validation for data quality</li>
            <li>Legal compliance checking</li>
            <li>Preview and explore your data</li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-900 mb-2">Try it:</p>
            <p className="text-sm text-slate-700">
              Go to <a href="/ai-studio/datasets" className="text-purple-600 hover:underline">Datasets</a> to upload your first dataset or load an example.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "models",
      title: "Creating Models",
      description: "Build and configure AI models",
      icon: Layers,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Models are the AI systems that learn from your data. Choose from pre-built architectures 
            or create custom models with our visual builder.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Select from proven model architectures</li>
            <li>Use the visual model builder for custom designs</li>
            <li>Configure training parameters</li>
            <li>Estimate compute costs before training</li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-900 mb-2">Try it:</p>
            <p className="text-sm text-slate-700">
              Visit the <a href="/ai-studio" className="text-purple-600 hover:underline">Dashboard</a> and click "Build Model" to get started.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "training",
      title: "Training Models",
      description: "Train your models in the browser or on cloud compute",
      icon: Play,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Training is where your model learns from data. You can train in your browser for small models, 
            or use cloud compute for larger projects.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Browser training for quick experiments</li>
            <li>Cloud training for production models</li>
            <li>Real-time progress monitoring</li>
            <li>Automatic checkpointing</li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-900 mb-2">Try it:</p>
            <p className="text-sm text-slate-700">
              Click "Train Model" on the dashboard to start a training job.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "agents",
      title: "AI Agents",
      description: "Create intelligent agents that can automate workflows",
      icon: Bot,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Agents are AI systems that can reason, use tools, and complete complex tasks. 
            Build multi-agent workflows for sophisticated automation.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Configure agent behavior and tools</li>
            <li>Build multi-agent workflows</li>
            <li>Monitor agent execution</li>
            <li>Integrate with external APIs</li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-900 mb-2">Try it:</p>
            <p className="text-sm text-slate-700">
              Go to <a href="/ai-studio/agents" className="text-purple-600 hover:underline">Agents</a> to create your first agent.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "examples",
      title: "Examples & Templates",
      description: "Learn from pre-built examples",
      icon: FileText,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            Not sure where to start? Load one of our pre-built examples to see how it's done, 
            then customize it for your needs.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-slate-700">
            <li>Examples for all skill levels</li>
            <li>Children-friendly projects</li>
            <li>Student learning projects</li>
            <li>Professional use cases</li>
          </ul>
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <p className="text-sm font-semibold text-slate-900 mb-2">Try it:</p>
            <p className="text-sm text-slate-700">
              Check out the Examples section on the dashboard to browse available templates.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "complete",
      title: "You're All Set!",
      description: "Start building your first AI system",
      icon: CheckCircle2,
      content: (
        <div className="space-y-4">
          <p className="text-slate-700">
            You now know the basics of AI Studio. Ready to build something amazing?
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => router.push("/ai-studio")}
              className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors text-left"
            >
              <h4 className="font-semibold mb-2">Go to Dashboard</h4>
              <p className="text-sm opacity-90">Start building your first project</p>
            </button>
            <button
              onClick={() => router.push("/ai-studio/poc-showcase")}
              className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-left"
            >
              <h4 className="font-semibold mb-2">See Examples</h4>
              <p className="text-sm opacity-90">Explore proof-of-concept demos</p>
            </button>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem("ai-studio-onboarding-progress");
    if (saved) {
      const data = JSON.parse(saved);
      setCurrentStep(data.currentStep || 0);
      setCompletedSteps(new Set(data.completedSteps || []));
    }
  }, []);

  const handleNext = () => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(steps[currentStep].id);
    setCompletedSteps(newCompleted);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      localStorage.setItem("ai-studio-onboarding-completed", "true");
      router.push("/ai-studio");
    }
    
    // Save progress
    localStorage.setItem("ai-studio-onboarding-progress", JSON.stringify({
      currentStep: currentStep + 1,
      completedSteps: Array.from(newCompleted),
    }));
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("ai-studio-onboarding-completed", "true");
    router.push("/ai-studio");
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <ErrorBoundaryWrapper>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-slate-900">Getting Started</h1>
            <button
              onClick={handleSkip}
              className="text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Skip onboarding"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-600 mt-2">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>

        {/* Step Content */}
        <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-lg mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-4 bg-purple-100 rounded-xl">
              <Icon className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                {currentStepData.title}
              </h2>
              <p className="text-slate-600">{currentStepData.description}</p>
            </div>
          </div>

          <div className="prose max-w-none">
            {currentStepData.content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Previous
          </button>

          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? "bg-purple-600"
                    : completedSteps.has(step.id)
                    ? "bg-green-500"
                    : "bg-slate-300"
                }`}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            aria-label={currentStep === steps.length - 1 ? "Complete onboarding" : "Next step"}
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
      </div>
    </ErrorBoundaryWrapper>
  );
}

