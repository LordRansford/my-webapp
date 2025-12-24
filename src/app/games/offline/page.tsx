export const metadata = {
  title: "Games offline",
  description: "This game page is not available offline yet.",
};

import { GameLoadingTemplate } from "@/components/templates/PageTemplates";
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import Link from "next/link";

export default function GamesOfflinePage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "Offline" },
  ];

  return (
    <GameLoadingTemplate breadcrumbs={breadcrumbs}>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Offline</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Not available offline yet</h1>
        <p className="mt-3 text-slate-700">
          To play offline, open the game once while online. After that, this page and the game assets will be cached for offline use.
        </p>
        <p className="mt-4 text-sm text-slate-700">
          When you are back online, return to <Link className="underline" href="/games">Games</Link>.
        </p>
      </div>
    </GameLoadingTemplate>
  );
}


