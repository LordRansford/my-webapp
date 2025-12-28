import type { GameScene } from "@/games/engine/types";
import { clear, drawHudText } from "@/games/engine/ui";
import type { MissionId, MissionDefinition } from "@/games/missions/types";
import { getMission } from "@/games/missions/definitions";
import type { PlayerChoice } from "@/games/characters/types";
import { CHARACTERS, DIFFICULTY_MODIFIERS } from "@/games/characters/types";
import type { Collectible, PowerUp, PowerUpType } from "@/games/collectibles/types";
import { COLLECTIBLE_VALUES, COLLECTIBLE_SPAWN_WEIGHTS, POWER_UP_DURATIONS, POWER_UP_SPAWN_WEIGHT } from "@/games/collectibles/types";
import type { Particle, ScreenShake, FlashEffect, ComboIndicator } from "@/games/effects/types";
import { CharisVoice } from "@/games/characters/voice";
import { hashStringToUint32, mulberry32 } from "@/games/seed";

type Obstacle = { x: number; y: number; w: number; h: number; speed: number; id: string };

export function createMissionScene(opts?: {
  missionId: MissionId;
  playerChoice?: PlayerChoice;
  onComplete?: (won: boolean, stars: 0 | 1 | 2 | 3, objectivesCompleted: string[], sideQuestsCompleted: string[], timeMs: number) => void;
  onAudio?: (p: { intensity: number; tension: number }) => void;
  onMilestone?: (s: number) => void;
}): GameScene {
  const missionId = opts?.missionId ?? 1;
  const mission = getMission(missionId);
  if (!mission) throw new Error(`Mission ${missionId} not found`);

  const playerChoice = opts?.playerChoice ?? {
    character: "agent",
    powerUpPreferences: { slowTime: true, shield: true, doublePoints: true, speedBoost: true },
  };
  const character = CHARACTERS[playerChoice.character];
  const difficultyModifier = playerChoice.difficultyModifier
    ? DIFFICULTY_MODIFIERS.find((m) => m.id === playerChoice.difficultyModifier)
    : null;

  const seed = hashStringToUint32(`rn:mission:${missionId}:${Date.now()}`);
  let rand = mulberry32(seed);

  let startedAt = 0;
  let runMs = 0;
  let won = false;
  let dead = false;

  let px = 0;
  let py = 0;
  let pr = 9;

  let t = 0;
  const obstacles: Obstacle[] = [];
  let nextSpawnMs = 0;
  let lastMilestone = 0;

  // Collectibles and power-ups
  const collectibles: Collectible[] = [];
  const powerUps: PowerUp[] = [];
  let activePowerUps: Map<PowerUpType, { startTime: number; duration: number }> = new Map();

  // Combo system
  let combo = 0;
  let lastDodgeTime = 0;
  const PERFECT_DODGE_WINDOW = character.stats.perfectDodgeWindow;
  let perfectDodges = 0;
  let totalPoints = 0;

  // Visual effects
  const particles: Particle[] = [];
  let screenShake: ScreenShake | null = null;
  let flashEffect: FlashEffect | null = null;
  const comboIndicators: ComboIndicator[] = [];

  // Objectives tracking
  const objectivesCompleted: string[] = [];
  const sideQuestsCompleted: string[] = [];
  let collectiblesCollected = 0;

  // Charis voice
  const charisVoice = new CharisVoice();

  // Difficulty calculation
  const baseDifficulty = mission.difficulty;
  const modifierMultiplier = difficultyModifier?.intensityMultiplier ?? 1.0;
  const effectiveDifficulty = Math.min(1.0, baseDifficulty * modifierMultiplier);

  const getDifficultyPhase = (ms: number): { phase: number; intensity: number } => {
    const progress = ms / mission.durationMs;
    const baseIntensity = 0.3 + effectiveDifficulty * 0.7;
    const ramp = progress * 0.4;
    return {
      phase: Math.floor(progress * 5) + 1,
      intensity: Math.min(0.99, baseIntensity + ramp),
    };
  };

  const spawnObstacle = (w: number, h: number, intensity: number) => {
    const lane = Math.floor(rand() * 5);
    const gap = w / 6;
    const x = Math.round((lane + 1) * gap);
    const size = (18 + Math.round(rand() * 22)) * (0.9 + intensity * 0.3);
    const speed = (80 + rand() * 120) * (0.8 + intensity * 0.6);
    obstacles.push({ x, y: -size - 6, w: size, h: size, speed, id: `obs-${Date.now()}-${rand()}` });
  };

  const spawnCollectible = (w: number, h: number) => {
    const rarityRoll = rand();
    let rarity: "common" | "rare" | "epic" = "common";
    if (rarityRoll < COLLECTIBLE_SPAWN_WEIGHTS.epic) {
      rarity = "epic";
    } else if (rarityRoll < COLLECTIBLE_SPAWN_WEIGHTS.epic + COLLECTIBLE_SPAWN_WEIGHTS.rare) {
      rarity = "rare";
    }

    const lane = Math.floor(rand() * 5);
    const gap = w / 6;
    const x = Math.round((lane + 1) * gap);
    const y = -20;
    collectibles.push({
      id: `collect-${Date.now()}-${rand()}`,
      x,
      y,
      radius: 8,
      rarity,
      value: COLLECTIBLE_VALUES[rarity],
      collected: false,
      spawnTime: runMs,
      magnetRadius: character.stats.collectibleMagnet,
    });
  };

  const spawnPowerUp = (w: number, h: number) => {
    if (rand() > POWER_UP_SPAWN_WEIGHT) return;

    const types: PowerUpType[] = [];
    if (playerChoice.powerUpPreferences.slowTime) types.push("slow-time");
    if (playerChoice.powerUpPreferences.shield) types.push("shield");
    if (playerChoice.powerUpPreferences.doublePoints) types.push("double-points");
    if (playerChoice.powerUpPreferences.speedBoost) types.push("speed-boost");

    if (types.length === 0) return;

    const type = types[Math.floor(rand() * types.length)];
    const lane = Math.floor(rand() * 5);
    const gap = w / 6;
    const x = Math.round((lane + 1) * gap);
    const y = -20;

    powerUps.push({
      id: `powerup-${Date.now()}-${rand()}`,
      x,
      y,
      radius: 12,
      type,
      collected: false,
      spawnTime: runMs,
      active: false,
      duration: POWER_UP_DURATIONS[type] * character.stats.shieldDuration,
    });
  };

  const collideCircleRect = (cx: number, cy: number, cr: number, r: Obstacle) => {
    const rx = r.x - r.w / 2;
    const ry = r.y - r.h / 2;
    const closestX = Math.max(rx, Math.min(cx, rx + r.w));
    const closestY = Math.max(ry, Math.min(cy, ry + r.h));
    const dx = cx - closestX;
    const dy = cy - closestY;
    return dx * dx + dy * dy <= cr * cr;
  };

  const collideCircleCircle = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < r1 + r2;
  };

  const addParticles = (x: number, y: number, color: string, count = 10) => {
    for (let i = 0; i < count; i++) {
      particles.push({
        x,
        y,
        vx: (rand() - 0.5) * 200,
        vy: (rand() - 0.5) * 200,
        life: 1.0,
        maxLife: 0.5 + rand() * 0.5,
        size: 2 + rand() * 4,
        color,
        alpha: 1.0,
      });
    }
  };

  const triggerScreenShake = (intensity: number, duration: number) => {
    screenShake = { intensity, duration, startTime: runMs };
  };

  const triggerFlash = (color: string, intensity: number, duration: number) => {
    flashEffect = { color, intensity, duration, startTime: runMs };
  };

  const checkObjectives = () => {
    // Check survive objective
    const surviveObj = mission.objectives.find((o) => o.type === "survive");
    if (surviveObj && runMs >= surviveObj.target && !objectivesCompleted.includes(surviveObj.id)) {
      objectivesCompleted.push(surviveObj.id);
    }

    // Check collect objective
    const collectObj = mission.objectives.find((o) => o.type === "collect");
    if (collectObj && collectiblesCollected >= collectObj.target && !objectivesCompleted.includes(collectObj.id)) {
      objectivesCompleted.push(collectObj.id);
    }

    // Check combo objective
    const comboObj = mission.objectives.find((o) => o.type === "combo");
    if (comboObj && combo >= comboObj.target && !objectivesCompleted.includes(comboObj.id)) {
      objectivesCompleted.push(comboObj.id);
    }

    // Check perfect dodge objective
    const perfectObj = mission.objectives.find((o) => o.type === "perfect");
    if (perfectObj && perfectDodges >= perfectObj.target && !objectivesCompleted.includes(perfectObj.id)) {
      objectivesCompleted.push(perfectObj.id);
    }

    // Check side quests
    for (const quest of mission.sideQuests) {
      if (sideQuestsCompleted.includes(quest.id)) continue;

      let completed = false;
      if (quest.id.includes("combo-")) {
        const target = parseInt(quest.id.match(/combo-(\d+)/)?.[1] || "0");
        if (combo >= target) completed = true;
      } else if (quest.id.includes("collect-")) {
        const target = parseInt(quest.id.match(/collect-(\d+)/)?.[1] || "0");
        if (collectiblesCollected >= target) completed = true;
      } else if (quest.id.includes("perfect-")) {
        const target = parseInt(quest.id.match(/perfect-(\d+)/)?.[1] || "0");
        if (perfectDodges >= target) completed = true;
      } else if (quest.id.includes("no-hits") || quest.id.includes("no-powerups") || quest.id.includes("flawless") || quest.id.includes("master") || quest.id.includes("dedication") || quest.id.includes("legend")) {
        // These are checked at mission end
        continue;
      }

      if (completed) {
        sideQuestsCompleted.push(quest.id);
        totalPoints += quest.reward;
      }
    }
  };

  const calculateStars = (): 0 | 1 | 2 | 3 => {
    const objectivesComplete = objectivesCompleted.length;
    const sideQuestsComplete = sideQuestsCompleted.length;
    const totalObjectives = mission.objectives.length;
    const totalSideQuests = mission.sideQuests.length;

    if (objectivesComplete === totalObjectives && sideQuestsComplete === totalSideQuests) return 3;
    if (objectivesComplete === totalObjectives) return 2;
    if (objectivesComplete >= totalObjectives * 0.7) return 1;
    return 0;
  };

  return {
    init() {
      rand = mulberry32(seed);
      startedAt = 0;
      runMs = 0;
      won = false;
      dead = false;
      t = 0;
      obstacles.length = 0;
      collectibles.length = 0;
      powerUps.length = 0;
      activePowerUps.clear();
      nextSpawnMs = 400;
      px = 0;
      py = 0;
      combo = 0;
      perfectDodges = 0;
      totalPoints = 0;
      collectiblesCollected = 0;
      objectivesCompleted.length = 0;
      sideQuestsCompleted.length = 0;
      particles.length = 0;
      comboIndicators.length = 0;
      screenShake = null;
      flashEffect = null;
      lastMilestone = 0;
    },
    update(ctx) {
      if (!startedAt) {
        startedAt = ctx.nowMs;
        px = ctx.width / 2;
        py = ctx.height * 0.75;
        return;
      }

      if (dead) return;

      const dt = ctx.dtMs;
      t += dt;
      runMs = ctx.nowMs - startedAt;

      // Apply slow time power-up
      const slowTimeActive = activePowerUps.has("slow-time");
      const effectiveDt = slowTimeActive ? dt * 0.5 : dt;

      // Update power-ups
      for (const [type, data] of activePowerUps.entries()) {
        if (runMs - data.startTime >= data.duration) {
          activePowerUps.delete(type);
        }
      }

      // Difficulty-based spawn schedule
      const { phase, intensity } = getDifficultyPhase(runMs);
      if (t >= nextSpawnMs) {
        spawnObstacle(ctx.width, ctx.height, intensity);
        const base = 400 + rand() * 300;
        const ramp = Math.max(150, 500 - (runMs / 1000) * 8 * intensity);
        nextSpawnMs = t + Math.min(ramp, base);

        // Spawn collectibles
        if (rand() < 0.4) {
          spawnCollectible(ctx.width, ctx.height);
        }

        // Spawn power-ups
        spawnPowerUp(ctx.width, ctx.height);

        // Multiple obstacles in later phases
        if (phase >= 3 && rand() < 0.3) {
          spawnObstacle(ctx.width, ctx.height, intensity);
        }
        if (phase >= 5 && rand() < 0.2) {
          spawnObstacle(ctx.width, ctx.height, intensity);
        }
      }

      // Audio parameters
      const audioIntensity = Math.max(0, Math.min(1, runMs / mission.durationMs));
      const timeLeft = Math.max(0, mission.durationMs - runMs);
      const tension = Math.max(0, Math.min(1, 1 - timeLeft / (mission.durationMs * 0.2)));
      opts?.onAudio?.({ intensity: audioIntensity, tension });

      // Milestones
      const milestoneS = Math.floor((runMs / 1000) / (mission.durationMs / 1000 / 4)) * (mission.durationMs / 1000 / 4);
      if (milestoneS > lastMilestone && milestoneS > 0) {
        lastMilestone = milestoneS;
        opts?.onMilestone?.(milestoneS);
        charisVoice.speakLine("milestone", false);
      }

      // Player movement
      const speedMultiplier = activePowerUps.has("speed-boost") ? 1.3 : 1.0;
      const speed = (ctx.settings.reduceMotion ? 200 : 260) * character.stats.speed * speedMultiplier;
      px += (ctx.input.moveX * speed * effectiveDt) / 1000;
      py += (ctx.input.moveY * speed * effectiveDt) / 1000;
      px = Math.max(14, Math.min(ctx.width - 14, px));
      py = Math.max(14, Math.min(ctx.height - 14, py));

      // Update obstacles
      const obstacleSpeedMultiplier = slowTimeActive ? 0.5 : 1.0;
      for (const o of obstacles) {
        const s = o.speed * (ctx.settings.reduceMotion ? 0.9 : 1) * obstacleSpeedMultiplier;
        o.y += (s * effectiveDt) / 1000;
      }
      while (obstacles.length && obstacles[0].y - obstacles[0].h / 2 > ctx.height + 40) obstacles.shift();

      // Update collectibles
      for (const c of collectibles) {
        if (c.collected) continue;

        // Magnet effect
        if (c.magnetRadius && c.magnetRadius > 0) {
          const dx = px - c.x;
          const dy = py - c.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < c.magnetRadius) {
            const pull = (c.magnetRadius - dist) / c.magnetRadius;
            c.x += (dx / dist) * pull * 300 * (effectiveDt / 1000);
            c.y += (dy / dist) * pull * 300 * (effectiveDt / 1000);
          }
        }

        c.y += 100 * (effectiveDt / 1000);
        if (collideCircleCircle(px, py, pr, c.x, c.y, c.radius)) {
          c.collected = true;
          collectiblesCollected++;
          const pointValue = c.value * (activePowerUps.has("double-points") ? 2 : 1) * character.stats.comboMultiplier * (1 + combo * 0.1);
          totalPoints += pointValue;
          combo++;
          addParticles(c.x, c.y, c.rarity === "epic" ? "#ff00ff" : c.rarity === "rare" ? "#00ffff" : "#ffff00", 8);
          triggerScreenShake(0.1, 100);
        }
      }
      collectibles.filter((c) => !c.collected && c.y > ctx.height + 40).forEach((c) => (c.collected = true));

      // Update power-ups
      for (const p of powerUps) {
        if (p.collected) continue;
        p.y += 100 * (effectiveDt / 1000);
        if (collideCircleCircle(px, py, pr, p.x, p.y, p.radius)) {
          p.collected = true;
          p.active = true;
          p.startTime = runMs;
          activePowerUps.set(p.type, { startTime: runMs, duration: p.duration });
          addParticles(p.x, p.y, "#00ff00", 15);
          triggerScreenShake(0.2, 150);
          triggerFlash("#00ff00", 0.3, 200);
          charisVoice.speakLine("encouragement", false);
        }
      }
      powerUps.filter((p) => !p.collected && p.y > ctx.height + 40).forEach((p) => (p.collected = true));

      // Perfect dodge detection (check before collision)
      for (const o of obstacles) {
        const dx = px - o.x;
        const dy = py - o.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = pr + Math.max(o.w, o.h) / 2;
        // Perfect dodge: very close but not colliding
        if (dist < minDist + 25 && dist > minDist - 5 && !collideCircleRect(px, py, pr, o)) {
          const timeSinceLastDodge = runMs - lastDodgeTime;
          if (timeSinceLastDodge > PERFECT_DODGE_WINDOW) {
            perfectDodges++;
            combo++;
            lastDodgeTime = runMs;
            addParticles(o.x, o.y, "#ffffff", 12);
            comboIndicators.push({
              combo,
              x: o.x,
              y: o.y,
              life: 1.0,
              maxLife: 1.0,
            });
            charisVoice.speakLine("encouragement", false);
          }
        }
      }

      // Collisions (check shield)
      if (!activePowerUps.has("shield")) {
        for (const o of obstacles) {
          if (collideCircleRect(px, py, pr, o)) {
            dead = true;
            won = false;
            combo = 0;
            triggerScreenShake(0.5, 300);
            triggerFlash("#ff0000", 0.5, 300);
            charisVoice.speakLine("failure", true);
            const stars = calculateStars();
            checkObjectives();
            opts?.onComplete?.(false, stars, objectivesCompleted, sideQuestsCompleted, runMs);
            break;
          }
        }
      }

      // Win condition
      if (!dead && runMs >= mission.durationMs) {
        dead = true;
        won = true;
        checkObjectives();
        
        // Check end-of-mission side quests
        for (const quest of mission.sideQuests) {
          if (sideQuestsCompleted.includes(quest.id)) continue;
          
          if (quest.id === "no-hits" && perfectDodges > 0) {
            // Check if no hits were taken (shield might have been used, but no actual collisions)
            sideQuestsCompleted.push(quest.id);
            totalPoints += quest.reward;
          } else if (quest.id === "no-powerups" && activePowerUps.size === 0) {
            sideQuestsCompleted.push(quest.id);
            totalPoints += quest.reward;
          } else if (quest.id === "flawless") {
            const perfectObj = mission.objectives.find(o => o.type === "perfect");
            if (perfectObj && perfectDodges >= perfectObj.target) {
              sideQuestsCompleted.push(quest.id);
              totalPoints += quest.reward;
            }
          } else if (quest.id === "master" && objectivesCompleted.length === mission.objectives.length && sideQuestsCompleted.length === mission.sideQuests.length - 1) {
            sideQuestsCompleted.push(quest.id);
            totalPoints += quest.reward;
          } else if (quest.id === "dedication" || quest.id === "legend") {
            // Always complete dedication/legend if mission is completed
            sideQuestsCompleted.push(quest.id);
            totalPoints += quest.reward;
          }
        }
        
        const stars = calculateStars();
        triggerScreenShake(0.3, 400);
        triggerFlash("#00ff00", 0.4, 500);
        charisVoice.speakLine("victory", true);
        opts?.onComplete?.(true, stars, objectivesCompleted, sideQuestsCompleted, runMs);
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx * (effectiveDt / 1000);
        p.y += p.vy * (effectiveDt / 1000);
        p.life -= effectiveDt / 1000 / p.maxLife;
        p.alpha = p.life;
        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update combo indicators
      for (let i = comboIndicators.length - 1; i >= 0; i--) {
        const ind = comboIndicators[i];
        ind.y -= 50 * (effectiveDt / 1000);
        ind.life -= effectiveDt / 1000 / ind.maxLife;
        if (ind.life <= 0) {
          comboIndicators.splice(i, 1);
        }
      }

      // Update screen shake
      if (screenShake && runMs - screenShake.startTime >= screenShake.duration) {
        screenShake = null;
      }

      // Update flash
      if (flashEffect && runMs - flashEffect.startTime >= flashEffect.duration) {
        flashEffect = null;
      }

      // Reset combo if too much time passes
      if (runMs - lastDodgeTime > 2000) {
        combo = 0;
      }
    },
    render(ctx) {
      clear(ctx.ctx2d, ctx.width, ctx.height);

      // Screen shake offset
      let shakeX = 0;
      let shakeY = 0;
      if (screenShake && !ctx.settings.reduceMotion) {
        const elapsed = runMs - screenShake.startTime;
        const progress = elapsed / screenShake.duration;
        const intensity = screenShake.intensity * (1 - progress);
        shakeX = (rand() - 0.5) * intensity * 20;
        shakeY = (rand() - 0.5) * intensity * 20;
      }

      ctx.ctx2d.save();
      ctx.ctx2d.translate(shakeX, shakeY);

      // Background
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(2,6,23,0.96)";
      ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
      ctx.ctx2d.restore();

      // Flash effect
      if (flashEffect && !ctx.settings.reduceMotion) {
        const elapsed = runMs - flashEffect.startTime;
        const progress = elapsed / flashEffect.duration;
        const alpha = flashEffect.intensity * (1 - progress);
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = flashEffect.color;
        ctx.ctx2d.globalAlpha = alpha;
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
      }

      // Obstacles
      ctx.ctx2d.save();
      const brightColors = ["#00ffff", "#ffff00", "#ff00ff", "#00ff00", "#ff8800", "#ff0088"];
      for (const o of obstacles) {
        const colorIndex = Math.floor((o.x + o.y) / 50) % brightColors.length;
        const brightColor = brightColors[colorIndex];
        ctx.ctx2d.shadowBlur = 25;
        ctx.ctx2d.shadowColor = brightColor;
        ctx.ctx2d.fillStyle = brightColor;
        ctx.ctx2d.fillRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 3;
        ctx.ctx2d.strokeRect(o.x - o.w / 2, o.y - o.h / 2, o.w, o.h);
      }
      ctx.ctx2d.restore();

      // Collectibles
      for (const c of collectibles) {
        if (c.collected) continue;
        ctx.ctx2d.save();
        const color = c.rarity === "epic" ? "#ff00ff" : c.rarity === "rare" ? "#00ffff" : "#ffff00";
        ctx.ctx2d.shadowBlur = 15;
        ctx.ctx2d.shadowColor = color;
        ctx.ctx2d.fillStyle = color;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        ctx.ctx2d.restore();
      }

      // Power-ups
      for (const p of powerUps) {
        if (p.collected) continue;
        ctx.ctx2d.save();
        const color = p.type === "slow-time" ? "#00ffff" : p.type === "shield" ? "#0000ff" : p.type === "double-points" ? "#ffff00" : "#00ff00";
        ctx.ctx2d.shadowBlur = 20;
        ctx.ctx2d.shadowColor = color;
        ctx.ctx2d.fillStyle = color;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 2;
        ctx.ctx2d.stroke();
        ctx.ctx2d.restore();
      }

      // Charis visual indicator (appears during milestones and important moments)
      if (!ctx.settings.reduceMotion && (runMs % 30000 < 2000 || combo > 10)) {
        ctx.ctx2d.save();
        const charisX = ctx.width - 60;
        const charisY = 60;
        const pulse = Math.sin((runMs / 500) % (Math.PI * 2)) * 0.2 + 1;
        ctx.ctx2d.globalAlpha = 0.8;
        ctx.ctx2d.shadowBlur = 20;
        ctx.ctx2d.shadowColor = "#ff00ff";
        ctx.ctx2d.fillStyle = "#ff00ff";
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(charisX, charisY, 15 * pulse, 0, Math.PI * 2);
        ctx.ctx2d.fill();
        ctx.ctx2d.strokeStyle = "#ffffff";
        ctx.ctx2d.lineWidth = 2;
        ctx.ctx2d.stroke();
        // Draw "C" for Charis
        ctx.ctx2d.fillStyle = "#ffffff";
        ctx.ctx2d.font = "bold 16px system-ui";
        ctx.ctx2d.textAlign = "center";
        ctx.ctx2d.textBaseline = "middle";
        ctx.ctx2d.fillText("C", charisX, charisY);
        ctx.ctx2d.restore();
      }

      // Player (with shield effect)
      ctx.ctx2d.save();
      if (activePowerUps.has("shield")) {
        ctx.ctx2d.shadowBlur = 30;
        ctx.ctx2d.shadowColor = "#0000ff";
        ctx.ctx2d.strokeStyle = "#0000ff";
        ctx.ctx2d.lineWidth = 4;
        ctx.ctx2d.beginPath();
        ctx.ctx2d.arc(px, py, pr + 5, 0, Math.PI * 2);
        ctx.ctx2d.stroke();
      }
      ctx.ctx2d.shadowBlur = 20;
      ctx.ctx2d.shadowColor = "#6366f1";
      ctx.ctx2d.fillStyle = "rgba(99,102,241,0.95)";
      ctx.ctx2d.beginPath();
      ctx.ctx2d.arc(px, py, pr, 0, Math.PI * 2);
      ctx.ctx2d.fill();
      ctx.ctx2d.strokeStyle = "#ffffff";
      ctx.ctx2d.lineWidth = 3;
      ctx.ctx2d.stroke();
      ctx.ctx2d.restore();

      // Particles
      if (!ctx.settings.reduceMotion) {
        for (const p of particles) {
          ctx.ctx2d.save();
          ctx.ctx2d.globalAlpha = p.alpha;
          ctx.ctx2d.fillStyle = p.color;
          ctx.ctx2d.beginPath();
          ctx.ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.ctx2d.fill();
          ctx.ctx2d.restore();
        }
      }

      // Combo indicators
      for (const ind of comboIndicators) {
        ctx.ctx2d.save();
        ctx.ctx2d.globalAlpha = ind.life;
        ctx.ctx2d.font = "bold 24px system-ui";
        ctx.ctx2d.fillStyle = "#ffffff";
        ctx.ctx2d.strokeStyle = "#000000";
        ctx.ctx2d.lineWidth = 4;
        const text = `${ind.combo}x COMBO!`;
        ctx.ctx2d.strokeText(text, ind.x - 60, ind.y);
        ctx.ctx2d.fillText(text, ind.x - 60, ind.y);
        ctx.ctx2d.restore();
      }

      ctx.ctx2d.restore(); // End shake transform

      // HUD
      const left = Math.max(0, mission.durationMs - runMs);
      const leftS = Math.max(0, Math.ceil(left / 1000));
      const progress = Math.min(1, runMs / mission.durationMs);

      drawHudText(ctx.ctx2d, `Mission ${mission.id}: ${mission.title}`, 16, 26);
      drawHudText(ctx.ctx2d, `Time: ${leftS}s`, 16, 48);
      drawHudText(ctx.ctx2d, `Points: ${Math.floor(totalPoints)}`, 16, 70);
      if (combo > 0) {
        drawHudText(ctx.ctx2d, `Combo: ${combo}x`, 16, 92);
      }
      if (activePowerUps.size > 0) {
        const powerUpNames: string[] = [];
        if (activePowerUps.has("slow-time")) powerUpNames.push("SLOW");
        if (activePowerUps.has("shield")) powerUpNames.push("SHIELD");
        if (activePowerUps.has("double-points")) powerUpNames.push("2X");
        if (activePowerUps.has("speed-boost")) powerUpNames.push("SPEED");
        drawHudText(ctx.ctx2d, `Active: ${powerUpNames.join(", ")}`, 16, 114);
      }

      // Progress bar
      ctx.ctx2d.save();
      ctx.ctx2d.fillStyle = "rgba(255,255,255,0.2)";
      ctx.ctx2d.fillRect(16, ctx.height - 40, ctx.width - 32, 8);
      ctx.ctx2d.fillStyle = "#00ff00";
      ctx.ctx2d.fillRect(16, ctx.height - 40, (ctx.width - 32) * progress, 8);
      ctx.ctx2d.restore();

      // Objectives status
      let yOffset = 140;
      for (const obj of mission.objectives) {
        const completed = objectivesCompleted.includes(obj.id);
        const text = `${completed ? "✓" : "○"} ${obj.description}`;
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = completed ? "rgba(0,255,0,0.9)" : "rgba(255,255,255,0.7)";
        ctx.ctx2d.font = "600 12px system-ui";
        ctx.ctx2d.fillText(text, 16, yOffset);
        ctx.ctx2d.restore();
        yOffset += 18;
      }

      if (dead) {
        ctx.ctx2d.save();
        ctx.ctx2d.fillStyle = "rgba(0,0,0,0.55)";
        ctx.ctx2d.fillRect(0, 0, ctx.width, ctx.height);
        ctx.ctx2d.restore();
        const title = won ? "Mission Complete!" : "Mission Failed";
        drawHudText(ctx.ctx2d, title, 16, 84);
        if (won) {
          const stars = calculateStars();
          drawHudText(ctx.ctx2d, `Stars: ${"★".repeat(stars)}${"☆".repeat(3 - stars)}`, 16, 106);
          drawHudText(ctx.ctx2d, `Points: ${Math.floor(totalPoints)}`, 16, 128);
        }
        drawHudText(ctx.ctx2d, "Return to the hub for another mission.", 16, 150);
      }
    },
    dispose() {
      charisVoice.dispose();
    },
  };
}

