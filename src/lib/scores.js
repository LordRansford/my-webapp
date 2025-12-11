const STORAGE_KEY = "rn_game_scores";

const readLocal = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeLocal = (data) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
};

export const loadScore = (gameId) => {
  const all = readLocal();
  return all[gameId] || null;
};

export const saveScore = async (gameId, payload) => {
  const body = { gameId, ...payload };

  try {
    const response = await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("backend rejected");
    }
  } catch {
    // Fallback to local storage if backend is unavailable
    const all = readLocal();
    const current = all[gameId];
    if (!current || (payload.score && payload.score > current.score)) {
      all[gameId] = payload;
      writeLocal(all);
    }
  }
};
