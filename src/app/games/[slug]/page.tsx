import GameShellClient from "./GameShell.client";
import SwStatusPill from "../SwStatus.client";
import { getGameMeta } from "@/games/registry";
import { GameCanvasTemplate } from "@/components/templates/PageTemplates";
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

export const dynamic = "force-static";

export default async function GamePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const safe = String(slug || "").trim();
  const meta = getGameMeta(safe);

  const title = meta?.title ?? "Game not found";
  const description = meta?.blurb ?? "This route is not available yet. Pick another game from the hub while we finish this one.";
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: title },
  ];

  return (
    <GameCanvasTemplate breadcrumbs={breadcrumbs}>
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Game</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-700">{description}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Difficulty: {meta?.difficulty ?? "Unavailable"}
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Keyboard + touch
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Offline after first load
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                Progressive difficulty
              </span>
            </div>
          </div>
          <SwStatusPill />
        </div>
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="m-0 text-sm font-semibold text-slate-900">What this game is for</p>
          <p className="mt-2 text-sm text-slate-700">
            {meta
              ? "Playable offline with keyboard and touch controls so you can keep practising without a connection."
              : "This route currently has no playable game. Pick another game from the hub while we finish this one."}
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Clear inputs: arrow keys / WASD and swipe gestures.</li>
            <li>Outputs: run stats, intensity cues, and skill review after every run.</li>
            <li>Limits: Escape or the Pause control to stop; reduce motion in settings.</li>
            <li>Errors explain themselves: locked routes tell you why and how to unlock.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="m-0 text-sm font-semibold text-slate-900">What to do next</p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm text-slate-700">
            <li>Scroll to the canvas and start the run.</li>
            <li>Use keyboard or touch to move; press Escape or Pause to take a break.</li>
            <li>Review the run summary for feedback on control habits.</li>
            <li>If the route is locked, follow the unlock instructions on this page.</li>
          </ol>
        </div>
      </section>

      <section className="mt-6">
        <GameShellClient slug={safe} />
      </section>
    </GameCanvasTemplate>
  );
}


