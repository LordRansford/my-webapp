"use client";

import SystemsMastery from "@/lib/games/games/systems-mastery/SystemsMastery";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function SystemsMasteryPage() {
  return (
    <GameErrorBoundary gameName="Systems Mastery Game">
      <SystemsMastery />
    </GameErrorBoundary>
  );
}
