export type AudioController = {
  setMuted: (muted: boolean) => void;
  playClick: () => void;
  dispose: () => void;
};

// Tiny oscillator-based SFX; no external assets required.
export function createAudioController(): AudioController {
  let muted = false;
  let ctx: AudioContext | null = null;

  const ensure = () => {
    if (ctx) return ctx;
    const A = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!A) return null;
    ctx = new A();
    return ctx;
  };

  const playClick = () => {
    if (muted) return;
    const c = ensure();
    if (!c) return;
    try {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = "triangle";
      o.frequency.value = 440;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(c.destination);
      const t = c.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.05, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.start(t);
      o.stop(t + 0.09);
    } catch {
      // ignore
    }
  };

  return {
    setMuted: (m) => {
      muted = Boolean(m);
    },
    playClick,
    dispose: () => {
      try {
        ctx?.close();
      } catch {
        // ignore
      }
      ctx = null;
    },
  };
}


