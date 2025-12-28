"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createCanvasView } from "@/games/engine/canvasView";
import { createFixedTimestepLoop } from "@/games/engine/loop";
import { createInputController } from "@/games/engine/input";
import { createAudioController } from "@/games/engine/audio";
import { PersistStore } from "@/games/engine/persist";
import type { GameSettings } from "@/games/engine/types";
import type { MissionId } from "@/games/missions/types";
import type { PlayerChoice } from "@/games/characters/types";
import { createMissionScene } from "@/games/scenes/missionScene";
import { createCampaignProgressStore } from "@/games/missions/progress";
import { useAccessibility } from "@/components/accessibility/AccessibilityProvider";

interface MissionGameShellProps {
  missionId: MissionId;
  playerChoice: PlayerChoice;
  onComplete: (won: boolean, stars: 0 | 1 | 2 | 3, objectivesCompleted: string[], sideQuestsCompleted: string[], timeMs: number) => void;
  onCancel: () => void;
}

export function MissionGameShell({ missionId, playerChoice, onComplete, onCancel }: MissionGameShellProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const store = useMemo(() => new PersistStore({ prefix: "rn_games", version: "v1" }), []);
  const campaignProgress = useMemo(() => createCampaignProgressStore(store), [store]);
  const [paused, setPaused] = useState(false);
  const { prefs } = useAccessibility();
  const [settings, setSettings] = useState<GameSettings>(() => ({
    muted: store.get("muted", false),
    reduceMotion: store.get("reduceMotion", false),
    highContrast: store.get("highContrast", true),
  }));

  useEffect(() => {
    setSettings((s) => ({
      ...s,
      reduceMotion: prefs.reducedMotion,
      highContrast: prefs.highContrast ?? s.highContrast ?? true,
    }));
  }, [prefs.reducedMotion, prefs.highContrast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const view = createCanvasView(canvas);
    const canvasInput = createInputController(canvas);
    const windowInput = createInputController(window);
    const input = {
      getState: () => {
        const canvasState = canvasInput.getState();
        const windowState = windowInput.getState();
        return {
          moveX: canvasState.moveX || windowState.moveX,
          moveY: canvasState.moveY || windowState.moveY,
          pausePressed: canvasState.pausePressed || windowState.pausePressed,
          actionPressed: canvasState.actionPressed || windowState.actionPressed,
        };
      },
      resetFrame: () => {
        canvasInput.resetFrame();
        windowInput.resetFrame();
      },
      dispose: () => {
        canvasInput.dispose();
        windowInput.dispose();
      },
      bindings: canvasInput.bindings,
    };

    const audio = createAudioController();
    audio.setMuted(settings.muted);
    audio.start();

    campaignProgress.incrementAttempts(missionId);
    campaignProgress.updateMissionStatus(missionId, "in-progress");

    const scene = createMissionScene({
      missionId,
      playerChoice,
      onComplete: (won, stars, objectivesCompleted, sideQuestsCompleted, timeMs) => {
        if (won) {
          campaignProgress.completeMission(missionId, stars, objectivesCompleted, sideQuestsCompleted, timeMs);
          campaignProgress.addPoints(Math.floor(timeMs / 100) + stars * 100);
        }
        campaignProgress.updateMissionStatus(missionId, won ? "completed" : "available");
        onComplete(won, stars, objectivesCompleted, sideQuestsCompleted, timeMs);
      },
      onAudio: (p) => {
        audio.setIntensity(p.intensity);
        audio.setTension(p.tension);
      },
      onMilestone: () => audio.cueMilestone(),
    });

    const loop = createFixedTimestepLoop({
      canvas: view.canvas,
      ctx2d: view.ctx2d,
      getSize: () => ({ width: view.width, height: view.height, dpr: view.dpr }),
      scene,
      getInput: () => input.getState(),
      getSettings: () => settings,
      onFrameEnd: () => {
        input.resetFrame();
      },
    });

    loop.start();
    loop.setPaused(paused);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      loop.dispose();
      loop.stop();
      scene.dispose();
      view.dispose();
      input.dispose();
      audio.stop();
      audio.dispose();
    };
  }, [missionId, playerChoice, settings, paused, campaignProgress, onComplete]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              Exit
            </button>
            <button
              onClick={() => setPaused((p) => !p)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              onClick={() => setSettings((s) => ({ ...s, muted: !s.muted }))}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
            >
              {settings.muted ? "Unmute" : "Mute"}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full h-full overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full touch-none" aria-label="Game canvas" role="img" />
      </div>
    </div>
  );
}

