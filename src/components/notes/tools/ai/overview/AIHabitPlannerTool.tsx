"use client";

import { useState, useMemo } from "react";
import { LazyMotion, domAnimation, m, useReducedMotion } from "framer-motion";
import { CheckCircle2, Calendar, Flame, Target, Plus, Download, Share2, Trash2 } from "lucide-react";
import { useHabitPlanner } from "./useHabitPlanner";
import { AI_HABITS, Habit, getHabitsByCategory } from "./HabitLibrary";
import { motionPresets, reducedMotionProps } from "@/lib/motion.js";

// Helper function to get today's date as ISO string (YYYY-MM-DD)
function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * AI Habit Planner Tool
 * 
 * Interactive tool for planning and tracking AI learning habits.
 * Features:
 * - Habit selection from pre-defined library or custom creation
 * - Week-based planning and progress tracking
 * - Streak counter
 * - localStorage persistence
 * - Export/share capabilities
 * - Full keyboard navigation and screen reader support
 */
export default function AIHabitPlannerTool() {
  const {
    state,
    selectHabit,
    setCustomHabit,
    startHabit,
    markCompleted,
    unmarkCompleted,
    updateNotes,
    deleteEntry,
    reset,
    getCurrentWeekDates,
    getActiveEntry,
  } = useHabitPlanner();

  const [selectedCategory, setSelectedCategory] = useState<Habit["category"] | "all">("all");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [viewMode, setViewMode] = useState<"select" | "track">("select");
  const reduce = useReducedMotion();

  const activeEntry = getActiveEntry();
  const weekDates = getCurrentWeekDates();

  // Filter habits by category
  const filteredHabits = useMemo(() => {
    if (selectedCategory === "all") return AI_HABITS;
    return getHabitsByCategory(selectedCategory);
  }, [selectedCategory]);

  // Get habit details for active entry
  const activeHabitDetails = useMemo(() => {
    if (!activeEntry) return null;
    if (activeEntry.customHabit) {
      return {
        label: activeEntry.customHabit,
        description: "Custom habit",
        category: "general" as const,
        difficulty: "medium" as const,
        estimatedMinutes: 10,
      };
    }
    return AI_HABITS.find((h) => h.id === activeEntry.habitId);
  }, [activeEntry]);

  // Calculate week progress
  const weekProgress = useMemo(() => {
    if (!activeEntry) return { completed: 0, total: 7 };
    const completed = weekDates.filter((date) => activeEntry.completedDates.includes(date)).length;
    return { completed, total: 7 };
  }, [activeEntry, weekDates]);

  // Handle habit selection
  const handleSelectHabit = (habit: Habit) => {
    selectHabit(habit);
    setShowCustomInput(false);
  };

  // Handle custom habit
  const handleCustomHabit = () => {
    if (state.customHabit.trim()) {
      startHabit();
      setViewMode("track");
      setShowCustomInput(false);
    }
  };

  // Handle start habit
  const handleStartHabit = () => {
    if (state.selectedHabit || state.customHabit.trim()) {
      startHabit();
      setViewMode("track");
    }
  };

  // Export data as JSON
  const handleExport = () => {
    const data = {
      entries: state.entries,
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ai-habit-planner-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share data (copy to clipboard)
  const handleShare = async () => {
    const summary = `AI Habit Planner Summary:
Current Streak: ${state.currentStreak} days
Longest Streak: ${state.longestStreak} days
Active Habits: ${state.entries.length}
Completed This Week: ${weekProgress.completed}/7 days

Keep building your AI skills! 🧠`;
    
    try {
      await navigator.clipboard.writeText(summary);
      alert("Summary copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  };

  // Get difficulty badge color
  const getDifficultyColor = (difficulty: Habit["difficulty"]): string => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "medium":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "hard":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <LazyMotion features={domAnimation}>
      <div className="space-y-4 text-sm">
        {/* Header with stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Current Streak</div>
                <div className="text-lg font-bold text-slate-900">{state.currentStreak} days</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" aria-hidden="true" />
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Longest Streak</div>
                <div className="text-lg font-bold text-slate-900">{state.longestStreak} days</div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Export habit data"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export
            </button>
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
              aria-label="Share habit summary"
            >
              <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>

        {/* Main content area */}
        {viewMode === "select" ? (
          <m.div
            {...reducedMotionProps(reduce, motionPresets.fadeIn)}
            className="space-y-4"
          >
            <div>
              <h3 className="mb-3 text-base font-semibold text-slate-900">Choose a habit to practise</h3>
              <p className="mb-4 text-sm text-slate-600">
                Pick one daily habit from this track. Do it twice this week and note what slowed you down.
              </p>
            </div>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {(["all", "foundations", "intermediate", "advanced", "general"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    selectedCategory === cat
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                  aria-pressed={selectedCategory === cat}
                >
                  {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>

            {/* Habit list */}
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredHabits.map((habit) => (
                <button
                  key={habit.id}
                  onClick={() => handleSelectHabit(habit)}
                  className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                    state.selectedHabit?.id === habit.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                  }`}
                  aria-pressed={state.selectedHabit?.id === habit.id}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-sm font-semibold text-slate-900">{habit.label}</div>
                      <div className="mb-2 text-xs text-slate-600">{habit.description}</div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${getDifficultyColor(
                            habit.difficulty
                          )}`}
                        >
                          {habit.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">~{habit.estimatedMinutes} min</span>
                      </div>
                    </div>
                    {state.selectedHabit?.id === habit.id && (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom habit option */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="flex w-full items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Create custom habit
                </button>
              ) : (
                <div className="space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-slate-700">Custom habit</span>
                    <input
                      type="text"
                      value={state.customHabit}
                      onChange={(e) => setCustomHabit(e.target.value)}
                      placeholder="e.g., Review one AI paper per week"
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label="Custom habit description"
                    />
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCustomHabit}
                      disabled={!state.customHabit.trim()}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start tracking
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomInput(false);
                        setCustomHabit("");
                      }}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Start button for selected habit */}
            {state.selectedHabit && (
              <m.div
                {...reducedMotionProps(reduce, motionPresets.slideUp)}
                className="rounded-2xl border border-blue-200 bg-blue-50 p-4"
              >
                <div className="mb-3">
                  <div className="mb-1 text-sm font-semibold text-slate-900">Selected: {state.selectedHabit.label}</div>
                  <div className="text-xs text-slate-600">{state.selectedHabit.description}</div>
                </div>
                <button
                  onClick={handleStartHabit}
                  className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Start tracking this habit
                </button>
              </m.div>
            )}
          </m.div>
        ) : (
          <m.div
            {...reducedMotionProps(reduce, motionPresets.fadeIn)}
            className="space-y-4"
          >
            {activeEntry && activeHabitDetails ? (
              <>
                {/* Active habit header */}
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 text-base font-semibold text-slate-900">{activeHabitDetails.label}</div>
                      <div className="text-sm text-slate-600">{activeHabitDetails.description}</div>
                    </div>
                    <button
                      onClick={() => {
                        deleteEntry(state.entries.findIndex((e) => e === activeEntry));
                        setViewMode("select");
                      }}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200"
                      aria-label="Delete habit"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>Started: {formatDateDisplay(activeEntry.startDate)}</span>
                    <span>Completed: {activeEntry.completedDates.length} times</span>
                  </div>
                </div>

                {/* Week progress */}
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-slate-600" aria-hidden="true" />
                      <h3 className="text-base font-semibold text-slate-900">This Week</h3>
                    </div>
                    <div className="text-sm font-semibold text-slate-700">
                      {weekProgress.completed}/{weekProgress.total} days
                    </div>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {weekDates.map((date) => {
                      const isCompleted = activeEntry.completedDates.includes(date);
                      const today = getTodayDate();
                      const isToday = date === today;
                      const dateObj = new Date(date);
                      const dayName = dateObj.toLocaleDateString("en-GB", { weekday: "short" });
                      const dayNum = dateObj.getDate();

                      return (
                        <button
                          key={date}
                          onClick={() => {
                            const entryIndex = state.entries.findIndex((e) => e === activeEntry);
                            if (entryIndex >= 0) {
                              if (isCompleted) {
                                unmarkCompleted(entryIndex, date);
                              } else {
                                markCompleted(entryIndex);
                              }
                            }
                          }}
                          className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-xs transition focus:outline-none focus:ring-2 focus:ring-blue-200 ${
                            isCompleted
                              ? "border-emerald-500 bg-emerald-50 text-emerald-900"
                              : isToday
                              ? "border-blue-300 bg-blue-50 text-blue-900"
                              : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-white"
                          }`}
                          aria-pressed={isCompleted}
                          aria-label={`${dayName} ${dayNum} - ${isCompleted ? "Completed" : "Not completed"}`}
                        >
                          <span className="font-semibold">{dayName}</span>
                          <span className="text-lg font-bold">{dayNum}</span>
                          {isCompleted && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notes section */}
                <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-slate-900">Notes</span>
                    <textarea
                      value={activeEntry.notes}
                      onChange={(e) => {
                        const entryIndex = state.entries.findIndex((e) => e === activeEntry);
                        if (entryIndex >= 0) {
                          updateNotes(entryIndex, e.target.value);
                        }
                      }}
                      placeholder="Note what slowed you down, what worked well, or any insights..."
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      aria-label="Habit tracking notes"
                    />
                  </label>
                </div>

                {/* Back to selection */}
                <button
                  onClick={() => setViewMode("select")}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Choose a different habit
                </button>
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 text-center text-sm text-slate-600">
                No active habit. <button
                  onClick={() => setViewMode("select")}
                  className="font-semibold text-blue-600 underline hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
                >
                  Choose one to start tracking
                </button>
              </div>
            )}
          </m.div>
        )}
      </div>
    </LazyMotion>
  );
}

