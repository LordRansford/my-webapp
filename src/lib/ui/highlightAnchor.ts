export function highlightAnchorFromLocation() {
  if (typeof window === "undefined") return;
  const hash = window.location.hash || "";
  if (!hash || hash.length < 2) return;
  const id = decodeURIComponent(hash.slice(1));
  if (!id) return;
  const el = document.getElementById(id);
  if (!el) return;

  try {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  } catch {
    // ignore
  }

  const prevOutline = (el as HTMLElement).style.outline;
  const prevOutlineOffset = (el as HTMLElement).style.outlineOffset;
  const prevBorderRadius = (el as HTMLElement).style.borderRadius;

  (el as HTMLElement).style.outline = "2px solid rgba(15, 23, 42, 0.35)";
  (el as HTMLElement).style.outlineOffset = "6px";
  (el as HTMLElement).style.borderRadius = "12px";

  window.setTimeout(() => {
    try {
      (el as HTMLElement).style.outline = prevOutline;
      (el as HTMLElement).style.outlineOffset = prevOutlineOffset;
      (el as HTMLElement).style.borderRadius = prevBorderRadius;
    } catch {
      // ignore
    }
  }, 1200);
}

