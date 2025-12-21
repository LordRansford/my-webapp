import crypto from "crypto";

export const CPD_RULES_VERSION = "v1";

export function minutesToHours(minutes) {
  const m = Number(minutes) || 0;
  return Math.round((m / 60) * 10) / 10;
}

export function hoursToMinutes(hours) {
  const h = Number(hours) || 0;
  return Math.max(0, Math.round(h * 60));
}

export function validateCpdState(state) {
  if (!state || typeof state !== "object") return { ok: false, error: "State must be an object" };
  if (!Array.isArray(state.sections) || !Array.isArray(state.activity)) {
    return { ok: false, error: "State must contain sections and activity arrays" };
  }
  for (const s of state.sections) {
    if (!s.trackId || !s.levelId || !s.sectionId) return { ok: false, error: "Section missing identifiers" };
    if (Number(s.minutes) < 0) return { ok: false, error: "Section minutes must be non-negative" };
  }
  for (const a of state.activity) {
    if (!a.id || !a.trackId || !a.levelId || !a.sectionId || !a.timestamp) return { ok: false, error: "Activity missing fields" };
    if (!Number.isFinite(Number(a.minutesDelta))) return { ok: false, error: "Activity minutesDelta must be numeric" };
  }
  return { ok: true };
}

export function buildEvidenceRecord(input) {
  const payload = {
    ...input,
    rulesVersion: CPD_RULES_VERSION,
  };
  const canonical = JSON.stringify(payload);
  const hash = crypto.createHash("sha256").update(canonical).digest("hex");
  return { ...payload, hash };
}

export function explainCredits(state, trackId) {
  const activity = (state?.activity || []).filter((a) => a.trackId === trackId);
  const totalMinutesFromActivity = activity.reduce((sum, a) => sum + (Number(a.minutesDelta) || 0), 0);
  return {
    trackId,
    totalMinutesFromActivity,
    totalHoursFromActivity: minutesToHours(totalMinutesFromActivity),
    recent: activity.slice(0, 50).map((a) => ({
      id: a.id,
      timestamp: a.timestamp,
      minutesDelta: a.minutesDelta,
      note: a.note || "",
      levelId: a.levelId,
      sectionId: a.sectionId,
    })),
  };
}


