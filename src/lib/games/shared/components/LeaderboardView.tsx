/**
 * Leaderboard View Component
 * 
 * Visual leaderboard for challenge codes
 */

"use client";

import React, { useMemo } from "react";
import { Trophy, Medal, Award, TrendingUp } from "lucide-react";
import { getScores } from "../scoreComparison/scoreStorage";
import type { ScoreData } from "../scoreComparison/types";

interface LeaderboardViewProps {
  challengeCode: string;
  playerScore?: ScoreData;
  topN?: number;
}

export function LeaderboardView({
  challengeCode,
  playerScore,
  topN = 10,
}: LeaderboardViewProps) {
  const scores = getScores(challengeCode);
  
  const leaderboard = useMemo(() => {
    const sorted = [...scores]
      .sort((a, b) => b.score - a.score)
      .slice(0, topN);
    
    return sorted.map((score, index) => ({
      ...score,
      rank: index + 1,
      isPlayer: playerScore && score.timestamp === playerScore.timestamp,
    }));
  }, [scores, topN, playerScore]);

  const playerRank = useMemo(() => {
    if (!playerScore) return null;
    const sorted = [...scores].sort((a, b) => b.score - a.score);
    const rank = sorted.findIndex((s) => s.timestamp === playerScore.timestamp) + 1;
    return rank > 0 ? rank : null;
  }, [scores, playerScore]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return Trophy;
    if (rank === 2) return Medal;
    if (rank === 3) return Award;
    return null;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-600";
    if (rank === 2) return "text-slate-400";
    if (rank === 3) return "text-amber-600";
    return "text-slate-600";
  };

  if (leaderboard.length === 0) {
    return (
      <div className="p-6 text-center text-slate-600">
        <p>No scores yet. Be the first to play!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Leaderboard</h3>
        {playerRank && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <TrendingUp className="h-4 w-4" />
            <span>Your rank: #{playerRank}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => {
          const RankIcon = getRankIcon(entry.rank);
          const rankColor = getRankColor(entry.rank);

          return (
            <div
              key={entry.timestamp}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                entry.isPlayer
                  ? "bg-blue-50 border-blue-300 shadow-md"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className={`w-8 text-center font-bold ${rankColor}`}>
                {RankIcon ? (
                  <RankIcon className="h-5 w-5 mx-auto" />
                ) : (
                  <span className="text-sm">#{entry.rank}</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-sm font-medium ${
                      entry.isPlayer ? "text-blue-900" : "text-slate-900"
                    }`}
                  >
                    {entry.isPlayer ? "You" : `Player #${entry.rank}`}
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      entry.isPlayer ? "text-blue-600" : "text-slate-900"
                    }`}
                  >
                    {entry.score.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {scores.length > topN && (
        <div className="text-center text-sm text-slate-600">
          Showing top {topN} of {scores.length} players
        </div>
      )}
    </div>
  );
}