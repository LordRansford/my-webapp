/**
 * Achievement Display Component
 * 
 * Beautiful UI for showing achievements, progress, and notifications
 */

"use client";

import React from "react";
import { Trophy, Star, Award, Lock } from "lucide-react";
import { getAllAchievementDefinitions } from "../achievements/achievementDefinitions";
import { loadAchievementStorage } from "../achievements/achievementStorage";
import type { AchievementDefinition } from "../achievements/types";

interface AchievementDisplayProps {
  achievementIds: string[];
  showProgress?: boolean;
  compact?: boolean;
}

export function AchievementDisplay({
  achievementIds,
  showProgress = false,
  compact = false,
}: AchievementDisplayProps) {
  const definitions = getAllAchievementDefinitions();
  const storage = loadAchievementStorage();
  
  const achievements = achievementIds
    .map((id) => definitions.find((d) => d.id === id))
    .filter((a): a is AchievementDefinition => a !== undefined);

  if (achievements.length === 0) {
    return null;
  }

  const getRarityColor = (rarity: AchievementDefinition["rarity"]) => {
    switch (rarity) {
      case "legendary":
        return "from-purple-500 to-pink-500";
      case "epic":
        return "from-purple-500 to-indigo-500";
      case "rare":
        return "from-blue-500 to-cyan-500";
      case "uncommon":
        return "from-green-500 to-emerald-500";
      default:
        return "from-slate-400 to-slate-500";
    }
  };

  const getRarityIcon = (rarity: AchievementDefinition["rarity"]) => {
    switch (rarity) {
      case "legendary":
      case "epic":
        return Trophy;
      case "rare":
        return Star;
      default:
        return Award;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {achievements.map((achievement) => {
          const Icon = getRarityIcon(achievement.rarity);
          return (
            <div
              key={achievement.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r rounded-lg border border-slate-200"
              style={{
                background: `linear-gradient(to right, var(--tw-gradient-stops))`,
              }}
            >
              <Icon className="h-4 w-4 text-white" />
              <span className="text-xs font-medium text-white">
                {achievement.name}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-slate-900">Achievements</h3>
      <div className="grid grid-cols-1 gap-3">
        {achievements.map((achievement) => {
          const Icon = getRarityIcon(achievement.rarity);
          const progress = storage.progress[achievement.id];
          const isUnlocked = storage.unlocked.some(
            (u) => u.achievementId === achievement.id
          );

          return (
            <div
              key={achievement.id}
              className={`p-4 rounded-xl border-2 ${
                isUnlocked
                  ? `bg-gradient-to-r ${getRarityColor(achievement.rarity)} border-transparent`
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isUnlocked
                      ? "bg-white/20"
                      : "bg-slate-200"
                  }`}
                >
                  {isUnlocked ? (
                    <Icon className="h-6 w-6 text-white" />
                  ) : (
                    <Lock className="h-6 w-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4
                      className={`font-semibold ${
                        isUnlocked ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {achievement.name}
                    </h4>
                    {isUnlocked && (
                      <span className="text-xs text-white/80 px-2 py-0.5 bg-white/20 rounded-full">
                        {achievement.rarity}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm ${
                      isUnlocked ? "text-white/90" : "text-slate-600"
                    }`}
                  >
                    {achievement.description}
                  </p>
                  {showProgress && progress !== undefined && !isUnlocked && (
                    <div className="mt-2">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${progress * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {Math.round(progress * 100)}% complete
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}