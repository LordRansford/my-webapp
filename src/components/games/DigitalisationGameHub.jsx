"use client";

import GameCard from "./GameCard";
import VisionGame from "./VisionGame";
import MaturityGame from "./MaturityGame";
import DigitalTradeoffGame from "./DigitalTradeoffGame";
import EcosystemGame from "./EcosystemGame";
import RoadmapSprintGame from "./RoadmapSprintGame";

export default function DigitalisationGameHub() {
  return (
    <div className="rn-game-hub">
      <GameCard title="Vision and value" description="Connect a simple digital vision to outcomes and evidence of success.">
        <VisionGame />
      </GameCard>
      <GameCard title="Maturity and readiness" description="Place an organisation on a maturity scale and see what breaks when you jump too far.">
        <MaturityGame />
      </GameCard>
      <GameCard title="Trade offs and constraints" description="Balance ambition, risk, cost, and capacity for a small set of initiatives.">
        <DigitalTradeoffGame />
      </GameCard>
      <GameCard title="Ecosystems and trust" description="Make decisions in a shared ecosystem and watch trust and resilience move.">
        <EcosystemGame />
      </GameCard>
      <GameCard title="Roadmap sprint" description="Plan a three year roadmap quickly and see where you over or under invest.">
        <RoadmapSprintGame />
      </GameCard>
    </div>
  );
}
