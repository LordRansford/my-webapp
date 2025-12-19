const KEY = "template-favourites";

const safeWindow = () => (typeof window !== "undefined" ? window : null);

export function getFavourites() {
  const win = safeWindow();
  if (!win) return [];
  const raw = win.localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function toggleFavourite(id) {
  const win = safeWindow();
  if (!win || !id) return [];
  const current = new Set(getFavourites());
  if (current.has(id)) {
    current.delete(id);
  } else {
    current.add(id);
  }
  const next = Array.from(current);
  win.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function isFavourite(id) {
  return getFavourites().includes(id);
}
