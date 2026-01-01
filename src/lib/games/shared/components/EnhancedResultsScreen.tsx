/**
 * Enhanced Results Screen Component
 * 
 * Comprehensive post-game results display with all sharing and comparison features
 */

"use client";

import React from "react";
import { ChallengeCodeShare } from "./ChallengeCodeShare";
import { ScoreComparisonDisplay } from "./ScoreComparisonDisplay";
import { AchievementDisplay } from "./AchievementDisplay";
import { LeaderboardView } from "./LeaderboardView";
import type { ChallengeCode } from "../challengeCodes/types";
import type { ScoreComparison } from "../scoreComparison/types";
import type { ScoreData } from "../scoreComparison/types";

interface EnhancedResultsScreenProps {
  challengeCode: ChallengeCode;
  score: number;
  comparison?: ScoreComparison | null;
  playerScore?: ScoreData;
  achievementIds?: string[];
  gameSlug: string;
  onPlayAgain?: () => void;
  onNewChallenge?: () => void;
}

export function EnhancedResultsScreen({
  challengeCode,
  score,
  comparison,
  playerScore,
  achievementIds = [],
  gameSlug,
  onPlayAgain,
  onNewChallenge,
}: EnhancedResultsScreenProps) {
  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <div className="text-5xl font-bold text-blue-600 mb-2">
          {score.toFixed(1)}
        </div>
        <div className="text-lg text-slate-600">Your Score</div>
      </div>

      {/* Challenge Code Share */}
      <ChallengeCodeShare code={challengeCode} score={score} />

      {/* Score Comparison */}
      {comparison && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <ScoreComparisonDisplay comparison={comparison} />
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <LeaderboardView
          challengeCode={challengeCode.code}
          playerScore={playerScore}
        />
      </div>

      {/* Achievements */}
      {achievementIds.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <AchievementDisplay achievementIds={achievementIds} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {onPlayAgain && (
          <button
            onClick={onPlayAgain}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Play Again
          </button>
        )}
        {onNewChallenge && (
          <button
            onClick={onNewChallenge}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-900 rounded-xl font-medium hover:bg-slate-200 transition-colors"
          >
            New Challenge
          </button>
        )}
      </div>
    </div>
  );
}