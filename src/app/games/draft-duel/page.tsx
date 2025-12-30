"use client";

import DraftDuel from "@/lib/games/games/draft-duel/DraftDuel";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function DraftDuelPage() {
  return (
    <GameErrorBoundary gameName="Draft Duel Card Battler">
      <DraftDuel />
    </GameErrorBoundary>
  );
}
