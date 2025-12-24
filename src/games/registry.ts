import type { GameScene } from "@/games/engine/types";
import { createDemoScene } from "@/games/scenes/demoScene";
import { createDailyChallengeScene } from "@/games/scenes/dailyChallengeScene";
import { createPlayerOneScene } from "@/games/scenes/playerOneScene";
import { createDevRoomScene } from "@/games/scenes/devRoomScene";
import { GAMES_BLURBS, GAMES_COPY } from "@/games/dedication";

export type GameId = "pulse-runner" | "skyline-drift" | "vault-circuit" | "daily" | "player-one" | "dev-room";

export type GameMeta = {
  id: GameId;
  title: string;
  blurb: string;
  difficulty: "Easy" | "Normal" | "Hard" | "Daily" | "Locked";
  hidden?: boolean;
  requiresCharisTrophy?: boolean;
  requiresDevRoomUnlock?: boolean;
  scene: () => GameScene;
};

export const GAMES: GameMeta[] = [
  {
    id: "pulse-runner",
    title: "Pulse Runner",
    difficulty: "Easy",
    blurb: GAMES_BLURBS.pulseRunner,
    scene: () => createDemoScene(),
  },
  {
    id: "skyline-drift",
    title: "Skyline Drift",
    difficulty: "Normal",
    blurb: GAMES_BLURBS.skylineDrift,
    scene: () => createDemoScene(),
  },
  {
    id: "vault-circuit",
    title: "Vault Circuit",
    difficulty: "Hard",
    blurb: GAMES_BLURBS.vaultCircuit,
    scene: () => createDemoScene(),
  },
  {
    id: "daily",
    title: GAMES_COPY.dailyChallengeTitle,
    difficulty: "Daily",
    blurb: GAMES_BLURBS.daily,
    scene: () => createDailyChallengeScene(),
  },
  {
    id: "player-one",
    title: GAMES_COPY.playerOneTitle,
    difficulty: "Locked",
    blurb: GAMES_BLURBS.playerOne,
    hidden: true,
    requiresCharisTrophy: true,
    scene: () => createPlayerOneScene(),
  },
  {
    id: "dev-room",
    title: GAMES_COPY.devRoomTitle,
    difficulty: "Locked",
    blurb: GAMES_BLURBS.devRoom,
    hidden: true,
    requiresDevRoomUnlock: true,
    scene: () => createDevRoomScene(),
  },
];

export function getGameMeta(id: string): GameMeta | null {
  const found = GAMES.find((g) => g.id === id);
  return found ?? null;
}


