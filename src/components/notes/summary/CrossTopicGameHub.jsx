"use client";

import GameHub from "@/components/GameHub";
import HallucinationTrustGame from "@/tools/cross/HallucinationTrustGame";
import AutonomousDefenceSimulator from "@/tools/cross/AutonomousDefenceSimulator";

const games = [
  {
    id: "hallucination_trust",
    title: "The Confident Hallucination",
    level: "Core",
    minutes: 6,
    summary: "Decide whether to trust or verify a fluent but wrong answer.",
    component: <HallucinationTrustGame storageKey="cross_game_hallucination_trust" />,
  },
  {
    id: "autonomous_defence",
    title: "The Automated Defender",
    level: "Stretch",
    minutes: 7,
    summary: "Automation overreacts or underreacts. You choose the policy and see the impact.",
    component: <AutonomousDefenceSimulator storageKey="cross_game_autonomous_defence" />,
  },
];

export default function CrossTopicGameHub() {
  return <GameHub storageKey="cross_domain_games" title={null} subtitle={null} games={games} />;
}

