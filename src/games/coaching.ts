export type RunMetrics = {
  runMs: number;
  inputChangeRate: number; // 0..1-ish
  overcorrectRate: number; // 0..1-ish
  actionRate: number; // presses per second
  peakIntensity: number; // 0..1
};

export type SkillInsight = {
  headline: string;
  detail: string;
};

function clamp01(v: number) {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

export function analyzeRun(m: RunMetrics): SkillInsight[] {
  const s = m.runMs / 1000;
  const change = clamp01(m.inputChangeRate);
  const over = clamp01(m.overcorrectRate);
  const act = clamp01(m.actionRate / 3); // normalize ~0..1 around 3 taps/s
  const intensity = clamp01(m.peakIntensity);

  const out: SkillInsight[] = [];

  if (over > 0.45 && change > 0.45) {
    out.push({
      headline: "You react quickly but overcorrect under pressure.",
      detail: "Try smaller adjustments. Move, settle, then move again instead of zig-zagging.",
    });
  } else if (change < 0.18 && s > 18) {
    out.push({
      headline: "Your control is steady. Keep it deliberate as it speeds up.",
      detail: "When the pace rises, keep the same input size. Do not let urgency inflate your movements.",
    });
  } else {
    out.push({
      headline: "Your inputs are consistent. The next gain is anticipation.",
      detail: "Watch for what repeats and start moving just before the danger line reaches you.",
    });
  }

  if (intensity > 0.65 && s < 20) {
    out.push({
      headline: "Early difficulty spikes caught you.",
      detail: "Focus on staying centered. Give yourself more options to dodge when patterns tighten.",
    });
  }

  if (act > 0.6) {
    out.push({
      headline: "You use actions a lot. Make each one count.",
      detail: "Try fewer, better-timed actions. Save them for moments that actually change the outcome.",
    });
  } else if (act < 0.15) {
    out.push({
      headline: "You rely on movement. Consider one well-timed action.",
      detail: "If the game supports a tap action, use it as a deliberate reset, not a panic button.",
    });
  }

  return out.slice(0, 3);
}


