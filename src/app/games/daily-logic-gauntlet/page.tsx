"use client";

import DailyLogicGauntlet from "@/lib/games/games/daily-logic-gauntlet/DailyLogicGauntlet";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function DailyLogicGauntletPage() {
  return (
    <GameErrorBoundary gameName="Daily Logic Gauntlet">
      <DailyLogicGauntlet />
    </GameErrorBoundary>
  );
}
