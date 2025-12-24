export type AudioController = {
  setMuted: (muted: boolean) => void;
  start: () => void;
  stop: () => void;
  setIntensity: (v: number) => void; // 0..1
  setTension: (v: number) => void; // 0..1
  cueMilestone: () => void;
  cueFail: () => void;
  playClick: () => void;
  dispose: () => void;
};

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

// Tiny oscillator-based adaptive audio; no external assets required.
export function createAudioController(): AudioController {
  let muted = false;
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let musicGain: GainNode | null = null;
  let tensionGain: GainNode | null = null;
  let filter: BiquadFilterNode | null = null;
  let bass: OscillatorNode | null = null;
  let lead: OscillatorNode | null = null;
  let lfo: OscillatorNode | null = null;
  let lfoGain: GainNode | null = null;
  let started = false;
  let intensity = 0;
  let tension = 0;

  const ensure = () => {
    if (ctx) return ctx;
    const A = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!A) return null;
    const c: AudioContext = new A();
    ctx = c;
    master = c.createGain();
    master.gain.value = 0.0;
    master.connect(c.destination);
    return c;
  };

  const ensureGraph = () => {
    const c = ensure();
    if (!c) return null;
    if (musicGain && filter && bass && lead && lfo && lfoGain && tensionGain && master) return c;

    musicGain = c.createGain();
    musicGain.gain.value = 0.06;

    tensionGain = c.createGain();
    tensionGain.gain.value = 0.0;

    filter = c.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 520;
    filter.Q.value = 0.7;

    bass = c.createOscillator();
    bass.type = "sine";
    bass.frequency.value = 110;

    lead = c.createOscillator();
    lead.type = "triangle";
    lead.frequency.value = 220;

    lfo = c.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.8;
    lfoGain = c.createGain();
    lfoGain.gain.value = 12;

    // LFO gently wobbles lead pitch.
    lfo.connect(lfoGain);
    lfoGain.connect(lead.frequency);

    // Routing: bass + lead -> filter -> musicGain -> master
    bass.connect(filter);
    lead.connect(filter);
    filter.connect(musicGain);

    // Tension layer: a quiet high sine that fades in as tension rises.
    const tensionOsc = c.createOscillator();
    tensionOsc.type = "sine";
    tensionOsc.frequency.value = 660;
    tensionOsc.connect(tensionGain);
    tensionGain.connect(master!);

    musicGain.connect(master!);

    bass.start();
    lead.start();
    lfo.start();
    tensionOsc.start();

    return c;
  };

  const applyParams = () => {
    if (!ctx || !master || !musicGain || !filter || !lead || !bass || !tensionGain) return;
    const t = ctx.currentTime;

    // Master volume with a gentle attack/decay.
    const targetMaster = muted ? 0 : 0.85;
    master.gain.cancelScheduledValues(t);
    master.gain.setTargetAtTime(targetMaster, t, 0.06);

    // Intensity increases perceived tempo: raise filter cutoff + subtle pitch lift.
    const i = clamp01(intensity);
    const te = clamp01(tension);

    const cutoff = 420 + i * 1200;
    filter.frequency.cancelScheduledValues(t);
    filter.frequency.setTargetAtTime(cutoff, t, 0.08);

    lead.frequency.cancelScheduledValues(t);
    lead.frequency.setTargetAtTime(200 + i * 140, t, 0.08);
    bass.frequency.cancelScheduledValues(t);
    bass.frequency.setTargetAtTime(96 + i * 48, t, 0.08);

    // Tension layer: fade in and slightly raise pitch.
    tensionGain.gain.cancelScheduledValues(t);
    tensionGain.gain.setTargetAtTime(muted ? 0 : te * 0.06, t, 0.08);
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
      applyParams();
    },
    start: () => {
      if (started) return;
      const c = ensureGraph();
      if (!c) return;
      started = true;
      try {
        // Some browsers require user gesture; resume if suspended.
        if (c.state === "suspended") c.resume().catch(() => {});
      } catch {
        // ignore
      }
      applyParams();
    },
    stop: () => {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      try {
        master.gain.cancelScheduledValues(t);
        master.gain.setTargetAtTime(0, t, 0.08);
      } catch {
        // ignore
      }
    },
    setIntensity: (v) => {
      intensity = clamp01(v);
      applyParams();
    },
    setTension: (v) => {
      tension = clamp01(v);
      applyParams();
    },
    cueMilestone: () => {
      if (muted) return;
      const c = ensure();
      if (!c) return;
      try {
        const o = c.createOscillator();
        const g = c.createGain();
        o.type = "sine";
        o.frequency.value = 880;
        g.gain.value = 0.0001;
        o.connect(g);
        g.connect(c.destination);
        const t = c.currentTime;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.03, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
        o.start(t);
        o.stop(t + 0.2);
      } catch {
        // ignore
      }
    },
    cueFail: () => {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      try {
        master.gain.cancelScheduledValues(t);
        master.gain.setTargetAtTime(0, t, 0.04);
      } catch {
        // ignore
      }
    },
    playClick,
    dispose: () => {
      try {
        ctx?.close();
      } catch {
        // ignore
      }
      ctx = null;
      master = null;
      musicGain = null;
      tensionGain = null;
      filter = null;
      bass = null;
      lead = null;
      lfo = null;
      lfoGain = null;
      started = false;
    },
  };
}


