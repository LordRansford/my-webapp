"use client";

import { useState } from "react";

export default function GameHub({ storageKey, title, subtitle, games }) {
  const [active, setActive] = useState(null);

  const open = (id) => {
    setActive(id);
    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : { events: [] };
        parsed.events = Array.isArray(parsed.events) ? parsed.events : [];
        parsed.events.push({ type: "game_opened", game: id, at: Date.now() });
        window.localStorage.setItem(storageKey, JSON.stringify(parsed));
      } catch {
        // ignore storage errors so the UI keeps working
      }
    }
  };

  const close = () => setActive(null);

  const activeGame = games.find((g) => g.id === active);

  return (
    <section className="rn-section">
      <div className="rn-head">
        <h2 className="rn-h2">{title}</h2>
        {subtitle && <p className="rn-body">{subtitle}</p>}
      </div>

      <div className="rn-grid rn-grid-4">
        {games.map((g) => (
          <button
            key={g.id}
            type="button"
            className="rn-card rn-card-button text-left break-words"
            onClick={() => open(g.id)}
            aria-pressed={active === g.id}
          >
            <div className="rn-mini-title">
              {g.level} · {g.minutes} min
            </div>
            <div className="rn-card-title">{g.title}</div>
            <div className="rn-card-body">{g.summary}</div>
          </button>
        ))}
      </div>

      {activeGame && (
        <div className="rn-card rn-mt">
          <div className="rn-card-head">
            <div>
              <div className="rn-mini-title">Now playing</div>
              <div className="rn-card-title">{activeGame.title}</div>
            </div>
            <button className="rn-btn" type="button" onClick={close}>
              Close
            </button>
          </div>
          <div className="rn-card-body break-words">{activeGame.component}</div>
        </div>
      )}
    </section>
  );
}
