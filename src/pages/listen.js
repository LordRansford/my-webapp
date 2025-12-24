"use client";

import Layout from "@/components/Layout";
import SpotifyMiniPlayer from "@/components/spotify/SpotifyMiniPlayer";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function ListenPage() {
  const embedUrl = process.env.NEXT_PUBLIC_SPOTIFY_EMBED_URL || "";

  return (
    <Layout title="Listen" description="Optional Spotify player for background study.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Listen" }]}>
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="eyebrow">Player</p>
          <h1 className="text-3xl font-semibold text-slate-900">Listen while you learn</h1>
          <p className="mt-2 text-slate-700">
            This is optional. If the player is enabled, it stays on while you navigate.
          </p>
        </header>

        {!embedUrl ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
            Spotify is not configured for this environment. Set <code>NEXT_PUBLIC_SPOTIFY_EMBED_URL</code> and redeploy.
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="m-0 text-sm text-slate-700">Use the Play button in the bottom-left mini player.</p>
          </div>
        )}

        {/* Mounted globally too; including here ensures discoverability. */}
        <SpotifyMiniPlayer />
      </StaticInfoTemplate>
    </Layout>
  );
}


