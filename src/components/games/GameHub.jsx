"use client";

import { getPracticeGamesByCategory } from "@/lib/games-registry";
import GameCard from "./GameCard";
import TrustBoundaryGame from "./TrustBoundaryGame";
import RiskTradeoffGame from "./RiskTradeoffGame";
import SignalVsNoiseGame from "./SignalVsNoiseGame";

export default function GameHub() {
  const games = getPracticeGamesByCategory("cybersecurity");
  const componentsById = {
    "trust-boundaries": <TrustBoundaryGame />,
    "risk-trade-offs": <RiskTradeoffGame />,
    "signals-and-noise": <SignalVsNoiseGame />,
  };

  return (
    <div className="rn-game-hub">
      {games.map((g) => (
        <GameCard key={g.id} title={g.title} description={g.description} meta={{ level: g.level, minutes: g.minutes }}>
          {componentsById[g.id] || null}
        </GameCard>
      ))}
    </div>
  );
}
