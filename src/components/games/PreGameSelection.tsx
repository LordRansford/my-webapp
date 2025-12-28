"use client";

import { useState } from "react";
import type { CharacterId, PlayerChoice, DifficultyModifier } from "@/games/characters/types";
import { CHARACTERS, DIFFICULTY_MODIFIERS } from "@/games/characters/types";
import { Play, Zap, Shield, Target, Star } from "lucide-react";

interface PreGameSelectionProps {
  onStart: (choice: PlayerChoice) => void;
  onCancel: () => void;
}

export function PreGameSelection({ onStart, onCancel }: PreGameSelectionProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterId>("agent");
  const [selectedModifier, setSelectedModifier] = useState<string>("none");
  const [powerUps, setPowerUps] = useState({
    slowTime: true,
    shield: true,
    doublePoints: true,
    speedBoost: true,
  });

  const handleStart = () => {
    const choice: PlayerChoice = {
      character: selectedCharacter,
      difficultyModifier: selectedModifier === "none" ? undefined : selectedModifier,
      powerUpPreferences: powerUps,
    };
    onStart(choice);
  };

  const selectedModifierData = DIFFICULTY_MODIFIERS.find((m) => m.id === selectedModifier) || DIFFICULTY_MODIFIERS[0];
  const selectedCharacterData = CHARACTERS[selectedCharacter];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Prepare for Mission</h2>

      {/* Character Selection */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Choose Your Character</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(CHARACTERS).map(([id, char]) => (
            <button
              key={id}
              onClick={() => setSelectedCharacter(id as CharacterId)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedCharacter === id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900 mb-1">{char.name}</div>
              <div className="text-sm text-slate-600 mb-3">{char.description}</div>
              <div className="space-y-1 text-xs text-slate-500">
                <div>Speed: {(char.stats.speed * 100).toFixed(0)}%</div>
                <div>Shield: {(char.stats.shieldDuration * 100).toFixed(0)}%</div>
                <div>Combo: {(char.stats.comboMultiplier * 100).toFixed(0)}%</div>
                {char.stats.collectibleMagnet > 0 && (
                  <div>Magnet: {char.stats.collectibleMagnet}px</div>
                )}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Difficulty Modifier */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Difficulty Modifier</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {DIFFICULTY_MODIFIERS.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setSelectedModifier(mod.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedModifier === mod.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="font-semibold text-slate-900 mb-1">{mod.name}</div>
              <div className="text-sm text-slate-600 mb-2">{mod.description}</div>
              <div className="space-y-1 text-xs">
                <div className="text-green-600">✓ {mod.advantage}</div>
                <div className="text-red-600">✗ {mod.disadvantage}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Power-up Preferences */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Power-up Preferences</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "slowTime", label: "Slow Time", icon: Zap },
            { key: "shield", label: "Shield", icon: Shield },
            { key: "doublePoints", label: "Double Points", icon: Star },
            { key: "speedBoost", label: "Speed Boost", icon: Target },
          ].map(({ key, label, icon: Icon }) => (
            <label
              key={key}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                powerUps[key as keyof typeof powerUps]
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={powerUps[key as keyof typeof powerUps]}
                onChange={(e) =>
                  setPowerUps((prev) => ({
                    ...prev,
                    [key]: e.target.checked,
                  }))
                }
                className="sr-only"
              />
              <div className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 text-slate-700" />
                <div className="text-sm font-medium text-slate-900">{label}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Summary */}
      <div className="mb-6 p-4 bg-slate-50 rounded-xl">
        <div className="text-sm font-medium text-slate-700 mb-2">Your Setup:</div>
        <div className="text-sm text-slate-600 space-y-1">
          <div>
            <strong>Character:</strong> {selectedCharacterData.name} - {selectedCharacterData.description}
          </div>
          <div>
            <strong>Modifier:</strong> {selectedModifierData.name} - {selectedModifierData.description}
          </div>
          <div>
            <strong>Power-ups enabled:</strong> {Object.values(powerUps).filter(Boolean).length}/4
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={onCancel}
          className="px-6 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleStart}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Mission
        </button>
      </div>
    </div>
  );
}

