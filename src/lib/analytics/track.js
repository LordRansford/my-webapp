export function track(event, payload = {}) {
  try {
    if (typeof window === "undefined") return;
    const detail = { event, payload, ts: Date.now() };
    // Placeholder: replace with real analytics sink if available
    if (window?.console?.debug) {
      console.debug("[track]", detail);
    }
  } catch (err) {
    // swallow
  }
}
