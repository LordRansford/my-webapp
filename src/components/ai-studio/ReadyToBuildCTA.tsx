"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

interface ReadyToBuildCTAProps {
  section?: string;
  studioName?: string;
  buildHref?: string;
  description?: string;
  className?: string;
}

export default function ReadyToBuildCTA({ 
  section,
  studioName = "AI Studio",
  buildHref = "/ai-studio",
  description,
  className = "" 
}: ReadyToBuildCTAProps) {
  const defaultDescription = description || (
    section 
      ? `Now that you understand ${section}, try building it yourself in the Live ${studioName}.`
      : `Put your knowledge into practice. Create real projects and deploy to production in the Live ${studioName}.`
  );

  return (
    <div className={`p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl ${className}`}>
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500 rounded-xl">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            Ready to Build?
          </h3>
          <p className="text-sm text-slate-700 mb-4">
            {defaultDescription}
          </p>
          <Link
            href={buildHref}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-sm"
          >
            Open Live Studio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

