import GamesPageClient from "./GamesPage.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Games",
  description: "Canvas-based action games. Offline-first PWA games with arrow keys and swipe support.",
};

export default function GamesHubPage() {
  return (
    <GameHubTemplate>
      <GamesPageClient />
    </GameHubTemplate>
  );
}


