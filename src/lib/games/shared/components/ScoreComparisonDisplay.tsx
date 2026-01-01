/**
 * Score Comparison Display Component
 * 
 * Beautiful visualization of score comparison, percentile, and ranking
 */

"use client";

import React from "react";
import { TrendingUp, Users, Award, Target } from "lucide-react";
import type { ScoreComparison } from "../scoreComparison/types";

interface ScoreComparisonDisplayProps {
  comparison: ScoreComparison;
  compact?: boolean;
}

export function ScoreComparisonDisplay({
  comparison,
  compact = false,
}: ScoreComparisonDisplayProps) {
  const percentile = Math.round(comparison.percentile);
  const percentileColor =
    percentile >= 90
      ? "text-green-600"
      : percentile >= 75
      ? "text-blue-600"
      : percentile >= 50
      ? "text-amber-600"
      : "text-slate-600";

  const percentileLabel =
    percentile >= 90
      ? "Top 10%"
      : percentile >= 75
      ? "Top 25%"
      : percentile >= 50
      ? "Above Average"
      : "Below Average";

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-slate-500" />
          <span className="font-medium">{percentile}th percentile</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-slate-500" />
          <span>{comparison.participantCount} players</span>
        </div>
        {comparison.playerRank && (
          <div className="flex items-center gap-1">
            <Award className="h-4 w-4 text-slate-500" />
            <span>Rank #{comparison.playerRank}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Percentile Badge */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-slate-50 rounded-xl border border-slate-200">
        <div>
          <div className="text-sm text-slate-600 mb-1">Your Ranking</div>
          <div className={`text-3xl font-bold ${percentileColor}`}>
            {percentile}th Percentile
          </div>
          <div className="text-sm text-slate-600 mt-1">{percentileLabel}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-600 mb-1">Out of</div>
          <div className="text-2xl font-bold text-slate-900">
            {comparison.participantCount}
          </div>
          <div className="text-sm text-slate-600 mt-1">players</div>
        </div>
      </div>

      {/* Percentile Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Percentile Ranking</span>
          <span className={`font-semibold ${percentileColor}`}>
            {percentile}%
          </span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              percentile >= 90
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : percentile >= 75
                ? "bg-gradient-to-r from-blue-500 to-blue-600"
                : percentile >= 50
                ? "bg-gradient-to-r from-amber-500 to-amber-600"
                : "bg-gradient-to-r from-slate-400 to-slate-500"
            }`}
            style={{ width: `${percentile}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {comparison.playerRank && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-slate-500" />
              <span className="text-xs text-slate-600">Rank</span>
            </div>
            <div className="text-xl font-bold text-slate-900">
              #{comparison.playerRank}
            </div>
          </div>
        )}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Target className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600">Your Score</span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {comparison.playerScore?.toFixed(1) || "—"}
          </div>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-slate-500" />
            <span className="text-xs text-slate-600">Average</span>
          </div>
          <div className="text-xl font-bold text-slate-900">
            {comparison.averageScore.toFixed(1)}
          </div>
        </div>
      </div>
    </div>
  );
}