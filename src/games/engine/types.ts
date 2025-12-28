export type Vec2 = { x: number; y: number };

export type GameSettings = {
  muted: boolean;
  reduceMotion: boolean;
  highContrast?: boolean; // High contrast mode for games (default: true)
};

export type InputState = {
  // -1..1 axes for continuous movement
  moveX: number;
  moveY: number;
  // discrete actions
  pausePressed: boolean;
  actionPressed: boolean;
};

export type GameContext = {
  nowMs: number;
  dtMs: number;
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
  input: InputState;
  settings: GameSettings;
};

export interface GameScene {
  init(): void;
  update(ctx: GameContext): void;
  render(ctx: GameContext): void;
  dispose(): void;
}

export type GameSignals = {
  // 0..1 difficulty/intensity (tempo/energy)
  intensity?: number;
  // 0..1 danger/near-failure
  tension?: number;
  // emit brief cue
  milestone?: boolean;
  // emit soft decay
  fail?: boolean;
};

export type GameSceneWithSignals = GameScene & {
  getSignals?: () => GameSignals;
};


