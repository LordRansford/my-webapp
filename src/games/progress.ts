import { PersistStore } from "@/games/engine/persist";
import { utcDateId } from "@/games/seed";

export type DailyHistoryEntry = {
  attempted: boolean;
  completed: boolean;
  completedAtMs?: number;
};

export type GamesProgress = {
  // achievements
  charisTrophyUnlocked: boolean;
  charisTrophyProgress: number;
  nearPerfectRunDetected: boolean;
  devRoomUnlocked: boolean;
  devRoomEndSeen: boolean;
  // daily
  dailyHistory: Record<string, DailyHistoryEntry>;
  // best runs
  bestPlayerOneMs: number | null;
};

const DEFAULT: GamesProgress = {
  charisTrophyUnlocked: false,
  charisTrophyProgress: 0,
  nearPerfectRunDetected: false,
  devRoomUnlocked: false,
  devRoomEndSeen: false,
  dailyHistory: {},
  bestPlayerOneMs: null,
};

const KEY = "progress";
const TROPHY_TARGET = 5;
const DEVROOM_DAILY_TARGET = 7;

function countDailyCompleted(p: GamesProgress) {
  return Object.values(p.dailyHistory).filter((x) => x?.completed).length;
}

export function createGamesProgressStore(store: PersistStore) {
  const read = (): GamesProgress => store.get(KEY, DEFAULT);
  const write = (next: GamesProgress) => store.set(KEY, next);

  const get = () => read();

  const getDaily = (dateId = utcDateId()): DailyHistoryEntry => {
    const p = read();
    return p.dailyHistory[dateId] ?? { attempted: false, completed: false };
  };

  const markDailyAttempted = (dateId = utcDateId()) => {
    const p = read();
    const prev = p.dailyHistory[dateId] ?? { attempted: false, completed: false };
    p.dailyHistory[dateId] = { ...prev, attempted: true };
    write({ ...p });
  };

  const markDailyCompleted = (dateId = utcDateId(), completedAtMs?: number) => {
    const p = read();
    const prev = p.dailyHistory[dateId] ?? { attempted: false, completed: false };
    p.dailyHistory[dateId] = { ...prev, attempted: true, completed: true, completedAtMs: completedAtMs ?? Date.now() };

    if (!p.charisTrophyUnlocked) {
      const nextProgress = Math.min(TROPHY_TARGET, (p.charisTrophyProgress ?? 0) + 1);
      p.charisTrophyProgress = nextProgress;
      if (nextProgress >= TROPHY_TARGET) p.charisTrophyUnlocked = true;
    }

    write({ ...p });
  };

  const setBestPlayerOneMs = (ms: number) => {
    const p = read();
    const prev = p.bestPlayerOneMs;
    if (prev == null || ms > prev) {
      p.bestPlayerOneMs = ms;
      write({ ...p });
    }
  };

  const markNearPerfectRunDetected = () => {
    const p = read();
    if (!p.nearPerfectRunDetected) {
      p.nearPerfectRunDetected = true;
      write({ ...p });
    }
  };

  const tryUnlockDevRoom = () => {
    const p = read();
    if (p.devRoomUnlocked) return true;
    const dailyCompleted = countDailyCompleted(p);
    const ok = Boolean(p.charisTrophyUnlocked) && dailyCompleted >= DEVROOM_DAILY_TARGET && Boolean(p.nearPerfectRunDetected);
    if (ok) {
      p.devRoomUnlocked = true;
      write({ ...p });
      return true;
    }
    return false;
  };

  const getDailyCompletedCount = () => countDailyCompleted(read());

  const markDevRoomEndSeen = () => {
    const p = read();
    if (!p.devRoomEndSeen) {
      p.devRoomEndSeen = true;
      write({ ...p });
    }
  };

  return {
    get,
    getDaily,
    markDailyAttempted,
    markDailyCompleted,
    setBestPlayerOneMs,
    markNearPerfectRunDetected,
    tryUnlockDevRoom,
    getDailyCompletedCount,
    markDevRoomEndSeen,
    TROPHY_TARGET,
    DEVROOM_DAILY_TARGET,
  };
}


