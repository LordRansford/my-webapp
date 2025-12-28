// Impact explosion effects

import type { Particle } from "../effects/types";

export type Explosion = {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  color: string;
  intensity: number;
};

export function createExplosion(x: number, y: number, color: string = "#ff8800", intensity: number = 1.0): Explosion {
  return {
    x,
    y,
    radius: 10,
    maxRadius: 30 + intensity * 20,
    life: 1.0,
    maxLife: 0.3,
    color,
    intensity,
  };
}

export function updateExplosion(explosion: Explosion, dt: number): boolean {
  explosion.life -= dt / 1000 / explosion.maxLife;
  const progress = 1 - explosion.life;
  explosion.radius = explosion.maxRadius * (1 - progress * progress); // Ease out

  return explosion.life > 0;
}

export function renderExplosion(ctx: CanvasRenderingContext2D, explosion: Explosion, reduceMotion: boolean) {
  if (reduceMotion) return; // Skip explosions in reduced motion mode

  ctx.save();
  const alpha = explosion.life;
  ctx.globalAlpha = alpha;

  // Outer glow
  const gradient = ctx.createRadialGradient(explosion.x, explosion.y, 0, explosion.x, explosion.y, explosion.radius);
  gradient.addColorStop(0, explosion.color);
  gradient.addColorStop(0.5, explosion.color + "80");
  gradient.addColorStop(1, explosion.color + "00");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
  ctx.fill();

  // Inner bright core
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha = alpha * 0.8;
  ctx.beginPath();
  ctx.arc(explosion.x, explosion.y, explosion.radius * 0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function createExplosionParticles(x: number, y: number, color: string, count: number = 15): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const speed = 100 + Math.random() * 150;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      maxLife: 0.5 + Math.random() * 0.5,
      size: 2 + Math.random() * 4,
      color,
      alpha: 1.0,
    });
  }
  return particles;
}

