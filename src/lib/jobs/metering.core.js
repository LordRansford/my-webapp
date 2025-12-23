export function computeMetering(params) {
  const {
    durationMs,
    freeRemainingMsAtStart,
    creditsPerMsPaid,
    maxRunMsHardCap,
  } = params;

  const d = Math.max(0, Math.min(Number(durationMs || 0), Number(maxRunMsHardCap || 0) || 0));
  const freeStart = Math.max(0, Number(freeRemainingMsAtStart || 0));
  const freeTierAppliedMs = Math.min(d, freeStart);
  const paidMs = Math.max(0, d - freeTierAppliedMs);
  const creditsRate = Math.max(0, Number(creditsPerMsPaid || 0));
  const rawCredits = paidMs * creditsRate;
  const chargedCredits = paidMs > 0 ? Math.max(1, Math.ceil(rawCredits)) : 0;

  return { durationMs: d, freeTierAppliedMs, paidMs, chargedCredits };
}


