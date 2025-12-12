"use client";

export function Callout({ type = "note", title, children }) {
  return (
    <div className={`note-callout note-callout--${type}`} role="note">
      {title && <div className="note-callout__title">{title}</div>}
      <div className="note-callout__body">{children}</div>
    </div>
  );
}
