import { createAudioController, type AudioController } from "@/games/engine/audio";

export type AudioEngine = {
  start: () => void;
  stop: () => void;
  setIntensity: (v: number) => void; // 0..1
  setNearFail: (v: number) => void; // 0..1
  milestoneCue: () => void;
  setMuted: (m: boolean) => void;
  getMuted: () => boolean;
  dispose: () => void;
};

export function createAudioEngine(): AudioEngine {
  const c: AudioController = createAudioController();
  let muted = true;
  c.setMuted(muted);
  return {
    start: () => c.start(),
    stop: () => c.stop(),
    setIntensity: (v) => c.setIntensity(v),
    setNearFail: (v) => c.setTension(v),
    milestoneCue: () => c.cueMilestone(),
    setMuted: (m) => {
      muted = Boolean(m);
      c.setMuted(muted);
    },
    getMuted: () => muted,
    dispose: () => c.dispose(),
  };
}


