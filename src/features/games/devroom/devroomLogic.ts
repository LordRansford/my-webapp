import { createGamesProgressStore } from "@/games/progress";
import { PersistStore } from "@/games/engine/persist";

export function canEnterDevRoom(store: PersistStore) {
  const p = createGamesProgressStore(store);
  return p.tryUnlockDevRoom();
}


