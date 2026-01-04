"use client";

import { getPracticeGamesByCategory } from "@/lib/games-registry";
import GameCard from "./GameCard";
import VisionGame from "./VisionGame";
import MaturityGame from "./MaturityGame";
import DigitalTradeoffGame from "./DigitalTradeoffGame";
import EcosystemGame from "./EcosystemGame";
import RoadmapSprintGame from "./RoadmapSprintGame";

export default function DigitalisationGameHub() {
  const games = getPracticeGamesByCategory("digitalisation");
  const componentsById = {
    "vision-and-value": <VisionGame />,
    "maturity-and-readiness": <MaturityGame />,
    "trade-offs-and-constraints": <DigitalTradeoffGame />,
    "ecosystems-and-trust": <EcosystemGame />,
    "roadmap-sprint": <RoadmapSprintGame />,
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
