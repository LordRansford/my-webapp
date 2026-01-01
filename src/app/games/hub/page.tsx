import GamesHubClient from "./GamesHub.client";
import type { Metadata } from "next";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Games Hub | Ransford's Notes",
  description: "Unified games platform with strategy, puzzle, logic, and educational games. Single-player and async multiplayer modes.",
  keywords: ["games", "strategy games", "puzzle games", "educational games", "multiplayer games", "offline games", "browser games"],
  openGraph: {
    title: "Games Hub | Ransford's Notes",
    description: "Premium games for learning, strategy, and skill development.",
    type: "website",
    url: "/games/hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Games Hub | Ransford's Notes",
    description: "Premium games for learning, strategy, and skill development.",
  },
  alternates: {
    canonical: "/games/hub",
  },
};

export default function GamesHubPage() {
  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Games Hub" }]}>
      {/* Hero Section */}
      <section className="space-y-5 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
        <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-3 py-1 text-xs font-semibold text-white">
          Games Hub
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold leading-tight text-slate-900">
            Games that build skills through play
          </h1>
          <p className="max-w-3xl text-base text-slate-700">
            Strategy, puzzle, logic, and educational games. Single-player and async multiplayer modes. 
            All games support keyboard and touch controls. Designed for learning, not addiction.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Play Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            Practice Games
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* Games List Component */}
      <GamesHubClient />
    </MarketingPageTemplate>
  );
}
