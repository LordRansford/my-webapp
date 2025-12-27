"use client";

import Layout from "@/components/Layout";
import MusicControl from "@/components/spotify/MusicControl";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function ListenPage() {
  return (
    <Layout title="Listen" description="Optional Spotify player for background study.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Listen" }]}>
        <header className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
          <p className="eyebrow">Player</p>
          <h1 className="text-3xl font-semibold text-slate-900">Listen while you learn</h1>
          <p className="mt-2 text-slate-700">
            This is optional. Paste any Spotify track, album, or playlist URL to play. 
            The player persists across navigation, though playback may reset when you change pages.
          </p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <p className="m-0 text-sm font-medium text-slate-900">How to use:</p>
          <ol className="m-0 list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Click the Music button in the bottom-left corner</li>
            <li>Paste a Spotify URL (track, album, or playlist) or choose a curated playlist</li>
            <li>The player will appear and persist as you navigate</li>
          </ol>
          <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
            <p className="m-0 font-semibold mb-1">About this player:</p>
            <p className="m-0">
              Uses Spotify&apos;s official embed only. No SDK, no OAuth, no Premium required. 
              Compliant under monetisation. Playback may reset on page navigation.
            </p>
          </div>
        </div>

        {/* Mounted globally too; including here ensures discoverability. */}
        <MusicControl />
      </StaticInfoTemplate>
    </Layout>
  );
}


