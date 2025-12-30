"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowLeft, 
  Shield, 
  Heart,
  BookOpen,
  Palette
} from "lucide-react";
import SecureErrorBoundary from "@/components/studios/SecureErrorBoundary";
import ExampleGallery from "@/components/ai-studio/ExampleGallery";
import { Suspense } from "react";
import LoadingSpinner from "@/components/ai-studio/LoadingSpinner";

export default function ChildrenModePage() {
  const [selectedExample, setSelectedExample] = useState<string | null>(null);

  return (
    <SecureErrorBoundary studio="ai-studio">
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50/30 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="mb-8">
            <div className="rounded-3xl bg-gradient-to-br from-white to-pink-50/50 border border-pink-200 p-8 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 shadow-lg">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold text-slate-900">AI Studio for Kids</h1>
                    <p className="text-lg text-slate-600 mt-1">
                      Safe, fun, and educational AI projects
                    </p>
                  </div>
                </div>
                <Link
                  href="/ai-studio"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-semibold text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Studio
                </Link>
              </div>

              {/* Safety Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">Safe & Secure</h3>
                    <p className="text-sm text-green-800">
                      All projects run safely in your browser. No personal information is shared, 
                      and everything is designed to be fun and educational!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
            <div className="p-6 bg-white rounded-2xl border border-pink-200">
              <div className="p-3 bg-pink-100 rounded-xl w-fit mb-3">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Fun & Creative</h3>
              <p className="text-sm text-slate-600">
                Create stories, classify drawings, and explore AI in a fun way!
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-purple-200">
              <div className="p-3 bg-purple-100 rounded-xl w-fit mb-3">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Learn & Explore</h3>
              <p className="text-sm text-slate-600">
                Discover how AI works through hands-on projects and examples.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-blue-200">
              <div className="p-3 bg-blue-100 rounded-xl w-fit mb-3">
                <Palette className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Easy to Use</h3>
              <p className="text-sm text-slate-600">
                Simple, colorful interface designed just for kids!
              </p>
            </div>
          </div>

          {/* Examples */}
          <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Fun Projects to Try</h2>
            <Suspense fallback={<LoadingSpinner message="Loading fun projects..." />}>
              <ExampleGallery selectedAudience="children" />
            </Suspense>
          </div>
        </div>
      </div>
    </SecureErrorBoundary>
  );
}

