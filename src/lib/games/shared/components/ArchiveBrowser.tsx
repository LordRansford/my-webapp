/**
 * Archive Browser Component
 * 
 * Displays archived game runs for viewing and replay.
 * Generic component that works with any game's archive system.
 */

"use client";

import React, { useState, useCallback } from "react";
import { Calendar, Clock, Trophy, Play, Eye, Filter } from "lucide-react";

export interface ArchivedRun {
  id: string;
  date: string; // YYYY-MM-DD
  gameId: string;
  challengeCode?: string;
  score: number;
  timeSpent: number; // milliseconds
  completedAt: number; // timestamp
  outcome?: 'win' | 'loss';
  metadata?: Record<string, any>; // Game-specific data
}

interface ArchiveBrowserProps {
  gameId: string;
  archivedRuns: ArchivedRun[];
  onReplay?: (run: ArchivedRun) => void;
  onView?: (run: ArchivedRun) => void;
  emptyMessage?: string;
}

export function ArchiveBrowser({
  gameId,
  archivedRuns,
  onReplay,
  onView,
  emptyMessage = "No archived runs yet. Complete a game to see it here!",
}: ArchiveBrowserProps) {
  const [filter, setFilter] = useState<'all' | 'win' | 'loss'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'time'>('date');

  const filteredRuns = archivedRuns
    .filter(run => {
      if (filter === 'all') return true;
      return run.outcome === filter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.date.localeCompare(a.date);
        case 'score':
          return b.score - a.score;
        case 'time':
          return a.timeSpent - b.timeSpent;
        default:
          return 0;
      }
    });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  if (archivedRuns.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-600" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Runs</option>
            <option value="win">Wins Only</option>
            <option value="loss">Losses Only</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="date">Date (Newest)</option>
            <option value="score">Score (Highest)</option>
            <option value="time">Time (Fastest)</option>
          </select>
        </div>
        <div className="text-sm text-slate-600 ml-auto">
          {filteredRuns.length} run{filteredRuns.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Archive List */}
      <div className="space-y-2">
        {filteredRuns.map((run) => (
          <div
            key={run.id}
            className="rounded-lg border border-slate-200 bg-white p-4 hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900">
                      {formatDate(run.date)}
                    </span>
                  </div>
                  {run.outcome && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        run.outcome === 'win'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {run.outcome === 'win' ? 'Win' : 'Loss'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>Score: {run.score.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(run.timeSpent)}</span>
                  </div>
                  {run.challengeCode && (
                    <div className="text-xs font-mono text-slate-500">
                      {run.challengeCode}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                {onView && (
                  <button
                    onClick={() => onView(run)}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                )}
                {onReplay && (
                  <button
                    onClick={() => onReplay(run)}
                    className="px-3 py-1.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
                  >
                    <Play className="h-4 w-4" />
                    Replay
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
