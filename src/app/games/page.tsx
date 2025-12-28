import GamesPageClient from "./GamesPage.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Games",
  description: "Offline-friendly mini games. Load once, then play offline. Arrow keys and swipe gestures supported.",
};

export default function GamesHubPage() {
  return (
    <GameHubTemplate>
      <GamesPageClient />
    </GameHubTemplate>
  );
}


