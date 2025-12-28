export default function GameCard({ title, description, children }) {
  return (
    <section className="group relative mb-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/40 to-white p-6 shadow-md transition-all duration-300 hover:border-slate-300/80 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 group-hover:opacity-100" />
      <div className="relative">
        <h4 className="mb-2 text-lg font-bold text-slate-900">{title}</h4>
        <p className="mb-4 text-sm leading-relaxed text-slate-700">{description}</p>
        <div className="rn-game-area">{children}</div>
      </div>
    </section>
  );
}
