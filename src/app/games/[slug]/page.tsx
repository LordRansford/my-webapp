/**
 * Dynamic game route handler
 * 
 * Provides a unified route for all games with proper error boundaries
 * and metadata handling
 */

"use client";

import { notFound, useParams } from "next/navigation";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// Game registry - maps slug to component
const GAME_REGISTRY: Record<
  string,
  {
    component: () => Promise<{ default: React.ComponentType }>;
    metadata: {
      title: string;
      description: string;
      keywords?: string[];
      openGraph?: {
        title: string;
        description: string;
        type: string;
      };
    };
  }
> = {
  "daily-logic-gauntlet": {
    component: () => import("@/lib/games/games/daily-logic-gauntlet/DailyLogicGauntletEnhanced"),
    metadata: {
      title: "Daily Logic Gauntlet | Games",
      description: "Multi-puzzle challenge with daily seeded challenges. Same seed for all users on the same day.",
      keywords: ["logic", "puzzle", "daily challenge", "brain training"],
      openGraph: {
        title: "Daily Logic Gauntlet",
        description: "Test your logical reasoning with daily puzzles.",
        type: "website",
      },
    },
  },
  "grid-racer": {
    component: () => import("@/lib/games/games/grid-racer/GridRacer"),
    metadata: {
      title: "Grid Racer Time Trial | Games",
      description: "Time trial racing with customizable loadouts. Navigate through obstacles and beat your best time.",
      keywords: ["racing", "arcade", "time trial", "obstacle course"],
      openGraph: {
        title: "Grid Racer Time Trial",
        description: "Navigate through obstacles and beat your best time.",
        type: "website",
      },
    },
  },
  "draft-duel": {
    component: () => import("@/lib/games/games/draft-duel/DraftDuel"),
    metadata: {
      title: "Draft Duel Card Battler | Games",
      description: "Strategic card game with drafting mechanics. Build your deck and battle opponents.",
      keywords: ["card game", "strategy", "deck building", "multiplayer"],
      openGraph: {
        title: "Draft Duel Card Battler",
        description: "Build your deck and battle opponents in strategic card battles.",
        type: "website",
      },
    },
  },
  hex: {
    component: () => import("@/lib/games/games/hex/Hex"),
    metadata: {
      title: "Hex | Games",
      description: "Classic connection game on hexagonal board. Connect your sides to win.",
      keywords: ["hex", "board game", "strategy", "connection game"],
      openGraph: {
        title: "Hex",
        description: "Classic connection game on hexagonal board.",
        type: "website",
      },
    },
  },
  "systems-mastery": {
    component: () => import("@/lib/games/games/systems-mastery/SystemsMastery"),
    metadata: {
      title: "Systems Mastery Game | Games",
      description: "Flagship game for understanding complex systems. Learn systems thinking through interactive scenarios.",
      keywords: ["systems thinking", "education", "simulation", "learning"],
      openGraph: {
        title: "Systems Mastery Game",
        description: "Learn systems thinking through interactive scenarios.",
        type: "website",
      },
    },
  },
  "constraint-optimizer": {
    component: () => import("@/lib/games/games/constraint-optimizer/ConstraintOptimizer"),
    metadata: {
      title: "Constraint Optimizer | Games",
      description: "Optimize resource allocation under constraints. Balance multiple objectives for maximum efficiency.",
      keywords: ["optimization", "constraints", "puzzle", "daily challenge"],
      openGraph: {
        title: "Constraint Optimizer",
        description: "Optimize resource allocation under constraints.",
        type: "website",
      },
    },
  },
  "pattern-architect": {
    component: () => import("@/lib/games/games/pattern-architect/PatternArchitect"),
    metadata: {
      title: "Pattern Architect | Games",
      description: "Create beautiful symmetric patterns. Build visual patterns following rules and symmetry requirements.",
      keywords: ["pattern", "symmetry", "visual", "puzzle", "daily challenge"],
      openGraph: {
        title: "Pattern Architect",
        description: "Create beautiful symmetric patterns.",
        type: "website",
      },
    },
  },
  "deduction-grid": {
    component: () => import("@/lib/games/games/deduction-grid/DeductionGrid"),
    metadata: {
      title: "Deduction Grid | Games",
      description: "Solve logic grid puzzles using deduction. Build logical inference chains from clues.",
      keywords: ["logic", "deduction", "puzzle", "daily challenge"],
      openGraph: {
        title: "Deduction Grid",
        description: "Solve logic grid puzzles using deduction.",
        type: "website",
      },
    },
  },
  "flow-planner": {
    component: () => import("@/lib/games/games/flow-planner/FlowPlanner"),
    metadata: {
      title: "Flow Planner | Games",
      description: "Optimize flow through networks. Plan resource flows and manage dependencies.",
      keywords: ["optimization", "flow", "network", "strategy", "daily challenge"],
      openGraph: {
        title: "Flow Planner",
        description: "Optimize flow through networks.",
        type: "website",
      },
    },
  },
  "memory-palace": {
    component: () => import("@/lib/games/games/memory-palace/MemoryPalace"),
    metadata: {
      title: "Memory Palace | Games",
      description: "Train your memory with proven techniques. Learn evidence-based memory methods through practice.",
      keywords: ["memory", "learning", "training", "educational", "daily challenge"],
      openGraph: {
        title: "Memory Palace",
        description: "Train your memory with proven techniques.",
        type: "website",
      },
    },
  },
  "allocation-architect": {
    component: () => import("@/lib/games/games/allocation-architect/AllocationArchitect"),
    metadata: {
      title: "Allocation Architect | Games",
      description: "Build optimal resource allocation plans under constraints. Balance multiple objectives while managing risk events.",
      keywords: ["allocation", "optimization", "strategy", "planning", "daily challenge"],
      openGraph: {
        title: "Allocation Architect",
        description: "Build optimal resource allocation plans under constraints.",
        type: "website",
      },
    },
  },
};

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
          role="status"
          aria-label="Loading game"
        >
          <span className="sr-only">Loading game...</span>
        </div>
        <p className="mt-4 text-slate-600">Loading game...</p>
      </div>
    </div>
  );
}

export default function GamePage() {
  const params = useParams();
  const slug = params?.slug as string;

  if (!slug) {
    notFound();
  }

  const game = GAME_REGISTRY[slug];
  if (!game) {
    notFound();
  }

  const GameComponent = dynamic(() => game.component(), {
    loading: LoadingFallback,
    ssr: false,
  });

  const gameName = game.metadata.title || "Game";

  return (
    <GameErrorBoundary gameName={gameName}>
      <Suspense fallback={<LoadingFallback />}>
        <GameComponent />
      </Suspense>
    </GameErrorBoundary>
  );
}
