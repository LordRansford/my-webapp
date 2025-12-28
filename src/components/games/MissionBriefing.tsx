"use client";

import { useEffect, useState } from "react";
import type { MissionDefinition } from "@/games/missions/types";
import { X, Target, Star, Clock } from "lucide-react";

interface MissionBriefingProps {
  mission: MissionDefinition;
  onStart: () => void;
  onSkip: () => void;
  charisVoice?: { speak: (text: string) => void };
}

export function MissionBriefing({ mission, onStart, onSkip, charisVoice }: MissionBriefingProps) {
  const [showBriefing, setShowBriefing] = useState(true);
  const [autoStartTimer, setAutoStartTimer] = useState(5);

  useEffect(() => {
    // Speak the briefing
    if (charisVoice && showBriefing) {
      // Type guard for CharisVoice instance
      if ('speak' in charisVoice && typeof (charisVoice as any).speak === 'function') {
        // Try calling with interrupt parameter
        try {
          (charisVoice as any).speak(mission.briefing, 10, true);
        } catch {
          // Fallback to single parameter
          (charisVoice as any).speak(mission.briefing);
        }
      }
    }

    // Auto-start countdown
    const timer = setInterval(() => {
      setAutoStartTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [mission.briefing, charisVoice, showBriefing]);

  const handleStart = () => {
    setShowBriefing(false);
    onStart();
  };

  if (!showBriefing) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl p-8 relative">
        <button
          onClick={onSkip}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Skip briefing"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Mission {mission.id}: {mission.title}</h2>
          <p className="text-lg text-slate-600">{mission.description}</p>
        </div>

        <div className="mb-6 p-6 bg-slate-50 rounded-xl">
          <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Briefing
          </h3>
          <p className="text-slate-700 leading-relaxed">{mission.briefing}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-700 mb-3">Objectives</h3>
          <div className="space-y-2">
            {mission.objectives.map((obj) => (
              <div key={obj.id} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-slate-900">{obj.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {mission.sideQuests.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Side Quests
            </h3>
            <div className="space-y-2">
              {mission.sideQuests.map((quest) => (
                <div key={quest.id} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{quest.description}</div>
                    <div className="text-sm text-slate-600 mt-1">Reward: {quest.reward} points</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Duration: ~{Math.round(mission.durationMs / 1000 / 60)} minutes</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="px-6 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Skip
            </button>
            <button
              onClick={handleStart}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
            >
              {autoStartTimer > 0 ? `Start in ${autoStartTimer}s` : "Start Now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

