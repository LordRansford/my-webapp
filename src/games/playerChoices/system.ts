import type { CharacterId } from "./characters";
import type { DifficultyModifierId } from "./modifiers";
import type { PowerUpId } from "./powerUps";
import { getCharacter } from "./characters";
import { getModifier } from "./modifiers";

export type PlayStyle = "aggressive" | "defensive" | "adaptive";

export interface PlayerChoices {
  character: CharacterId;
  difficultyModifier: DifficultyModifierId;
  preferredPowerUps: PowerUpId[]; // Max 2
  playStyle: PlayStyle;
}

export interface AppliedPlayerStats {
  speedMultiplier: number;
  hitboxSizeMultiplier: number;
  pointsMultiplier: number;
  obstacleSpeedMultiplier: number;
  spawnDelayMultiplier: number;
  canSurviveHit: boolean;
  preferredPowerUps: PowerUpId[];
  playStyle: PlayStyle;
}

export function applyPlayerChoices(choices: PlayerChoices): AppliedPlayerStats {
  const character = getCharacter(choices.character);
  const modifier = getModifier(choices.difficultyModifier);

  return {
    speedMultiplier: character.speedMultiplier,
    hitboxSizeMultiplier: character.hitboxSizeMultiplier,
    pointsMultiplier: character.pointsMultiplier * modifier.pointsMultiplier,
    obstacleSpeedMultiplier: modifier.obstacleSpeedMultiplier,
    spawnDelayMultiplier: modifier.spawnDelayMultiplier,
    canSurviveHit: character.canSurviveHit,
    preferredPowerUps: choices.preferredPowerUps,
    playStyle: choices.playStyle,
  };
}

export function getDefaultChoices(): PlayerChoices {
  return {
    character: "balanced",
    difficultyModifier: "steady-progress",
    preferredPowerUps: ["shield", "speed-boost"],
    playStyle: "adaptive",
  };
}

