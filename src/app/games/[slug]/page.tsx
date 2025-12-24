import GameShellClient from "./GameShell.client";
import { getGameMeta } from "@/games/registry";

export const dynamic = "force-static";

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const safe = String(slug || "").trim();
  const meta = getGameMeta(safe);

  return (
    <div className="mx-auto w-full max-w-5xl p-6 space-y-4">
      <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Game</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">{meta?.title ?? safe}</h1>
        <p className="mt-2 text-slate-700">
          {meta?.blurb ?? "This route is cached for offline play after first load."}
        </p>
      </header>

      <GameShellClient slug={safe} />
    </div>
  );
}


