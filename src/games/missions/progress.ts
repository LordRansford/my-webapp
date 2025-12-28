import { PersistStore } from "@/games/engine/persist";
import type { CampaignProgress, MissionId, MissionProgress, MissionStatus, StarRating } from "./types";
import { MISSION_DEFINITIONS } from "./definitions";

const DEFAULT_CAMPAIGN: CampaignProgress = {
  currentMission: 1,
  missions: {} as Record<MissionId, MissionProgress>,
  totalStars: 0,
  totalPoints: 0,
  badges: [],
};

const KEY = "campaign_progress";

export function createCampaignProgressStore(store: PersistStore) {
  const read = (): CampaignProgress => {
    const stored = store.get(KEY, DEFAULT_CAMPAIGN);
    // Ensure all missions have progress entries
    const missions: Record<MissionId, MissionProgress> = { ...(stored.missions || {}) } as Record<MissionId, MissionProgress>;
    for (const def of MISSION_DEFINITIONS) {
      if (!missions[def.id]) {
        missions[def.id] = {
          missionId: def.id,
          status: def.id === 1 ? "available" : "locked",
          stars: 0,
          objectivesCompleted: [],
          sideQuestsCompleted: [],
          attempts: 0,
        };
      }
    }
    return { ...stored, missions };
  };

  const write = (progress: CampaignProgress) => {
    store.set(KEY, progress);
  };

  const get = () => read();

  const getMissionProgress = (missionId: MissionId): MissionProgress => {
    const p = read();
    return p.missions[missionId] ?? {
      missionId,
      status: missionId === 1 ? "available" : "locked",
      stars: 0,
      objectivesCompleted: [],
      sideQuestsCompleted: [],
      attempts: 0,
    };
  };

  const updateMissionStatus = (missionId: MissionId, status: MissionStatus) => {
    const p = read();
    const mission = p.missions[missionId];
    if (mission) {
      mission.status = status;
      write(p);
    }
  };

  const completeMission = (
    missionId: MissionId,
    stars: StarRating,
    objectivesCompleted: string[],
    sideQuestsCompleted: string[],
    timeMs: number
  ) => {
    const p = read();
    const mission = p.missions[missionId];
    if (mission) {
      mission.status = "completed";
      mission.stars = Math.max(mission.stars, stars) as StarRating;
      if (!mission.bestTimeMs || timeMs < mission.bestTimeMs) {
        mission.bestTimeMs = timeMs;
      }
      mission.objectivesCompleted = [...new Set([...mission.objectivesCompleted, ...objectivesCompleted])];
      mission.sideQuestsCompleted = [...new Set([...mission.sideQuestsCompleted, ...sideQuestsCompleted])];
      mission.completedAt = Date.now();

      // Update totals
      p.totalStars = Object.values(p.missions).reduce((sum, m) => sum + m.stars, 0);
      
      // Unlock next mission
      const nextId = (missionId + 1) as MissionId;
      if (nextId <= 12 && p.missions[nextId]) {
        p.missions[nextId].status = "available";
      }

      // Update current mission if needed
      if (nextId <= 12 && p.currentMission < nextId) {
        p.currentMission = nextId;
      }

      write(p);
    }
  };

  const incrementAttempts = (missionId: MissionId) => {
    const p = read();
    const mission = p.missions[missionId];
    if (mission) {
      mission.attempts += 1;
      write(p);
    }
  };

  const addPoints = (points: number) => {
    const p = read();
    p.totalPoints += points;
    write(p);
  };

  const addBadge = (badgeId: string) => {
    const p = read();
    if (!p.badges.includes(badgeId)) {
      p.badges.push(badgeId);
      write(p);
    }
  };

  return {
    get,
    getMissionProgress,
    updateMissionStatus,
    completeMission,
    incrementAttempts,
    addPoints,
    addBadge,
  };
}

