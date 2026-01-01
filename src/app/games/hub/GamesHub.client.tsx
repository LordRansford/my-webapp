"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Filter, Gamepad2, Users, Puzzle, Brain, CreditCard, Grid3x3, Zap, 
  BookOpen, Target, Palette, Network, Shield, Clock3, Star, Bookmark, BookmarkCheck,
  X, ArrowRight, TrendingUp, Award, PlayCircle
} from "lucide-react";
import type { GameCategory, GameMode, DifficultyLevel } from "@/lib/games/framework/types";
import { ACTION_GAMES, PRACTICE_GAMES } from "@/lib/games-registry";

// Re-export types for convenience
export type { GameCategory, GameMode, DifficultyLevel };

interface GamePreview {
  id: string;
  title: string;
  description: string;
  category: GameCategory | "action" | "practice";
  modes: GameMode[];
  estimatedMinutes: number;
  difficulty: DifficultyLevel | "easy" | "medium" | "hard";
  href: string;
  icon: React.ReactNode;
  type?: "framework" | "action" | "practice";
  level?: string;
}

// Framework games - all games using the framework
const FRAMEWORK_GAMES: GamePreview[] = [
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
    type: "framework",
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
    type: "framework",
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
    type: "framework",
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
    type: "framework",
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
    type: "framework",
  },
  {
    id: "constraint-optimizer",
    title: "Constraint Optimizer",
    description: "Optimize resource allocation under constraints. Balance multiple objectives for maximum efficiency.",
    category: "puzzle",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "intermediate",
    href: "/games/constraint-optimizer",
    icon: <Target className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "pattern-architect",
    title: "Pattern Architect",
    description: "Create beautiful symmetric patterns. Build visual patterns following rules and symmetry requirements.",
    category: "puzzle",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "intermediate",
    href: "/games/pattern-architect",
    icon: <Palette className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "deduction-grid",
    title: "Deduction Grid",
    description: "Solve logic grid puzzles using deduction. Build logical inference chains from clues.",
    category: "logic",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "intermediate",
    href: "/games/deduction-grid",
    icon: <Grid3x3 className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "flow-planner",
    title: "Flow Planner",
    description: "Optimize flow through networks. Plan resource flows and manage dependencies.",
    category: "strategy",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "intermediate",
    href: "/games/flow-planner",
    icon: <Network className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "signal-hunt",
    title: "Signal Hunt",
    description: "Triage security signals under time pressure. Balance investigation depth against response speed while managing false positives.",
    category: "strategy",
    modes: ["solo", "daily"],
    estimatedMinutes: 15,
    difficulty: "intermediate",
    href: "/games/signal-hunt",
    icon: <Shield className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "proof-sprint",
    title: "Proof Sprint",
    description: "Build correct mathematical proofs under step constraints. Optimize for elegance and efficiency.",
    category: "logic",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "intermediate",
    href: "/games/proof-sprint",
    icon: <Brain className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "packet-route",
    title: "Packet Route",
    description: "Design routing policies for network topologies. Balance latency, throughput, and resilience to meet SLA targets.",
    category: "strategy",
    modes: ["solo", "daily"],
    estimatedMinutes: 15,
    difficulty: "intermediate",
    href: "/games/packet-route",
    icon: <Network className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "governance-simulator",
    title: "Governance Simulator",
    description: "Make governance decisions under uncertainty. Balance controls, incentives, and stakeholder alignment.",
    category: "educational",
    modes: ["solo", "daily"],
    estimatedMinutes: 20,
    difficulty: "advanced",
    href: "/games/governance-simulator",
    icon: <Brain className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "memory-palace",
    title: "Memory Palace",
    description: "Train your memory with proven techniques. Learn evidence-based memory methods through practice.",
    category: "educational",
    modes: ["solo", "daily"],
    estimatedMinutes: 10,
    difficulty: "foundations",
    href: "/games/memory-palace",
    icon: <BookOpen className="h-6 w-6" />,
    type: "framework",
  },
  {
    id: "allocation-architect",
    title: "Allocation Architect",
    description: "Build optimal resource allocation plans under constraints. Balance multiple objectives while managing risk events.",
    category: "strategy",
    modes: ["solo", "daily"],
    estimatedMinutes: 12,
    difficulty: "intermediate",
    href: "/games/allocation-architect",
    icon: <Target className="h-6 w-6" />,
    type: "framework",
  },
];

// Convert action games from registry
const ACTION_GAMES_PREVIEW: GamePreview[] = ACTION_GAMES.map(game => ({
  id: game.id,
  title: game.title,
  description: game.description,
  category: "action" as const,
  modes: ["solo"] as GameMode[],
  estimatedMinutes: game.minutes,
  difficulty: game.difficulty === "easy" ? "foundations" : game.difficulty === "medium" ? "intermediate" : "advanced",
  href: game.href,
  icon: <Zap className="h-6 w-6" />,
  type: "action" as const,
}));

// Convert practice games from registry
const PRACTICE_GAMES_PREVIEW: GamePreview[] = PRACTICE_GAMES.map(game => ({
  id: game.id,
  title: game.title,
  description: game.description,
  category: game.category || "practice" as const,
  modes: ["solo"] as GameMode[],
  estimatedMinutes: game.minutes,
  difficulty: game.difficulty === "easy" ? "foundations" : game.difficulty === "medium" ? "intermediate" : "advanced",
  href: game.href,
  icon: game.category === "cybersecurity" ? <Shield className="h-6 w-6" /> :
        game.category === "digitalisation" ? <Network className="h-6 w-6" /> :
        <Brain className="h-6 w-6" />,
  type: "practice" as const,
  level: game.level,
}));

// Combine all games
const ALL_GAMES: GamePreview[] = [
  ...FRAMEWORK_GAMES,
  ...ACTION_GAMES_PREVIEW,
  ...PRACTICE_GAMES_PREVIEW,
];

const CATEGORY_LABELS: Record<GameCategory | "action" | "practice", string> = {
  strategy: "Strategy",
  puzzle: "Puzzle",
  logic: "Logic",
  card: "Card",
  board: "Board",
  arcade: "Arcade",
  simulation: "Simulation",
  educational: "Educational",
  action: "Action",
  practice: "Practice",
};

const DIFFICULTY_LABELS: Record<DifficultyLevel | "easy" | "medium" | "hard", string> = {
  foundations: "Foundations",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const FAVORITES_STORAGE_KEY = "ransfordsnotes-game-favorites";

function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (stored) {
          setFavorites(new Set(JSON.parse(stored)));
        }
      } catch {
        // Ignore errors
      }
    }
  }, []);

  const toggleFavorite = (gameId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(next)));
        } catch {
          // Ignore errors
        }
      }
      return next;
    });
  };

  const isFavorite = (gameId: string) => favorites.has(gameId);

  return { favorites, toggleFavorite, isFavorite };
}

export default function GamesHubClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<GameMode | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<"all" | "framework" | "action" | "practice">("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "minutes-asc" | "minutes-desc">("name");
  const { toggleFavorite, isFavorite } = useFavorites();

  const filteredGames = useMemo(() => {
    let filtered = ALL_GAMES.filter((game) => {
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

      // Type filter
      if (selectedType !== "all" && game.type !== selectedType) {
        return false;
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

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "minutes-asc") {
      filtered.sort((a, b) => a.estimatedMinutes - b.estimatedMinutes);
    } else if (sortBy === "minutes-desc") {
      filtered.sort((a, b) => b.estimatedMinutes - a.estimatedMinutes);
    }

    return filtered;
  }, [searchQuery, selectedMode, selectedCategory, selectedDifficulty, selectedType, sortBy]);

  // Get games in progress (from localStorage if available)
  const gamesInProgress = useMemo(() => {
    // This would check localStorage for game progress
    // For now, return empty array
    return [];
  }, []);

  // Get favorite games
  const favoriteGames = useMemo(() => {
    return ALL_GAMES.filter((g) => isFavorite(g.id));
  }, [isFavorite]);

  // Get recommended games (foundations difficulty, sorted by minutes)
  const recommendedGames = useMemo(() => {
    return ALL_GAMES
      .filter((g) => g.difficulty === "foundations" || g.difficulty === "easy")
      .sort((a, b) => a.estimatedMinutes - b.estimatedMinutes)
      .slice(0, 6);
  }, []);

  const totalGames = ALL_GAMES.length;
  const totalMinutes = ALL_GAMES.reduce((sum, g) => sum + g.estimatedMinutes, 0);
  const totalHours = Math.round(totalMinutes / 60);

  const hasActiveFilters = selectedMode !== "all" || selectedCategory !== "all" || 
                          selectedDifficulty !== "all" || selectedType !== "all" || searchQuery !== "";

  const uniqueCategories = Array.from(new Set(ALL_GAMES.map(g => g.category)));

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="mb-8 space-y-5 rounded-3xl bg-gradient-to-r from-slate-50 via-sky-50/60 to-slate-50 p-8 shadow-sm ring-1 ring-slate-100">
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

        {/* Summary Statistics */}
        <section className="mt-8 rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm" aria-labelledby="games-overview-heading">
          <h2 id="games-overview-heading" className="text-lg font-semibold text-slate-900">Games overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total games</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{totalGames}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total hours</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{totalHours}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Total minutes</p>
              <p className="mt-1 text-2xl font-semibold text-slate-900">{totalMinutes}</p>
            </div>
          </div>
        </section>

        {/* Favorites Section */}
        {favoriteGames.length > 0 && (
          <section className="mt-8" aria-labelledby="favorites-heading">
            <h2 id="favorites-heading" className="text-xl font-semibold text-slate-900">Your favorites</h2>
            <p className="mt-1 text-sm text-slate-700">Games you've bookmarked</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {favoriteGames.map((game) => (
                <Link
                  key={game.id}
                  href={game.href}
                  className="group rounded-3xl border border-amber-200 bg-amber-50/30 p-5 shadow-sm transition hover:border-amber-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200 bg-amber-100 text-amber-700">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">{game.title}</p>
                        <BookmarkCheck size={14} className="text-amber-600" aria-hidden="true" />
                      </div>
                      <p className="mt-2 text-sm text-slate-700">{game.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <Clock3 size={12} className="inline" aria-hidden="true" />
                        <span>~{game.estimatedMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Games */}
        {recommendedGames.length > 0 && (
          <section className="mt-8" aria-labelledby="recommended-heading">
            <h2 id="recommended-heading" className="text-xl font-semibold text-slate-900">Recommended for you</h2>
            <p className="mt-1 text-sm text-slate-700">Start with these games</p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
              {recommendedGames.map((game) => (
                <Link
                  key={game.id}
                  href={game.href}
                  className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                      {game.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{game.title}</p>
                      <p className="mt-2 text-sm text-slate-700">{game.description}</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-slate-600">
                        <Clock3 size={12} className="inline" aria-hidden="true" />
                        <span>~{game.estimatedMinutes} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filter */}
        <section className="mt-8" aria-labelledby="all-games-heading">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="all-games-heading" className="text-2xl font-semibold text-slate-900">All games</h2>
              <p className="mt-1 text-sm text-slate-700">Browse all available games</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                type="search"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search games"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                aria-expanded={showFilters}
                aria-controls="filter-panel"
              >
                <Filter size={16} aria-hidden="true" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-slate-900 px-1.5 text-xs text-white">
                    {[selectedMode !== "all", selectedCategory !== "all", selectedDifficulty !== "all", selectedType !== "all", searchQuery !== ""].filter(Boolean).length}
                  </span>
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                aria-label="Sort games"
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                <option value="name">Sort by name</option>
                <option value="minutes-asc">Minutes (low to high)</option>
                <option value="minutes-desc">Minutes (high to low)</option>
              </select>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div
              id="filter-panel"
              className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              role="region"
              aria-labelledby="filters-heading"
            >
              <div className="flex items-center justify-between">
                <h3 id="filters-heading" className="text-sm font-semibold text-slate-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedMode("all");
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                      setSelectedType("all");
                      setSearchQuery("");
                    }}
                    className="text-xs font-semibold text-slate-700 underline hover:text-slate-900"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label htmlFor="type-filter" className="block text-xs font-semibold text-slate-700">
                    Type
                  </label>
                  <select
                    id="type-filter"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as typeof selectedType)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">All types</option>
                    <option value="framework">Framework</option>
                    <option value="action">Action</option>
                    <option value="practice">Practice</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="mode-filter" className="block text-xs font-semibold text-slate-700">
                    Mode
                  </label>
                  <select
                    id="mode-filter"
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value as GameMode | "all")}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">All modes</option>
                    <option value="solo">Solo</option>
                    <option value="multiplayer">Multiplayer</option>
                    <option value="campaign">Campaign</option>
                    <option value="daily">Daily Challenge</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category-filter" className="block text-xs font-semibold text-slate-700">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">All categories</option>
                    {uniqueCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] || cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="difficulty-filter" className="block text-xs font-semibold text-slate-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty-filter"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  >
                    <option value="all">All difficulties</option>
                    {Object.entries(DIFFICULTY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {filteredGames.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center" role="status" aria-live="polite">
              <p className="text-sm text-slate-700">No games match your filters.</p>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedMode("all");
                    setSelectedCategory("all");
                    setSelectedDifficulty("all");
                    setSelectedType("all");
                  }}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline hover:text-slate-700"
                >
                  <X size={16} aria-hidden="true" />
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {filteredGames.map((game) => (
                <article
                  key={game.id}
                  className="group rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md"
                  aria-labelledby={`game-title-${game.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                      {game.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 id={`game-title-${game.id}`} className="text-sm font-semibold text-slate-900">
                          {game.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              toggleFavorite(game.id);
                            }}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                            aria-label={isFavorite(game.id) ? `Remove ${game.title} from favorites` : `Add ${game.title} to favorites`}
                          >
                            {isFavorite(game.id) ? (
                              <BookmarkCheck size={16} className="text-amber-600" aria-hidden="true" />
                            ) : (
                              <Bookmark size={16} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-slate-700 line-clamp-2">{game.description}</p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                      {CATEGORY_LABELS[game.category as keyof typeof CATEGORY_LABELS] || game.category}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-700">
                      {DIFFICULTY_LABELS[game.difficulty as keyof typeof DIFFICULTY_LABELS] || game.difficulty}
                    </span>
                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-emerald-700">
                      <Clock3 size={12} className="mr-1 inline" aria-hidden="true" />
                      ~{game.estimatedMinutes} min
                    </span>
                    {game.modes.includes("multiplayer") && (
                      <span className="rounded-full bg-green-100 px-2 py-1 text-green-700 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        Multiplayer
                      </span>
                    )}
                    {game.modes.includes("daily") && (
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700">
                        Daily
                      </span>
                    )}
                    {game.level && (
                      <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700">
                        {game.level}
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <Link
                      href={game.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:underline focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      aria-label={`Play ${game.title}`}
                    >
                      <PlayCircle size={16} aria-hidden="true" />
                      Play
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

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
