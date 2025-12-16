"use client";

export default function GameReflection({ title = "Reflection", children }) {
  return (
    <div className="rn-mini rn-mt">
      <div className="rn-mini-title">{title}</div>
      <div className="rn-mini-body">{children}</div>
    </div>
  );
}
