/**
 * Analysis Report Component
 * 
 * Displays detailed post-game analysis with performance metrics,
 * insights, and recommendations.
 */

"use client";

import React from 'react';
import type { AnalysisReport } from './analysisReport';

interface AnalysisReportComponentProps {
  report: AnalysisReport;
}

export function AnalysisReportComponent({ report }: AnalysisReportComponentProps) {
  const formatTime = (ms: number): string => {
    const seconds = Math.round(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6" role="region" aria-label="Game analysis report">
      {/* Summary Section */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Session Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <div className="text-sm text-slate-600">Accuracy</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {Math.round(report.summary.accuracy * 100)}%
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Score</div>
            <div className="text-2xl font-bold text-slate-900">
              {report.summary.correct} / {report.summary.totalPuzzles}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Total Time</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900">
              {formatTime(report.summary.totalTime)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Average Time</div>
            <div className="text-lg font-semibold text-slate-700">
              {formatTime(report.summary.averageTime)}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">XP Gained</div>
            <div className="text-lg font-semibold text-sky-600">
              +{report.summary.xpGained}
            </div>
          </div>
          <div>
            <div className="text-sm text-slate-600">Hints Used</div>
            <div className="text-lg font-semibold text-slate-700">
              {report.summary.hintsUsed}
            </div>
          </div>
        </div>
      </div>

      {/* Performance by Type */}
      {Object.keys(report.performance.byType).length > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-6">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">Performance by Type</h3>
          <div className="space-y-3">
            {Object.entries(report.performance.byType).map(([type, stats]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-slate-900 capitalize">{type}</span>
                    <span className="text-sm text-slate-600">
                      {stats.correct}/{stats.count} ({Math.round(stats.accuracy * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        stats.accuracy >= 0.8
                          ? 'bg-emerald-500'
                          : stats.accuracy >= 0.6
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${stats.accuracy * 100}%` }}
                      role="progressbar"
                      aria-valuenow={stats.accuracy * 100}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Avg time: {formatTime(stats.averageTime)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance by Difficulty */}
      {report.performance.byDifficulty.length > 0 && (
        <div className="rounded-lg bg-slate-50 border border-slate-200 p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Performance by Difficulty</h3>
          <div className="space-y-3">
            {report.performance.byDifficulty.map(({ difficulty, count, accuracy }) => (
              <div key={difficulty} className="flex items-center justify-between">
                <span className="font-medium text-slate-900">{difficulty}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-600">{count} puzzles</span>
                  <span className="text-sm font-semibold text-slate-700">
                    {Math.round(accuracy * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="rounded-lg bg-slate-50 border border-slate-200 p-6">
        <h3 className="text-xl font-semibold text-slate-900 mb-4">Insights</h3>
        
        {report.insights.strengths.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-emerald-700 mb-2">Strengths</h4>
            <ul className="space-y-1">
              {report.insights.strengths.map((strength, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-emerald-600" aria-hidden="true">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {report.insights.weaknesses.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-amber-700 mb-2">Areas for Improvement</h4>
            <ul className="space-y-1">
              {report.insights.weaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-amber-600" aria-hidden="true">!</span>
                  <span>{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {report.insights.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-sky-700 mb-2">Recommendations</h4>
            <ul className="space-y-1">
              {report.insights.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-sky-600" aria-hidden="true">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Progression */}
      <div className="rounded-lg bg-sky-50 border border-sky-200 p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-4">Progression</h3>
        <div className="space-y-2">
          <div className="text-sm text-slate-700">
            <strong>Next Milestone:</strong> {report.progression.nextMilestone}
          </div>
        </div>
      </div>
    </div>
  );
}
