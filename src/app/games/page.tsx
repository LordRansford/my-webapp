import GamesPageClient from "./GamesPage.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Action Games | Canvas-based Offline Games",
  description: "Canvas-based action games. Offline-first PWA games with arrow keys and swipe support. Perfect for practicing on the go.",
  keywords: ["action games", "canvas games", "offline games", "PWA games", "mobile games"],
  openGraph: {
    title: "Action Games | Canvas-based Offline Games",
    description: "Canvas-based action games. Offline-first PWA games with arrow keys and swipe support.",
    type: "website",
    url: "/games",
  },
  twitter: {
    card: "summary_large_image",
    title: "Action Games | Canvas-based Offline Games",
    description: "Canvas-based action games. Offline-first PWA games with arrow keys and swipe support.",
  },
  alternates: {
    canonical: "/games",
  },
};

export default function GamesHubPage() {
  return (
    <GameHubTemplate>
      <GamesPageClient />
    </GameHubTemplate>
  );
}


