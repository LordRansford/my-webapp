export type GameId = "pulse-runner" | "skyline-drift" | "vault-circuit" | "daily" | "player-one" | "dev-room";

export type InputEventType = "move" | "action";
export type ErrorEventType = "collision" | "timeout" | "other";

export type InputEvent = {
  tMs: number;
  type: InputEventType;
  payload?: any;
};

export type ErrorEvent = {
  tMs: number;
  type: ErrorEventType;
};

export type RunData = {
  gameId: GameId;
  startedAtMs: number;
  endedAtMs: number;
  durationMs: number;
  maxDifficultyReached: number; // 0..1 (normalized)
  score?: number;
  inputs: InputEvent[];
  errors: ErrorEvent[];
  nearFailCount?: number;
};

export type Metrics = {
  durationMs: number;
  maxDifficultyReached: number;
  reactionVarianceMs: number | null;
  overcorrectionIndex: number;
  fatigueDrop: number | null; // positive means worse later
  errorClustering: number; // 0..1
  consistencyScore: number; // 0..100
  controlScore: number; // 0..100
  enduranceScore: number; // 0..100
};

export type Coaching = {
  headline: string;
  insights: string[];
  tip: string;
};


