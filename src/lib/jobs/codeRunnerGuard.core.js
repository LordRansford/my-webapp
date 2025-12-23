export const CODE_RUNNER_MAX_CODE_CHARS = 6000;

export function detectBannedKeywords(language, code) {
  const src = String(code || "");
  const lower = src.toLowerCase();
  const banned = language === "py"
    ? ["socket", "urllib", "requests", "http.client", "subprocess", "os.system", "open("]
    : ["fetch", "xmlhttprequest", "websocket", "require(", "import ", "import(", "process.", "deno."];

  const hit = banned.find((k) => lower.includes(k.toLowerCase()));
  return hit || null;
}

export function validateCodeRunnerPayload(payload) {
  if (!payload || typeof payload !== "object") return { ok: false, error: "Invalid payload." };
  const language = payload.language;
  if (language !== "js" && language !== "py") return { ok: false, error: "Unknown language." };
  const code = typeof payload.code === "string" ? payload.code : "";
  if (!code) return { ok: false, error: "Missing code." };
  if (code.length > CODE_RUNNER_MAX_CODE_CHARS) return { ok: false, error: "Code is too large." };
  const banned = detectBannedKeywords(language, code);
  if (banned) {
    return { ok: false, error: "Network and host access APIs are not available in this sandbox." };
  }
  const input = typeof payload.input === "string" ? payload.input : "";
  return { ok: true, value: { language, code, input } };
}


