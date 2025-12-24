"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createCanvasView } from "@/games/engine/canvasView";
import { createFixedTimestepLoop } from "@/games/engine/loop";
import { createInputController } from "@/games/engine/input";
import { createAudioController } from "@/games/engine/audio";
import { PersistStore } from "@/games/engine/persist";
import type { GameSettings } from "@/games/engine/types";
import { createDemoScene } from "@/games/scenes/demoScene";
import { useOfflineReady } from "../SwStatus.client";

export default function GameShellClient({ slug }: { slug: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const store = useMemo(() => new PersistStore({ prefix: "rn_games", version: "v1" }), []);
  const [paused, setPaused] = useState(false);
  const [settings, setSettings] = useState<GameSettings>(() => ({
    muted: store.get("muted", false),
    reduceMotion: store.get("reduceMotion", false),
  }));
  const { ready: offlineReady } = useOfflineReady();

  useEffect(() => {
    store.set("muted", settings.muted);
    store.set("reduceMotion", settings.reduceMotion);
  }, [settings, store]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const view = createCanvasView(canvas);
    const input = createInputController(window);
    const audio = createAudioController();
    audio.setMuted(settings.muted);

    const scene = createDemoScene();

    const loop = createFixedTimestepLoop({
      canvas: view.canvas,
      ctx2d: view.ctx2d,
      getSize: () => ({ width: view.width, height: view.height, dpr: view.dpr }),
      scene,
      getInput: () => input.getState(),
      getSettings: () => settings,
      onFrameEnd: () => input.resetFrame(),
    });

    loop.start();

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
      audio.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, settings.muted, settings.reduceMotion]);

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

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm">
        <canvas ref={canvasRef} className="h-full w-full touch-none" aria-label="Game canvas" role="img" />
      </div>

      <section id="how-to-play" className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
        <p className="m-0 font-semibold text-slate-900">How to play</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Keyboard: arrow keys or WASD to move.</li>
          <li>Mobile: swipe to push the dot.</li>
          <li>Pause: Escape or the Pause button.</li>
        </ul>
      </section>
    </div>
  );
}


