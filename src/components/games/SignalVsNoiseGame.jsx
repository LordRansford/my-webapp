"use client";

import { useState } from "react";

const events = [
  "User logged in at 9am",
  "User logged in from new country at 3am",
  "Password reset requested",
  "User clicked help page",
  "Admin action outside working hours",
];

export default function SignalVsNoiseGame() {
  const [selected, setSelected] = useState([]);

  const toggle = (event, checked) => {
    setSelected((prev) => {
      if (checked) return [...prev, event];
      return prev.filter((e) => e !== event);
    });
  };

  return (
    <div>
      {events.map((e) => (
        <label key={e} className="rn-game-row rn-body">
          <input type="checkbox" onChange={(ev) => toggle(e, ev.target.checked)} /> {e}
        </label>
      ))}

      <div className="rn-mini rn-mt">
        <div className="rn-mini-title">Reflection</div>
        <div className="rn-mini-body">Which of these are signals only when combined. What context would you need to decide.</div>
      </div>
    </div>
  );
}
