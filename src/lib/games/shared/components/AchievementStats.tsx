/**
 * Achievement Statistics Display
 * 
 * Shows achievement progress and statistics.
 */

"use client";

import React from "react";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { getAllAchievementDefinitions, getAchievementsByGame } from "../achievements/achievementDefinitions";
import { loadAchievementStorage } from "../achievements/achievementStorage";

interface AchievementStatsProps {
  gameId?: string; // If provided, filter to this game's achievements
  compact?: boolean; // Compact display
}

export function AchievementStats({
  gameId,
  compact = false,
}: AchievementStatsProps) {
  const userData = loadAchievementStorage();

  const filtered = gameId
    ? getAchievementsByGame(gameId)
    : getAllAchievementDefinitions();

  const unlocked = filtered.filter(a => userData.unlocked.some(u => u.achievementId === a.id));
  const locked = filtered.filter(a => !userData.unlocked.some(u => u.achievementId === a.id));
  
  const completionRate = filtered.length > 0
    ? (unlocked.length / filtered.length) * 100
    : 0;

  // Calculate progress for locked achievements
  const inProgress = locked.filter(a => {
    if (!a.progressCondition) return false;
    const progress = userData.progress[a.id] || 0;
    return progress > 0 && progress < 1;
  });

  // Count by rarity
  const rarityCounts = {
    common: unlocked.filter(a => a.rarity === 'common').length,
    uncommon: unlocked.filter(a => a.rarity === 'uncommon').length,
    rare: unlocked.filter(a => a.rarity === 'rare').length,
    epic: unlocked.filter(a => a.rarity === 'epic').length,
    legendary: unlocked.filter(a => a.rarity === 'legendary').length,
  };

  if (compact) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-900">Achievements</h3>
          <div className="text-sm font-bold text-blue-600">
            {unlocked.length} / {filtered.length}
          </div>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${completionRate}%` }}
          />
        </div>
        <div className="text-xs text-slate-600 mt-2">
          {Math.round(completionRate)}% complete
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            <div className="text-sm text-slate-600">Unlocked</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {unlocked.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            of {filtered.length} total
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-green-600" />
            <div className="text-sm text-slate-600">Completion</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {Math.round(completionRate)}%
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2">
            <div
              className="bg-green-600 h-1.5 rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-yellow-600" />
            <div className="text-sm text-slate-600">In Progress</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {inProgress.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            actively working on
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-purple-600" />
            <div className="text-sm text-slate-600">Locked</div>
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {locked.length}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            not yet unlocked
          </div>
        </div>
      </div>

      {/* Rarity Breakdown */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">
          Unlocked by Rarity
        </h3>
        <div className="grid grid-cols-5 gap-3">
          <div className="text-center">
            <div className="text-lg font-bold text-slate-900">
              {rarityCounts.common}
            </div>
            <div className="text-xs text-slate-600">Common</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {rarityCounts.uncommon}
            </div>
            <div className="text-xs text-slate-600">Uncommon</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {rarityCounts.rare}
            </div>
            <div className="text-xs text-slate-600">Rare</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {rarityCounts.epic}
            </div>
            <div className="text-xs text-slate-600">Epic</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {rarityCounts.legendary}
            </div>
            <div className="text-xs text-slate-600">Legendary</div>
          </div>
        </div>
      </div>
    </div>
  );
}
