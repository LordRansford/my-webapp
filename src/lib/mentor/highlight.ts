export function highlightAnchorFromLocation() {
  if (typeof window === "undefined") return;
  const id = (window.location.hash || "").replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  try {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch {
    // ignore
  }
  el.classList.add("rn-anchor-highlight");
  window.setTimeout(() => el.classList.remove("rn-anchor-highlight"), 900);
}


