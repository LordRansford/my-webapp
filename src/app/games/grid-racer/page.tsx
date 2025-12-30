"use client";

import GridRacer from "@/lib/games/games/grid-racer/GridRacer";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function GridRacerPage() {
  return (
    <GameErrorBoundary gameName="Grid Racer Time Trial">
      <GridRacer />
    </GameErrorBoundary>
  );
}
