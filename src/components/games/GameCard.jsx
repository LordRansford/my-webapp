export default function GameCard({ title, description, children }) {
  return (
    <section className="rn-card rn-game-card">
      <div className="rn-card-title">{title}</div>
      <div className="rn-card-body">
        <p className="rn-body">{description}</p>
        <div className="rn-game-area">{children}</div>
      </div>
    </section>
  );
}
