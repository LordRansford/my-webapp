"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createCanvasView } from "@/games/engine/canvasView";
import { createFixedTimestepLoop } from "@/games/engine/loop";
import { createInputController } from "@/games/engine/input";
import { createAudioController } from "@/games/engine/audio";
import { PersistStore } from "@/games/engine/persist";
import type { GameSettings } from "@/games/engine/types";
import { useOfflineReady } from "../SwStatus.client";
import { GAME_LOADING_DEDICATION_LINES } from "@/games/dedication";
import { GAMES_COPY } from "@/games/dedication";
import { GAMES_LEARNING } from "@/games/dedication";
import { getGameMeta } from "@/games/registry";
import { createGamesProgressStore } from "@/games/progress";
import { utcDateId } from "@/games/seed";
import { createDailyChallengeScene } from "@/games/scenes/dailyChallengeScene";
import { createPlayerOneScene } from "@/games/scenes/playerOneScene";
import { createDevRoomScene } from "@/games/scenes/devRoomScene";
import { analyzeRun, type RunMetrics } from "@/games/coaching";

export default function GameShellClient({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const store = useMemo(() => new PersistStore({ prefix: "rn_games", version: "v1" }), []);
  const progress = useMemo(() => createGamesProgressStore(store), [store]);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => ({
    muted: store.get("muted", false),
    reduceMotion: store.get("reduceMotion", false),
  }));
  const { ready: offlineReady } = useOfflineReady();
  const [showLoadingDedication, setShowLoadingDedication] = useState(true);
  const [loadingOpacity, setLoadingOpacity] = useState(0);
  const loadingLine = useMemo(() => {
    const lines = [...GAME_LOADING_DEDICATION_LINES];
    return lines[Math.floor(Math.random() * lines.length)];
  }, []);

  const meta = useMemo(() => getGameMeta(slug), [slug]);
  const [started, setStarted] = useState(() => slug !== "daily" && slug !== "player-one");
  const [practiceMode, setPracticeMode] = useState(false);
  const [dailyDateId] = useState(() => utcDateId());
  const [dailyStatus, setDailyStatus] = useState(() => progress.getDaily(dailyDateId));
  const [unlocked, setUnlocked] = useState(() => progress.get().charisTrophyUnlocked);
  const [devRoomUnlocked, setDevRoomUnlocked] = useState(() => progress.get().devRoomUnlocked);
  const [runSummary, setRunSummary] = useState<null | { metrics: RunMetrics }>(null);
  const [showLearning, setShowLearning] = useState(false);

  useEffect(() => {
    store.set("muted", settings.muted);
    store.set("reduceMotion", settings.reduceMotion);
  }, [settings, store]);

  useEffect(() => {
    // Refresh any locally-stored progress that can change between renders.
    setDailyStatus(progress.getDaily(dailyDateId));
    setUnlocked(progress.get().charisTrophyUnlocked);
    setDevRoomUnlocked(progress.get().devRoomUnlocked);
  }, [dailyDateId, progress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!meta) return;
    if (!started) return;
    if (meta.requiresCharisTrophy && !unlocked) return;
    if (meta.requiresDevRoomUnlock && !devRoomUnlocked) return;

    const view = createCanvasView(canvas);
    const input = createInputController(window);
    const audio = createAudioController();
    audio.setMuted(settings.muted);
    // Dev Room starts in silence by design.
    if (meta.id !== "dev-room") audio.start();

    // Local telemetry: keep a short window and compute simple metrics at end-of-run.
    let lastMoveX = 0;
    let lastMoveY = 0;
    let moveChanges = 0;
    let overCorrects = 0;
    let actionPresses = 0;
    let frames = 0;
    let peakIntensity = 0;
    let intensity = 0;
    let tension = 0;
    let runStartMs = 0;

    const scene =
      meta.id === "daily"
        ? createDailyChallengeScene({
            dateId: dailyDateId,
            practice: practiceMode,
            onComplete: (won, runMs) => {
              const runS = runMs / 1000;
              const metrics: RunMetrics = {
                runMs,
                inputChangeRate: frames ? moveChanges / frames : 0,
                overcorrectRate: frames ? overCorrects / frames : 0,
                actionRate: runS > 0 ? actionPresses / runS : 0,
                peakIntensity,
              };
              setRunSummary({ metrics });

              if (won && !practiceMode) {
                progress.markDailyCompleted(dailyDateId);
                setDailyStatus(progress.getDaily(dailyDateId));
                setUnlocked(progress.get().charisTrophyUnlocked);
                setDevRoomUnlocked(progress.tryUnlockDevRoom());
              }
              audio.cueFail();
            },
            onAudio: (p) => {
              intensity = p.intensity;
              tension = p.tension;
            },
            onMilestone: () => audio.cueMilestone(),
          })
        : meta.id === "player-one"
          ? createPlayerOneScene({
              bestMs: () => progress.get().bestPlayerOneMs,
              onRunEnd: (ms) => {
                progress.setBestPlayerOneMs(ms);
                audio.cueFail();
                const runS = ms / 1000;
                const metrics: RunMetrics = {
                  runMs: ms,
                  inputChangeRate: frames ? moveChanges / frames : 0,
                  overcorrectRate: frames ? overCorrects / frames : 0,
                  actionRate: runS > 0 ? actionPresses / runS : 0,
                  peakIntensity,
                };
                setRunSummary({ metrics });

                // Near-perfect run detector (threshold defined here; stored locally).
                const nearPerfect = ms >= 60_000 && metrics.overcorrectRate < 0.18 && metrics.inputChangeRate < 0.55;
                if (nearPerfect) {
                  progress.markNearPerfectRunDetected();
                  setDevRoomUnlocked(progress.tryUnlockDevRoom());
                }
              },
              onAudio: (p) => {
                intensity = p.intensity;
                tension = p.tension;
              },
            })
          : meta.id === "dev-room"
            ? createDevRoomScene({
                endAlreadySeen: () => progress.get().devRoomEndSeen,
                onEnd: () => {
                  // One-time end message state is stored; message itself is drawn by the scene.
                  progress.markDevRoomEndSeen();
                },
              })
          : meta.scene();

    const loop = createFixedTimestepLoop({
      canvas: view.canvas,
      ctx2d: view.ctx2d,
      getSize: () => ({ width: view.width, height: view.height, dpr: view.dpr }),
      scene,
      getInput: () => input.getState(),
      getSettings: () => settings,
      onFrameEnd: () => {
        if (!runStartMs) runStartMs = performance.now();
        const st = input.getState();
        frames += 1;
        if (st.actionPressed) actionPresses += 1;
        const dx = st.moveX - lastMoveX;
        const dy = st.moveY - lastMoveY;
        if (dx !== 0 || dy !== 0) moveChanges += 1;
        if (Math.sign(st.moveX) !== Math.sign(lastMoveX) && Math.abs(st.moveX) > 0 && Math.abs(lastMoveX) > 0) overCorrects += 1;
        if (Math.sign(st.moveY) !== Math.sign(lastMoveY) && Math.abs(st.moveY) > 0 && Math.abs(lastMoveY) > 0) overCorrects += 1;
        lastMoveX = st.moveX;
        lastMoveY = st.moveY;

        peakIntensity = Math.max(peakIntensity, intensity);
        if (meta.id !== "dev-room") {
          audio.setIntensity(intensity);
          audio.setTension(tension);
        }

        input.resetFrame();
      },
    });

    let startTimer: number | undefined;
    let fadeTimer: number | undefined;
    let inTimer: number | undefined;
    // Fade out and remove the loading dedication before gameplay starts.
    if (showLoadingDedication) {
      setLoadingOpacity(0);
      inTimer = window.setTimeout(() => setLoadingOpacity(1), 30);
      startTimer = window.setTimeout(() => setLoadingOpacity(0), 900);
      fadeTimer = window.setTimeout(() => {
        setShowLoadingDedication(false);
        loop.start();
      }, 1300);
    } else {
      loop.start();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPaused((p) => !p);
    };
    window.addEventListener("keydown", onKey);

    // Keep loop paused state in sync.
    loop.setPaused(paused);

    return () => {
      window.removeEventListener("keydown", onKey);
      if (startTimer) window.clearTimeout(startTimer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (inTimer) window.clearTimeout(inTimer);
      loop.dispose();
      loop.stop();
      scene.dispose();
      view.dispose();
      input.dispose();
      audio.stop();
      audio.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, settings.muted, settings.reduceMotion, showLoadingDedication, started, unlocked, devRoomUnlocked, paused, meta]);

  const onStartDaily = () => {
    if (!practiceMode) progress.markDailyAttempted(dailyDateId);
    setDailyStatus(progress.getDaily(dailyDateId));
    setShowLoadingDedication(true);
    setStarted(true);
  };

  const onStartPlayerOne = () => {
    setShowLoadingDedication(true);
    setStarted(true);
  };

  return (
    <div className="relative w-full">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {offlineReady ? "Offline ready" : "Preparing offline"}
          </span>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
            {slug}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="rounded-full border px-3 py-1 text-sm font-semibold" onClick={() => setPaused((p) => !p)}>
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            className="rounded-full border px-3 py-1 text-sm font-semibold"
            onClick={() => setSettings((s) => ({ ...s, muted: !s.muted }))}
          >
            {settings.muted ? "Unmute" : "Mute"}
          </button>
          <button
            className="rounded-full border px-3 py-1 text-sm font-semibold"
            onClick={() => setSettings((s) => ({ ...s, reduceMotion: !s.reduceMotion }))}
          >
            {settings.reduceMotion ? "Motion: reduced" : "Motion: normal"}
          </button>
        </div>
      </div>

      {!meta ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.notFoundTitle}</p>
          <p className="mt-2 m-0">{GAMES_COPY.notFoundBody}</p>
        </div>
      ) : null}

      {meta?.requiresCharisTrophy && !unlocked ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.playerOneLockedTitle}</p>
          <p className="mt-2 m-0">{GAMES_COPY.playerOneLockedBody}</p>
          <p className="mt-3 m-0 text-xs text-slate-600">
            Charis Trophy progress: {progress.get().charisTrophyProgress}/{progress.TROPHY_TARGET}
          </p>
        </div>
      ) : null}

      {meta?.requiresDevRoomUnlock && !devRoomUnlocked ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.devRoomLockedTitle}</p>
          <p className="mt-2 m-0">{GAMES_COPY.devRoomLockedBody}</p>
          <p className="mt-3 m-0 text-xs text-slate-600">
            Daily challenges completed: {progress.getDailyCompletedCount()}/{progress.DEVROOM_DAILY_TARGET}
          </p>
        </div>
      ) : null}

      {meta?.id === "daily" && !started ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="m-0 font-semibold text-slate-900">
            {GAMES_COPY.dailyChallengeTitle} - {dailyDateId}
          </p>
          <p className="mt-2 m-0">{GAMES_COPY.dailyChallengeSubtitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <button
              className="button primary"
              onClick={onStartDaily}
              disabled={dailyStatus.attempted && !practiceMode}
            >
              {dailyStatus.attempted && !practiceMode ? GAMES_COPY.dailyAttemptUsedLabel : GAMES_COPY.dailyStartLabel}
            </button>
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={practiceMode}
                onChange={(e) => setPracticeMode(e.target.checked)}
              />
              {GAMES_COPY.dailyPracticeLabel}
            </label>
          </div>
        </div>
      ) : null}

      {meta?.id === "player-one" && !started ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.playerOneTitle}</p>
          <p className="mt-2 m-0">{GAMES_COPY.playerOneSubtitle}</p>
          <div className="mt-3">
            <button className="button primary" onClick={onStartPlayerOne}>{GAMES_COPY.playerOneBeginLabel}</button>
          </div>
        </div>
      ) : null}

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label="Game canvas" role="img" />
        {showLoadingDedication ? (
          <div
            aria-live="polite"
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div
              className="max-w-[90%] rounded-full border border-white/10 bg-black/45 px-4 py-2 text-sm font-semibold text-white shadow-sm backdrop-blur-sm transition-opacity duration-300 ease-out"
              style={{ opacity: loadingOpacity }}
            >
              {loadingLine}
            </div>
          </div>
        ) : null}
      </div>

      {runSummary && meta ? (
        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.skillReviewTitle}</p>
              <p className="mt-2 m-0 text-xs font-semibold text-slate-600">
                {GAMES_COPY.trainsLabel} {GAMES_LEARNING[meta.id]?.concept ?? "Focus"}
              </p>
            </div>
            <button className="rounded-full border px-3 py-1 text-xs font-semibold" onClick={() => setShowLearning((v) => !v)}>
              {showLearning ? GAMES_COPY.lessLabel : GAMES_COPY.moreLabel}
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {analyzeRun(runSummary.metrics).map((i) => (
              <div key={i.headline}>
                <p className="m-0 font-semibold text-slate-900">{i.headline}</p>
                <p className="mt-1 m-0 text-slate-700">{i.detail}</p>
              </div>
            ))}
          </div>
          {showLearning ? (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              {GAMES_LEARNING[meta.id]?.explanation ?? ""}
            </div>
          ) : null}
        </section>
      ) : null}

      <section id="how-to-play" className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="m-0 font-semibold text-slate-900">{GAMES_COPY.howToPlayTitle}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>{GAMES_COPY.howToPlayKeyboard}</li>
          <li>{GAMES_COPY.howToPlayMobile}</li>
          <li>{GAMES_COPY.howToPlayPause}</li>
        </ul>
      </section>
    </div>
  );
}


