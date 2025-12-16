"use client";

import GameCard from "./GameCard";
import TrustBoundaryGame from "./TrustBoundaryGame";
import RiskTradeoffGame from "./RiskTradeoffGame";
import SignalVsNoiseGame from "./SignalVsNoiseGame";

export default function GameHub() {
  return (
    <div className="rn-game-hub">
      <GameCard title="Trust boundaries" description="Decide where trust should end and why. Most breaches begin with a boundary assumed but never defined.">
        <TrustBoundaryGame />
      </GameCard>

      <GameCard title="Risk trade offs" description="Choose controls under constraints. You cannot fix everything. Learn to prioritise.">
        <RiskTradeoffGame />
      </GameCard>

      <GameCard title="Signals and noise" description="Separate weak signals from background noise. Detection is a thinking problem, not a tooling problem.">
        <SignalVsNoiseGame />
      </GameCard>
    </div>
  );
}
