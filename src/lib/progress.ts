type ProgressState = {
  [courseId: string]: {
    [levelId: string]: {
      [sectionId: string]: boolean;
    };
  };
};

const STORAGE_KEY = "ransfordsnotes-progress";

const isBrowser = typeof window !== "undefined";

function readStore(): ProgressState {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(state: ProgressState) {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore write errors
  }
}

export function getProgress(courseId: string) {
  const state = readStore();
  return state[courseId];
}

export function setSectionComplete(courseId: string, levelId: string, sectionId: string, complete: boolean) {
  const state = readStore();
  if (!state[courseId]) state[courseId] = {};
  if (!state[courseId][levelId]) state[courseId][levelId] = {};
  state[courseId][levelId][sectionId] = complete;
  writeStore(state);
}

export function getLevelCompletion(courseId: string, levelId: string, sectionIds: string[]) {
  const state = readStore();
  const level = state[courseId]?.[levelId] || {};
  const totalCount = sectionIds.length;
  const completedCount = sectionIds.filter((id) => level[id]).length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  return { completedCount, totalCount, percent };
}

export function getCourseCompletion(courseId: string, manifest: { [levelId: string]: string[] }) {
  const levels = Object.keys(manifest);
  const totals = levels.reduce(
    (acc, levelId) => {
      const result = getLevelCompletion(courseId, levelId, manifest[levelId]);
      acc.completed += result.completedCount;
      acc.total += result.totalCount;
      return acc;
    },
    { completed: 0, total: 0 }
  );
  const percent = totals.total === 0 ? 0 : Math.round((totals.completed / totals.total) * 100);
  return { completedCount: totals.completed, totalCount: totals.total, percent };
}
