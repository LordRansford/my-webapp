import PracticeGamesPageClient from "./PracticeGamesPage.client";
import { GameHubTemplate } from "@/components/templates/PageTemplates";

export const metadata = {
  title: "Practice Games",
  description: "Interactive drills from across the site to reinforce learning. Build skills through hands-on practice.",
};

export default function PracticeGamesPage() {
  return (
    <GameHubTemplate>
      <PracticeGamesPageClient />
    </GameHubTemplate>
  );
}

