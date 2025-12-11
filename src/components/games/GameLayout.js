import Link from "next/link";

export default function GameLayout({ title, subtitle, children }) {
  return (
    <div className="game-shell">
      <header className="game-header">
        <div>
          <p className="eyebrow">Play &amp; Learn</p>
          <h1>{title}</h1>
          {subtitle && <p className="muted">{subtitle}</p>}
        </div>
        <Link href="/games" className="pill pill--ghost">
          Back to games
        </Link>
      </header>
      <div className="game-body">{children}</div>
    </div>
  );
}
