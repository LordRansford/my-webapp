"use client";

import DailyLogicGauntletEnhanced from "@/lib/games/games/daily-logic-gauntlet/DailyLogicGauntletEnhanced";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function DailyLogicGauntletPage() {
  return (
    <GameErrorBoundary gameName="Daily Logic Gauntlet">
      <DailyLogicGauntletEnhanced />
    </GameErrorBoundary>
  );
}
