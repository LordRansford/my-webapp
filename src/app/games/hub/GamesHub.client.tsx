/**
 * Games Hub - Unified games catalogue
 * 
 * Features:
 * - Filter by mode (solo vs multiplayer)
 * - Filter by category
 * - Filter by difficulty
 * - Preview cards with game info
 * - Search functionality
 */

"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, Gamepad2, Users, Puzzle, Brain, CreditCard, Grid3x3, Zap, BookOpen } from "lucide-react";
import type { GameCategory, GameMode, DifficultyLevel } from "@/lib/games/framework/types";

// Re-export types for convenience
export type { GameCategory, GameMode, DifficultyLevel };

interface GamePreview {
  id: string;
  title: string;
  description: string;
  category: GameCategory;
  modes: GameMode[];
  estimatedMinutes: number;
  difficulty: DifficultyLevel;
  href: string;
  icon: React.ReactNode;
}

// Games catalogue - all games using the framework
const GAMES: GamePreview[] = [
  {
    id: "daily-logic-gauntlet",
    title: "Daily Logic Gauntlet",
    description: "Multi-puzzle challenge with daily seeded challenges. Same seed for all users on the same day.",
    category: "puzzle",
    modes: ["solo", "daily"],
    estimatedMinutes: 15,
    difficulty: "intermediate",
    href: "/games/daily-logic-gauntlet",
    icon: <Puzzle className="h-6 w-6" />,
  },
  {
    id: "grid-racer",
    title: "Grid Racer Time Trial",
    description: "Time trial racing with customizable loadouts. Navigate through obstacles and beat your best time.",
    category: "arcade",
    modes: ["solo"],
    estimatedMinutes: 10,
    difficulty: "foundations",
    href: "/games/grid-racer",
    icon: <Zap className="h-6 w-6" />,
  },
  {
    id: "draft-duel",
    title: "Draft Duel Card Battler",
    description: "Strategic card game with drafting mechanics. Build your deck and battle opponents.",
    category: "card",
    modes: ["solo", "multiplayer"],
    estimatedMinutes: 20,
    difficulty: "advanced",
    href: "/games/draft-duel",
    icon: <CreditCard className="h-6 w-6" />,
  },
  {
    id: "hex",
    title: "Hex",
    description: "Classic connection game on hexagonal board. Connect your sides to win.",
    category: "board",
    modes: ["solo", "multiplayer"],
    estimatedMinutes: 15,
    difficulty: "intermediate",
    href: "/games/hex",
    icon: <Grid3x3 className="h-6 w-6" />,
  },
  {
    id: "systems-mastery",
    title: "Systems Mastery Game",
    description: "Flagship game for understanding complex systems. Learn systems thinking through interactive scenarios.",
    category: "educational",
    modes: ["solo", "campaign"],
    estimatedMinutes: 30,
    difficulty: "advanced",
    href: "/games/systems-mastery",
    icon: <Brain className="h-6 w-6" />,
  },
];

const CATEGORY_LABELS: Record<GameCategory, string> = {
  strategy: "Strategy",
  puzzle: "Puzzle",
  logic: "Logic",
  card: "Card",
  board: "Board",
  arcade: "Arcade",
  simulation: "Simulation",
  educational: "Educational",
};

const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  foundations: "Foundations",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export default function GamesHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<GameMode | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | "all">("all");

  const filteredGames = useMemo(() => {
    return GAMES.filter((game) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !game.title.toLowerCase().includes(query) &&
          !game.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Mode filter
      if (selectedMode !== "all" && !game.modes.includes(selectedMode)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== "all" && game.category !== selectedCategory) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "all" && game.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedMode, selectedCategory, selectedDifficulty]);

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8">
          <div className="rounded-3xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50/50 p-8 shadow-sm">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Games Hub</h1>
            <p className="text-lg text-slate-600">
              Premium games for learning, strategy, and skill development. Single-player and async multiplayer modes.
            </p>
          </div>
        </header>

        {/* Filters */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games..."
                  className="w-full rounded-lg border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Mode Filter */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-slate-400" />
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value as GameMode | "all")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Modes</option>
                <option value="solo">Solo</option>
                <option value="multiplayer">Multiplayer</option>
                <option value="campaign">Campaign</option>
                <option value="daily">Daily Challenge</option>
              </select>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as GameCategory | "all")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as DifficultyLevel | "all")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredGames.length === 0 ? (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <p className="text-slate-600">No games found matching your filters.</p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <Link
                key={game.id}
                href={game.href}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 rounded-xl bg-blue-100 p-3 text-blue-600 group-hover:bg-blue-200 transition-colors">
                    {game.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-slate-900 mb-1">{game.title}</h3>
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">{game.description}</p>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                        {CATEGORY_LABELS[game.category]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                        {DIFFICULTY_LABELS[game.difficulty]}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                        ~{game.estimatedMinutes} min
                      </span>
                      {game.modes.includes("multiplayer") && (
                        <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          Multiplayer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-start gap-3">
            <Gamepad2 className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">About Games Platform</h3>
              <p className="text-sm text-slate-700 mb-2">
                All games support keyboard and touch controls. Single-player games work offline.
                Multiplayer games use async turn-based mechanics for safe, structured play.
              </p>
              <p className="text-xs text-slate-600">
                Games are designed for learning and skill development, not addiction. No dark patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
