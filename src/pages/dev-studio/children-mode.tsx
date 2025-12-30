"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Code, 
  Gamepad2, 
  BookOpen,
  Sparkles,
  Blocks,
  Play,
  Shield,
  Heart
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";
import { getAudienceProfile } from "@/lib/studios/audiences";

const games = [
  {
    id: "visual-programming",
    name: "Visual Programming",
    description: "Build programs using colorful blocks",
    icon: <Blocks className="w-8 h-8" />,
    color: "blue",
    href: "/dev-studio/children/visual-programming"
  },
  {
    id: "game-builder",
    name: "Game Builder",
    description: "Create your own simple games",
    icon: <Gamepad2 className="w-8 h-8" />,
    color: "purple",
    href: "/dev-studio/children/game-builder"
  },
  {
    id: "story-mode",
    name: "Story Mode",
    description: "Learn programming through stories",
    icon: <BookOpen className="w-8 h-8" />,
    color: "green",
    href: "/dev-studio/children/story-mode"
  },
  {
    id: "safe-sandbox",
    name: "Safe Sandbox",
    description: "Experiment safely",
    icon: <Shield className="w-8 h-8" />,
    color: "yellow",
    href: "/dev-studio/children/sandbox"
  }
];

const templates = [
  {
    id: "hello-world",
    name: "Hello World",
    description: "Your first program",
    difficulty: "easy"
  },
  {
    id: "calculator",
    name: "Simple Calculator",
    description: "Build a calculator",
    difficulty: "easy"
  },
  {
    id: "guessing-game",
    name: "Guessing Game",
    description: "A fun number guessing game",
    difficulty: "medium"
  },
  {
    id: "drawing-app",
    name: "Drawing App",
    description: "Create colorful drawings",
    difficulty: "medium"
  }
];

export default function DevStudioChildrenModePage() {
  const [isLoading, setIsLoading] = useState(false);
  const profile = getAudienceProfile("child");

  return (
    <SecureErrorBoundary studio="dev-studio">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50">
        {isLoading ? (
          <LoadingSpinner message="Loading..." />
        ) : (
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <Code className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-900">Dev Studio for Kids</h1>
                  <p className="text-lg text-slate-600 mt-2">
                    Learn programming in a fun and safe way!
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                <Shield className="w-4 h-4 text-green-600" />
                <span>Safe and secure</span>
                <span className="text-slate-300">•</span>
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Made for kids</span>
              </div>
            </header>

            {/* Games Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Fun Learning Games</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {games.map((game) => {
                  const colorClasses = {
                    blue: "from-blue-500 to-blue-600",
                    purple: "from-purple-500 to-purple-600",
                    green: "from-green-500 to-green-600",
                    yellow: "from-yellow-500 to-yellow-600"
                  };

                  return (
                    <Link
                      key={game.id}
                      href={game.href}
                      className="group rounded-3xl bg-white border-2 border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colorClasses[game.color as keyof typeof colorClasses]} text-white mb-6 group-hover:scale-110 transition-transform`}>
                        {game.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3">{game.name}</h3>
                      <p className="text-base text-slate-600 mb-4">{game.description}</p>
                      <div className="flex items-center gap-2 text-blue-600 font-semibold">
                        <span>Play Now</span>
                        <Play className="w-5 h-5" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>

            {/* Templates Section */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">Ready-Made Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="rounded-2xl bg-white border-2 border-slate-200 p-6 shadow-md hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      <h3 className="text-lg font-bold text-slate-900">{template.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{template.description}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      template.difficulty === "easy" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Safety Notice */}
            <section className="rounded-3xl bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200 p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-green-600" />
                <h3 className="text-2xl font-bold text-slate-900">Safe Learning Environment</h3>
              </div>
              <p className="text-base text-slate-700 max-w-2xl mx-auto">
                This is a safe place to learn! No real passwords, no real data, and no connections to the outside world. 
                Just fun learning and creativity!
              </p>
            </section>

            {/* Back to Regular Studio */}
            <section className="mt-8 text-center">
              <Link
                href="/dev-studio"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold"
              >
                Go to Regular Studio
              </Link>
            </section>
          </div>
        )}
      </div>
    </SecureErrorBoundary>
  );
}


