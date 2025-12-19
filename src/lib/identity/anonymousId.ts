const STORAGE_KEY = "rn-anonymous-id";
const COOKIE_KEY = "rn_anonymous_id";

function safeWindow() {
  return typeof window !== "undefined" ? window : null;
}

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `anon-${Math.random().toString(16).slice(2)}-${Date.now()}`;
}

function readCookie(win: Window, name: string) {
  const value = win.document.cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  return value ? decodeURIComponent(value.split("=").slice(1).join("=")) : null;
}

function writeCookie(win: Window, name: string, value: string) {
  const expires = new Date();
  expires.setFullYear(expires.getFullYear() + 2);
  win.document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`;
}

export function getAnonymousId() {
  const win = safeWindow();
  if (!win) return null;

  try {
    const stored = win.localStorage.getItem(STORAGE_KEY);
    const cookieVal = readCookie(win, COOKIE_KEY);

    const current = stored || cookieVal;
    if (current) {
      if (!stored) win.localStorage.setItem(STORAGE_KEY, current);
      if (!cookieVal) writeCookie(win, COOKIE_KEY, current);
      return current;
    }

    const fresh = generateId();
    win.localStorage.setItem(STORAGE_KEY, fresh);
    writeCookie(win, COOKIE_KEY, fresh);
    return fresh;
  } catch {
    return null;
  }
}
