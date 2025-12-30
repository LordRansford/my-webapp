"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, HelpCircle, BookOpen, Rocket } from "lucide-react";
import StudioNavigation from "./StudioNavigation";
import HelpTooltip from "./HelpTooltip";

interface StudioPageHeaderProps {
  studioType: "dev" | "cyber" | "data" | "ai" | "architecture";
  title: string;
  description: string;
  learnHref: string;
  liveHref: string;
  icon: React.ReactNode;
  color: string;
}

export default function StudioPageHeader({
  studioType,
  title,
  description,
  learnHref,
  liveHref,
  icon,
  color
}: StudioPageHeaderProps) {
  const colorClasses = {
    sky: "from-sky-500 to-sky-600 bg-sky-50 border-sky-200",
    rose: "from-rose-500 to-rose-600 bg-rose-50 border-rose-200",
    amber: "from-amber-500 to-amber-600 bg-amber-50 border-amber-200",
    purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200",
    indigo: "from-indigo-500 to-indigo-600 bg-indigo-50 border-indigo-200"
  };

  const colors = colorClasses[color as keyof typeof colorClasses] || colorClasses.sky;
  const [bgColor, borderColor] = colors.split(" ").slice(-2);

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/studios/hub"
              className="text-slate-600 hover:text-slate-900 transition-colors"
              aria-label="Back to Studios Hub"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${colors.split(" ")[0]} ${colors.split(" ")[1]} text-white`}>
              {icon}
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <HelpTooltip
                  title={`About ${title}`}
                  content={
                    <div className="space-y-4">
                      <p>{description}</p>
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">Two Modes Available</h3>
                        <div className="space-y-2">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <strong className="text-sm text-blue-900">Learning Mode</strong>
                            </div>
                            <p className="text-xs text-blue-800">
                              Safe, browser-only environment where you can learn concepts without affecting real systems. 
                              Perfect for beginners and experimentation.
                            </p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <Rocket className="w-4 h-4 text-purple-600" />
                              <strong className="text-sm text-purple-900">Live Mode</strong>
                            </div>
                            <p className="text-xs text-purple-800">
                              Production-ready tools for building real applications. Use this when you are ready 
                              to create systems that others can use.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                  examples={[
                    `Start in learning mode to understand ${title.toLowerCase()} concepts`,
                    `Move to live mode when ready to build real projects`
                  ]}
                />
              </div>
            </div>
          </div>
          <p className="text-base sm:text-lg text-slate-600 mt-2 max-w-3xl">
            {description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StudioNavigation studioType={studioType} showHub={true} />
        </div>
      </div>

      {/* Mode Selector */}
      <div className={`rounded-2xl ${bgColor} border ${borderColor} p-4`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">Choose Your Mode</h3>
            <p className="text-sm text-slate-700">
              Start with learning mode to understand concepts, then move to live mode to build real projects.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href={learnHref}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 rounded-lg text-sm font-semibold text-slate-900 transition-colors border border-slate-300"
            >
              <BookOpen className="w-4 h-4" />
              Learning Mode
            </Link>
            <Link
              href={liveHref}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-lg text-sm font-semibold text-white transition-all shadow-sm"
            >
              <Rocket className="w-4 h-4" />
              Live Mode
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}



