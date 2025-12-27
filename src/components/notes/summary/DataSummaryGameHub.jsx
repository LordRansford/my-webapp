"use client";

import GameHub from "@/components/GameHub";
import DistributionExplorerTool from "@/components/notes/tools/data/advanced/DistributionExplorerTool";
import SamplingBiasSimulatorTool from "@/components/notes/tools/data/advanced/SamplingBiasSimulatorTool";
import EthicsScenarioTool from "@/components/notes/tools/data/foundations/EthicsScenarioTool";
import CorrelationMythsGame from "@/components/notes/tools/data/summary/CorrelationMythsGame";

const games = [
  {
    id: "data-average-trap",
    title: "The average trap",
    summary: "Spot when an average hides extremes or long tails.",
    level: "Core",
    minutes: 6,
    component: <DistributionExplorerTool />,
  },
  {
    id: "data-correlation-myths",
    title: "Correlation myths",
    summary: "Decide if pairs of events are related or just moving together by chance.",
    level: "Core",
    minutes: 6,
    component: <CorrelationMythsGame />,
  },
  {
    id: "data-sampling-lottery",
    title: "The sampling lottery",
    summary: "See how small or biased samples mislead, and how fair samples change the story.",
    level: "Stretch",
    minutes: 7,
    component: <SamplingBiasSimulatorTool />,
  },
  {
    id: "data-bias-blindspots",
    title: "Bias blind spots",
    summary: "Practice everyday data ethics decisions with realistic scenarios.",
    level: "Warm up",
    minutes: 5,
    component: <EthicsScenarioTool />,
  },
];

export default function DataSummaryGameHub() {
  return (
    <GameHub
      storageKey="rn_data_summary_games"
      title="Games"
      subtitle="Short practice rounds that build better instincts."
      games={games}
    />
  );
}

