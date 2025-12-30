"use client";

import Hex from "@/lib/games/games/hex/Hex";
import { GameErrorBoundary } from "@/lib/games/framework/GameErrorBoundary";

export default function HexPage() {
  return (
    <GameErrorBoundary gameName="Hex">
      <Hex />
    </GameErrorBoundary>
  );
}
