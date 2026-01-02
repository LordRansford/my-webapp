/**
 * Progress Dashboard Component
 * 
 * Cross-game progress visualization
 */

"use client";

import React from "react";
import { Trophy, TrendingUp, Calendar, Target } from "lucide-react";
import { getStreakDataForGame } from "../streakTracking";
import { getAchievementStats } from "../achievements";
import { getAllChallengeCodes } from "../challengeCodes/challengeCodeManager";

interface ProgressDashboardProps {
  gameIds: string[];
  compact?: boolean;
}

export function ProgressDashboard({
  gameIds,
  compact = false,
}: ProgressDashboardProps) {
  const streaks = gameIds.map(id => ({
    gameId: id,
    data: getStreakDataForGame(id),
  }));

  const totalStreak = streaks.reduce((sum, s) => sum + (s.data.currentStreak || 0), 0);
  const longestStreak = Math.max(...streaks.map(s => s.data.longestStreak || 0), 0);
  
  const { loadAchievementStorage } = require("../achievements/achievementStorage");
  const storage = loadAchievementStorage();
  const { getAllAchievementDefinitions } = require("../achievements/achievementDefinitions");
  const definitions = getAllAchievementDefinitions();
  const achievements = {
    unlocked: storage.unlocked.length,
    total: definitions.length,
  };
  const allCodes = getAllChallengeCodes();
  const gamesCompleted = allCodes.length;

  if (compact) {
    return (
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Current Streak</div>
          <div className="text-2xl font-bold text-slate-900">{totalStreak}</div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Achievements</div>
          <div className="text-2xl font-bold text-slate-900">
            {achievements.unlocked} / {achievements.total}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="text-xs text-slate-600 mb-1">Games Played</div>
          <div className="text-2xl font-bold text-slate-900">{gamesCompleted}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900">Your Progress</h3>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Current Streak</span>
          </div>
          <div className="text-3xl font-bold text-blue-900">{totalStreak}</div>
          <div className="text-xs text-blue-700 mt-1">days</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Longest Streak</span>
          </div>
          <div className="text-3xl font-bold text-purple-900">{longestStreak}</div>
          <div className="text-xs text-purple-700 mt-1">days</div>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="h-5 w-5 text-amber-600" />
            <span className="text-sm font-medium text-amber-900">Achievements</span>
          </div>
          <div className="text-3xl font-bold text-amber-900">
            {achievements.unlocked}
          </div>
          <div className="text-xs text-amber-700 mt-1">
            of {achievements.total}
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-900">Games Played</span>
          </div>
          <div className="text-3xl font-bold text-green-900">{gamesCompleted}</div>
          <div className="text-xs text-green-700 mt-1">challenges</div>
        </div>
      </div>

      {/* Streak Breakdown */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-slate-900">Streaks by Game</h4>
        <div className="space-y-2">
          {streaks.map(({ gameId, data }) => (
            <div key={gameId} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-700 capitalize">
                {gameId.replace(/-/g, ' ')}
              </span>
              <span className="text-sm font-bold text-slate-900">
                {data.currentStreak} days
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}