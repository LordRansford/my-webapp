// Mission system types for the 12-level campaign

export type MissionId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type MissionStatus = "locked" | "available" | "in-progress" | "completed";

export type StarRating = 0 | 1 | 2 | 3;

export type MissionObjective = {
  id: string;
  description: string;
  type: "survive" | "collect" | "combo" | "perfect" | "time";
  target: number;
  completed: boolean;
};

export type SideQuest = {
  id: string;
  description: string;
  reward: number;
  completed: boolean;
  type?: "survive" | "collect" | "combo" | "perfect" | "time";
  target?: number;
};

export type MissionDefinition = {
  id: MissionId;
  title: string;
  description: string;
  briefing: string;
  durationMs: number; // ~5 minutes = 300000ms
  objectives: MissionObjective[];
  sideQuests: SideQuest[];
  difficulty: number; // 0-1 scale
  unlockRequirement?: MissionId; // Previous mission that must be completed
};

export type MissionProgress = {
  missionId: MissionId;
  status: MissionStatus;
  stars: StarRating;
  bestTimeMs?: number;
  objectivesCompleted: string[];
  sideQuestsCompleted: string[];
  attempts: number;
  completedAt?: number;
};

export type CampaignProgress = {
  currentMission: MissionId;
  missions: Record<MissionId, MissionProgress>;
  totalStars: number;
  totalPoints: number;
  badges: string[];
};

