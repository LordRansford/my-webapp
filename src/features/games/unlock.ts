import { createGamesProgressStore } from "@/games/progress";
import { PersistStore } from "@/games/engine/persist";

export type UnlockState = {
  playerOneUnlocked: boolean;
  dailyChallengesCompleted: number;
  nearPerfectRun: boolean;
  devRoomUnlocked: boolean;
};

export function getUnlockState(store: PersistStore): UnlockState {
  const p = createGamesProgressStore(store).get();
  const progress = createGamesProgressStore(store);
  return {
    playerOneUnlocked: Boolean(p.charisTrophyUnlocked),
    dailyChallengesCompleted: progress.getDailyCompletedCount(),
    nearPerfectRun: Boolean(p.nearPerfectRunDetected),
    devRoomUnlocked: Boolean(p.devRoomUnlocked),
  };
}

export function evaluateDevRoomUnlock(state: UnlockState) {
  return state.playerOneUnlocked && state.dailyChallengesCompleted >= 7 && state.nearPerfectRun;
}


