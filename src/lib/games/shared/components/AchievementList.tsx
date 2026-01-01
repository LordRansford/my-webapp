/**
 * Achievement List Component
 * 
 * Displays all achievements in a grid/list format with progress tracking.
 */

"use client";

import React, { useState, useCallback } from "react";
import { Trophy, Lock, CheckCircle, Filter, Search } from "lucide-react";
import type { AchievementDefinition } from "../achievements/types";
import { getAllAchievementDefinitions, getAchievementsByGame } from "../achievements/achievementDefinitions";
import { loadAchievementStorage } from "../achievements/achievementStorage";

interface AchievementListProps {
  gameId?: string; // If provided, filter to this game's achievements
  showProgress?: boolean; // Show progress for locked achievements
  compact?: boolean; // Compact grid view
}

export function AchievementList({
  gameId,
  showProgress = true,
  compact = false,
}: AchievementListProps) {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const userData = loadAchievementStorage();
  
  // Filter achievements
  let filtered = gameId
    ? getAchievementsByGame(gameId)
    : getAllAchievementDefinitions();

  // Apply search
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(a =>
      a.name.toLowerCase().includes(query) ||
      a.description.toLowerCase().includes(query)
    );
  }

  // Apply rarity filter
  if (selectedRarity !== 'all') {
    filtered = filtered.filter(a => a.rarity === selectedRarity);
  }

  // Apply unlock filter
  if (filter === 'unlocked') {
    filtered = filtered.filter(a => userData.unlocked.has(a.id));
  } else if (filter === 'locked') {
    filtered = filtered.filter(a => !userData.unlocked.has(a.id));
  }

  const getProgress = (achievement: AchievementDefinition): number => {
    if (userData.unlocked.some(u => u.achievementId === achievement.id)) return 100;
    if (!achievement.progressCondition) return 0;
    
    const progress = userData.progress[achievement.id] || 0;
    return Math.min(100, progress * 100);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-slate-300 bg-slate-50';
      case 'uncommon': return 'border-green-300 bg-green-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      default: return 'border-slate-300 bg-slate-50';
    }
  };

  const getRarityLabel = (rarity: string) => {
    return rarity.charAt(0).toUpperCase() + rarity.slice(1);
  };

  if (compact) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((achievement) => {
          const isUnlocked = userData.unlocked.some(u => u.achievementId === achievement.id);
          const progress = getProgress(achievement);
          
          return (
            <div
              key={achievement.id}
              className={`rounded-lg border-2 p-3 ${
                isUnlocked
                  ? 'border-blue-500 bg-blue-50'
                  : getRarityColor(achievement.rarity)
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isUnlocked ? (
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                ) : (
                  <Lock className="h-5 w-5 text-slate-400" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-900 truncate">
                    {achievement.name}
                  </div>
                  <div className="text-xs text-slate-600 truncate">
                    {achievement.description}
                  </div>
                </div>
              </div>
              {showProgress && !isUnlocked && progress > 0 && (
                <div className="w-full bg-slate-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="unlocked">Unlocked</option>
            <option value="locked">Locked</option>
          </select>
        </div>
        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value)}
          className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((achievement) => {
          const isUnlocked = userData.unlocked.some(u => u.achievementId === achievement.id);
          const progress = getProgress(achievement);
          
          return (
            <div
              key={achievement.id}
              className={`rounded-xl border-2 p-4 ${
                isUnlocked
                  ? 'border-blue-500 bg-blue-50'
                  : getRarityColor(achievement.rarity)
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">
                  {isUnlocked ? (
                    <Trophy className="h-8 w-8 text-blue-600" />
                  ) : (
                    <Lock className="h-8 w-8 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold text-slate-900">
                      {achievement.name}
                    </h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/50 text-slate-700">
                      {getRarityLabel(achievement.rarity)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">
                    {achievement.description}
                  </p>
                  {showProgress && !isUnlocked && achievement.progressCondition && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Progress</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          No achievements found matching your filters.
        </div>
      )}
    </div>
  );
}
