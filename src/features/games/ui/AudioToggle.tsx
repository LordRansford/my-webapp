"use client";

import { UI_COPY } from "../constants";

export default function AudioToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="rounded-full border px-3 py-1 text-sm font-semibold"
      onClick={onToggle}
      aria-label={muted ? UI_COPY.unmute : UI_COPY.mute}
    >
      {muted ? UI_COPY.unmute : UI_COPY.mute}
    </button>
  );
}


