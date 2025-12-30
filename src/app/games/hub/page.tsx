import GamesHubClient from "./GamesHub.client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Games Hub | Ransford's Notes",
  description: "Unified games platform with strategy, puzzle, logic, and educational games. Single-player and async multiplayer modes.",
  keywords: ["games", "strategy games", "puzzle games", "educational games", "multiplayer games", "offline games", "browser games"],
  openGraph: {
    title: "Games Hub | Ransford's Notes",
    description: "Premium games for learning, strategy, and skill development.",
    type: "website",
    url: "/games/hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Games Hub | Ransford's Notes",
    description: "Premium games for learning, strategy, and skill development.",
  },
  alternates: {
    canonical: "/games/hub",
  },
};

export default function GamesHubPage() {
  return <GamesHubClient />;
}
