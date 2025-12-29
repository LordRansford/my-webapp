import PracticeGamesPageClient from "./PracticeGamesPage.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Games | Interactive Learning Drills",
  description: "Interactive drills from across the site to reinforce learning. Build skills through hands-on practice with cybersecurity, digitalisation, data, software architecture, and cross-topic games.",
  keywords: ["practice games", "interactive learning", "cybersecurity games", "digitalisation games", "data games", "software architecture games", "educational games"],
  openGraph: {
    title: "Practice Games | Interactive Learning Drills",
    description: "Interactive drills from across the site to reinforce learning. Build skills through hands-on practice.",
    type: "website",
    url: "/practice",
  },
  twitter: {
    card: "summary_large_image",
    title: "Practice Games | Interactive Learning Drills",
    description: "Interactive drills from across the site to reinforce learning. Build skills through hands-on practice.",
  },
  alternates: {
    canonical: "/practice",
  },
};

export default function PracticeGamesPage() {
  return (
    <GameHubTemplate>
      <PracticeGamesPageClient />
    </GameHubTemplate>
  );
}

