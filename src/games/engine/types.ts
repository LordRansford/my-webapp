export type Vec2 = { x: number; y: number };

export type GameSettings = {
  muted: boolean;
  reduceMotion: boolean;
};

export type InputState = {
  // -1..1 axes for continuous movement
  moveX: number;
  moveY: number;
  // discrete actions
  pausePressed: boolean;
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


