// Visual effects and particles system

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  alpha: number;
};

export type ScreenShake = {
  intensity: number;
  duration: number;
  startTime: number;
};

export type FlashEffect = {
  color: string;
  intensity: number;
  duration: number;
  startTime: number;
};

export type ComboIndicator = {
  combo: number;
  x: number;
  y: number;
  life: number;
  maxLife: number;
};

