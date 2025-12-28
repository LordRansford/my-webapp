"use client";

import { useState } from "react";
import type { CharacterId } from "@/games/playerChoices/characters";
import type { DifficultyModifierId } from "@/games/playerChoices/modifiers";
import type { PowerUpId } from "@/games/playerChoices/powerUps";
import type { PlayStyle } from "@/games/playerChoices/system";
import type { PlayerChoices } from "@/games/playerChoices/system";
import { CHARACTERS } from "@/games/playerChoices/characters";
import { DIFFICULTY_MODIFIERS } from "@/games/playerChoices/modifiers";
import { POWER_UPS } from "@/games/playerChoices/powerUps";
import { applyPlayerChoices, getDefaultChoices } from "@/games/playerChoices/system";

interface PreGameSelectionProps {
  onStart: (choices: PlayerChoices) => void;
  onCancel: () => void;
}

export default function PreGameSelection({ onStart, onCancel }: PreGameSelectionProps) {
  const [choices, setChoices] = useState<PlayerChoices>(getDefaultChoices());
  const appliedStats = applyPlayerChoices(choices);

  const handleStart = () => {
    onStart(choices);
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">Prepare for Mission</h2>
        <p className="mt-2 text-sm text-white/80">Choose your character and modifiers</p>
      </div>

      {/* Character Selection */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Choose Character</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.values(CHARACTERS).map((char) => (
            <button
              key={char.id}
              onClick={() => setChoices((c) => ({ ...c, character: char.id }))}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                choices.character === char.id
                  ? "border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/20"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{char.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{char.name}</div>
                  <div className="mt-1 text-xs text-white/70">{char.description}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-white/60">
                <div>Speed: {char.speedMultiplier > 1 ? "+" : ""}{Math.round((char.speedMultiplier - 1) * 100)}%</div>
                <div>Size: {char.hitboxSizeMultiplier > 1 ? "+" : ""}{Math.round((char.hitboxSizeMultiplier - 1) * 100)}%</div>
                <div>Points: {char.pointsMultiplier > 1 ? "+" : ""}{Math.round((char.pointsMultiplier - 1) * 100)}%</div>
                {char.canSurviveHit && <div className="text-emerald-400">Can survive 1 hit</div>}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Difficulty Modifier */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Difficulty Modifier</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Object.values(DIFFICULTY_MODIFIERS).map((mod) => (
            <button
              key={mod.id}
              onClick={() => setChoices((c) => ({ ...c, difficultyModifier: mod.id }))}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                choices.difficultyModifier === mod.id
                  ? "border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/20"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{mod.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-white">{mod.name}</div>
                  <div className="mt-1 text-xs text-white/70">{mod.description}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-xs text-white/60">
                <div className="text-emerald-400">Points: +{Math.round((mod.pointsMultiplier - 1) * 100)}%</div>
                <div>Speed: {mod.obstacleSpeedMultiplier > 1 ? "+" : ""}{Math.round((mod.obstacleSpeedMultiplier - 1) * 100)}%</div>
                <div>Spawns: {mod.spawnDelayMultiplier > 1 ? "slower" : mod.spawnDelayMultiplier < 1 ? "faster" : "normal"}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Power-up Preferences */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Preferred Power-ups (Choose 2)</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.values(POWER_UPS).map((powerUp) => {
            const isSelected = choices.preferredPowerUps.includes(powerUp.id);
            const canSelect = isSelected || choices.preferredPowerUps.length < 2;
            return (
              <button
                key={powerUp.id}
                onClick={() => {
                  if (!canSelect) return;
                  setChoices((c) => {
                    if (isSelected) {
                      return { ...c, preferredPowerUps: c.preferredPowerUps.filter((id) => id !== powerUp.id) };
                    } else {
                      return { ...c, preferredPowerUps: [...c.preferredPowerUps, powerUp.id] };
                    }
                  });
                }}
                disabled={!canSelect}
                className={`rounded-xl border-2 p-3 text-left transition-all ${
                  isSelected
                    ? "border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/20"
                    : canSelect
                    ? "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    : "border-white/10 bg-white/5 opacity-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{powerUp.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{powerUp.name}</div>
                    <div className="mt-0.5 text-xs text-white/60">{powerUp.description}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs">
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      powerUp.rarity === "common"
                        ? "bg-blue-500/20 text-blue-300"
                        : powerUp.rarity === "rare"
                        ? "bg-purple-500/20 text-purple-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {powerUp.rarity}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Play Style */}
      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Play Style</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {(["aggressive", "defensive", "adaptive"] as PlayStyle[]).map((style) => (
            <button
              key={style}
              onClick={() => setChoices((c) => ({ ...c, playStyle: style }))}
              className={`rounded-2xl border-2 p-4 text-left transition-all ${
                choices.playStyle === style
                  ? "border-indigo-400 bg-indigo-500/20 shadow-lg shadow-indigo-500/20"
                  : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              <div className="font-semibold text-white capitalize">{style}</div>
              <div className="mt-1 text-xs text-white/70">
                {style === "aggressive" && "More obstacles, higher point potential"}
                {style === "defensive" && "Fewer obstacles, safer but lower points"}
                {style === "adaptive" && "Difficulty adjusts to your performance"}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Summary */}
      <div className="rounded-2xl border border-white/20 bg-white/5 p-4">
        <div className="text-sm font-semibold text-white">Your Loadout</div>
        <div className="mt-2 space-y-1 text-xs text-white/70">
          <div>
            Effective speed: {appliedStats.speedMultiplier > 1 ? "+" : ""}
            {Math.round((appliedStats.speedMultiplier - 1) * 100)}%
          </div>
          <div>
            Points multiplier: {appliedStats.pointsMultiplier > 1 ? "+" : ""}
            {Math.round((appliedStats.pointsMultiplier - 1) * 100)}%
          </div>
          <div>
            Obstacle speed: {appliedStats.obstacleSpeedMultiplier > 1 ? "+" : ""}
            {Math.round((appliedStats.obstacleSpeedMultiplier - 1) * 100)}%
          </div>
          {appliedStats.canSurviveHit && <div className="text-emerald-400">Can survive 1 hit</div>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-3 font-semibold text-white shadow-lg transition-all hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl"
        >
          Start Mission
        </button>
      </div>
    </div>
  );
}

