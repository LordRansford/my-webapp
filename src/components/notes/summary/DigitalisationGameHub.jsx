"use client";

import GameHub from "@/components/GameHub";
import DigiConceptMatchGame from "@/components/games/digitalisation/DigiConceptMatchGame";
import ValueChainBuilderGame from "@/components/games/digitalisation/ValueChainBuilderGame";
import OperatingModelDesignerGame from "@/components/games/digitalisation/OperatingModelDesignerGame";
import MaturityPathGame from "@/components/games/digitalisation/MaturityPathGame";
import DigiQuickFireQuizGame from "@/components/games/digitalisation/DigiQuickFireQuizGame";

const games = [
  {
    id: "dig-concepts",
    title: "Digitalisation concept match",
    summary: "Match plain language descriptions to the terms that show up in real programmes.",
    level: "Core",
    minutes: 6,
    component: <DigiConceptMatchGame />,
  },
  {
    id: "dig-value-chain",
    title: "Digital value chain builder",
    summary: "Reorder the value chain and see where value is created or lost.",
    level: "Stretch",
    minutes: 7,
    component: <ValueChainBuilderGame />,
  },
  {
    id: "dig-operating-model",
    title: "Operating model designer",
    summary: "Choose where responsibilities sit and review the strengths and risks.",
    level: "Core",
    minutes: 7,
    component: <OperatingModelDesignerGame />,
  },
  {
    id: "dig-maturity-path",
    title: "Digital maturity path",
    summary: "Step through maturity signals and pick practical next actions.",
    level: "Warm up",
    minutes: 5,
    component: <MaturityPathGame />,
  },
  {
    id: "dig-quick-fire",
    title: "Quick fire quiz",
    summary: "Ten short questions across beginner, intermediate, and advanced thinking.",
    level: "Core",
    minutes: 6,
    component: <DigiQuickFireQuizGame />,
  },
];

export default function DigitalisationGameHub() {
  return (
    <GameHub
      storageKey="rn_digitalisation_summary_games"
      title="Games"
      subtitle="Fast drills that turn definitions into decisions."
      games={games}
    />
  );
}

