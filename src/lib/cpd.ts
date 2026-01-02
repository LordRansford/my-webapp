export type CPDTrackId = "cyber" | "ai" | "software-architecture" | "digitalisation" | "data";

export interface CPDSectionKey {
  trackId: CPDTrackId;
  levelId: string;
  sectionId: string;
}

export interface CPDSectionState extends CPDSectionKey {
  completed: boolean;
  minutes: number;
  lastUpdated: string;
}

export interface CPDActivity {
  id: string;
  trackId: CPDTrackId;
  levelId: string;
  sectionId: string;
  minutesDelta: number;
  timestamp: string;
  note?: string;
}

export interface CPDState {
  version: number;
  sections: CPDSectionState[];
  activity: CPDActivity[];
}

const CPD_STORAGE_KEY = "ransfords-notes-cpd-v1";
const CPD_VERSION = 1;

const emptyState = (): CPDState => ({
  version: CPD_VERSION,
  sections: [],
  activity: [],
});

const isBrowser = typeof window !== "undefined";

/**
 * Legacy section IDs exist in older content. We keep them as aliases so:
 * - existing learner progress still counts after an ID migration
 * - content can migrate to canonical IDs without breaking progress bars
 *
 * IMPORTANT:
 * - Canonical IDs should be stable and live in docs/courses/CYBERSECURITY_MASTER_SYLLABUS.md
 * - Aliases should only be added for real historical IDs used in production content.
 */
const LEGACY_SECTION_ALIASES: Partial<
  Record<CPDTrackId, Partial<Record<string, Partial<Record<string, string[]>>>>>
> = {
  cyber: {
    foundations: {
      // Old "Foundations overview" toggle + quiz lived under this ID.
      // Canonical syllabus splits this into a dedicated Module F0.
      "foundations-f0-what-security-is": ["foundations-why-cyber-matters"],

      // Old module IDs from the original Foundations page.
      "foundations-f2-data-and-integrity": ["foundations-data-and-bits"],
      "foundations-f3-networks-and-transport": ["foundations-networks-and-packets"],
      "foundations-f4-cia-and-simple-attacks": ["foundations-cia-and-simple-attacks"],

      // Old manifest had a placeholder capstone ID, keep it as an alias.
      "foundations-f8-foundations-capstone": ["foundations-checkpoint-capstone"],
    },
    applied: {
      "applied-a1-threat-modelling-as-design": ["applied-threat-modelling"],
      "applied-a2-identity-and-access-control": ["applied-auth-sessions-access"],
      "applied-a6-logging-and-detection-basics": ["applied-logging-and-risk"],
    },
    practice: {
      "practice-p0-crypto-in-practice": ["advanced-crypto-practice"],
      "practice-p1-secure-architecture-zero-trust": ["advanced-secure-architecture"],
      "practice-p2-detection-and-incident-response": ["advanced-detection-response"],
      "practice-p3-supply-chain-risk": ["advanced-supply-chain-risk"],
      "practice-p4-adversarial-tradeoffs": ["advanced-adversarial-tradeoffs"],
      "practice-p5-governance-and-professional-practice": ["advanced-governance-career"],
    },
  },
};

export function getSectionAliases(trackId: CPDTrackId, levelId: string, sectionId: string): string[] {
  const canonical = String(sectionId || "").trim();
  if (!canonical) return [];
  const aliases = LEGACY_SECTION_ALIASES?.[trackId]?.[levelId]?.[canonical] ?? [];
  const all = [canonical, ...aliases].map((s) => String(s).trim()).filter(Boolean);
  return Array.from(new Set(all));
}

export function isSectionCompleted(state: CPDState, trackId: CPDTrackId, levelId: string, sectionId: string): boolean {
  const ids = getSectionAliases(trackId, levelId, sectionId);
  if (ids.length === 0) return false;
  return ids.some((id) =>
    state.sections.some(
      (section) =>
        section.trackId === trackId &&
        section.levelId === levelId &&
        section.sectionId === id &&
        section.completed
    )
  );
}

const normaliseSection = (input: any): CPDSectionState | null => {
  if (!input || typeof input !== "object") return null;
  const { trackId, levelId, sectionId, completed, minutes, lastUpdated } = input;
  if (!trackId || !levelId || !sectionId) return null;
  return {
    trackId,
    levelId,
    sectionId,
    completed: Boolean(completed),
    minutes: Math.max(0, Number(minutes) || 0),
    lastUpdated: typeof lastUpdated === "string" && lastUpdated.length > 0 ? lastUpdated : new Date().toISOString(),
  };
};

const normaliseActivity = (input: any): CPDActivity | null => {
  if (!input || typeof input !== "object") return null;
  const { id, trackId, levelId, sectionId, minutesDelta, timestamp, note } = input;
  if (!id || !trackId || !levelId || !sectionId || !timestamp) return null;
  return {
    id: String(id),
    trackId,
    levelId,
    sectionId,
    minutesDelta: Number(minutesDelta) || 0,
    timestamp: String(timestamp),
    note: typeof note === "string" ? note : undefined,
  };
};

export function getInitialCPDState(): CPDState {
  if (!isBrowser) return emptyState();
  try {
    const raw = window.localStorage.getItem(CPD_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyState();
    const version = Number(parsed.version) || CPD_VERSION;
    const sections = Array.isArray(parsed.sections)
      ? parsed.sections.map(normaliseSection).filter(Boolean)
      : [];
    const activity = Array.isArray(parsed.activity)
      ? parsed.activity.map(normaliseActivity).filter(Boolean)
      : [];
    return { version, sections, activity };
  } catch {
    return emptyState();
  }
}

export function saveCPDState(state: CPDState): void {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(CPD_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function upsertSection(
  state: CPDState,
  input: CPDSectionKey & { completed?: boolean; minutesDelta?: number }
): CPDState {
  const next = { ...state, sections: [...state.sections] };
  const index = next.sections.findIndex(
    (section) =>
      section.trackId === input.trackId &&
      section.levelId === input.levelId &&
      section.sectionId === input.sectionId
  );

  const now = new Date().toISOString();
  const existing = index >= 0 ? next.sections[index] : null;
  const minutes = Math.max(0, (existing?.minutes || 0) + (input.minutesDelta || 0));
  const updated: CPDSectionState = {
    trackId: input.trackId,
    levelId: input.levelId,
    sectionId: input.sectionId,
    completed: input.completed ?? existing?.completed ?? false,
    minutes,
    lastUpdated: now,
  };

  if (index >= 0) {
    next.sections[index] = updated;
  } else {
    next.sections.push(updated);
  }

  return next;
}

export function getTotalsForTrack(state: CPDState, trackId: CPDTrackId) {
  const sections = state.sections.filter((section) => section.trackId === trackId);
  const totalMinutes = sections.reduce((sum, section) => sum + section.minutes, 0);
  const completedSections = sections.filter((section) => section.completed).length;
  const totalSections = sections.length;
  return { totalMinutes, completedSections, totalSections };
}

export function resolveTrackId(courseId: string): CPDTrackId {
  if (courseId === "cybersecurity" || courseId === "cyber") return "cyber";
  if (courseId === "software-architecture" || courseId === "architecture") return "software-architecture";
  if (courseId === "digitalisation") return "digitalisation";
  if (courseId === "data") return "data";
  return "ai";
}

export function getCompletionForLevel(
  state: CPDState,
  trackId: CPDTrackId,
  levelId: string,
  sectionIds: string[] = []
) {
  const completedCount = sectionIds.filter((sectionId) =>
    isSectionCompleted(state, trackId, levelId, sectionId)
  ).length;
  const totalCount = sectionIds.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  return { completedCount, totalCount, percent };
}

export function getCompletionForCourse(
  state: CPDState,
  trackId: CPDTrackId,
  manifest: Record<string, string[]>,
  levelIds?: string[]
) {
  const levels = levelIds && levelIds.length > 0 ? levelIds : Object.keys(manifest || {});
  const totals = levels.reduce(
    (acc, levelId) => {
      const sectionIds = manifest?.[levelId] || [];
      const result = getCompletionForLevel(state, trackId, levelId, sectionIds);
      acc.completed += result.completedCount;
      acc.total += result.totalCount;
      return acc;
    },
    { completed: 0, total: 0 }
  );
  const percent = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
  return { completedCount: totals.completed, totalCount: totals.total, percent };
}

export function addActivityEntry(
  state: CPDState,
  entry: Omit<CPDActivity, "id" | "timestamp">
): CPDState {
  const full: CPDActivity = {
    ...entry,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
  };
  return {
    ...state,
    activity: [full, ...state.activity].slice(0, 200),
  };
}
