import { PersistStore } from "@/games/engine/persist";

export type GamesStorage = {
  store: PersistStore;
  getMuted: () => boolean;
  setMuted: (v: boolean) => void;
  getBest: (gameId: string) => number | null;
  setBest: (gameId: string, value: number) => void;
};

const PREFIX = "rn_games_v1";

export function createGamesStorage(): GamesStorage {
  const store = new PersistStore({ prefix: PREFIX, version: "v1" });

  const getMuted = () => store.get("muted", true); // default muted until user interacts
  const setMuted = (v: boolean) => store.set("muted", Boolean(v));

  const bestKey = (id: string) => `best:${id}`;
  const getBest = (id: string) => store.get(bestKey(id), null as any);
  const setBest = (id: string, v: number) => {
    if (!Number.isFinite(v)) return;
    const prev = getBest(id);
    if (prev == null || v > prev) store.set(bestKey(id), v);
  };

  return { store, getMuted, setMuted, getBest, setBest };
}


