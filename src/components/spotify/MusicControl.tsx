"use client";

import { useState, useRef, useEffect } from "react";
import { useMusic } from "./MusicProvider";
import { parseSpotifyUrl, isValidSpotifyUrl } from "@/lib/spotify/urlConverter";
import { Music, X, HelpCircle, Check, AlertCircle } from "lucide-react";

interface CuratedPlaylist {
  id: string;
  title: string;
  description: string;
  url: string;
  resourceType: "playlist" | "album";
}

// Curated playlists - focus music for study/work
const CURATED_PLAYLISTS: CuratedPlaylist[] = [
  {
    id: "focus-instrumental",
    title: "Focus Instrumental",
    description: "Calm instrumental tracks for deep work",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO",
    resourceType: "playlist",
  },
  {
    id: "lofi-study",
    title: "Lo-Fi Study Beats",
    description: "Chill beats for studying",
    url: "https://open.spotify.com/playlist/37i9dQZF1DWWQRKXabpuS2",
    resourceType: "playlist",
  },
  {
    id: "ambient-focus",
    title: "Ambient Focus",
    description: "Atmospheric sounds for concentration",
    url: "https://open.spotify.com/playlist/37i9dQZF1DX6J5NfMJS675",
    resourceType: "playlist",
  },
];

export default function MusicControl() {
  const { currentEmbed, setEmbedFromUrl, clearEmbed, isVisible, setIsVisible } = useMusic();
  const [showInput, setShowInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError(null);

    if (!urlInput.trim()) {
      setUrlError("Please enter a Spotify URL");
      return;
    }

    const success = setEmbedFromUrl(urlInput.trim());
    if (success) {
      setUrlInput("");
      setShowInput(false);
    } else {
      setUrlError("Invalid Spotify URL. Please use a track, album, or playlist URL from open.spotify.com");
    }
  };

  const handlePlaylistSelect = (playlist: CuratedPlaylist) => {
    const success = setEmbedFromUrl(playlist.url);
    if (!success) {
      setUrlError("Failed to load playlist");
    } else {
      setShowInput(false);
    }
  };

  const handleToggle = () => {
    if (isVisible && currentEmbed) {
      setIsVisible(false);
    } else if (currentEmbed) {
      setIsVisible(true);
    } else {
      setShowInput(true);
    }
  };

  if (!isVisible && !currentEmbed && !showInput) {
    // Collapsed state - show minimal button
    return (
      <div className="fixed bottom-4 left-4 z-30">
        <button
          type="button"
          onClick={() => setShowInput(true)}
          className="flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[var(--surface)] px-4 py-2.5 shadow-sm hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          aria-label="Open music player"
        >
          <Music className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
          <span className="text-sm font-medium text-[var(--text-body)]">Music</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-30 max-w-[92vw] sm:max-w-md">
      <div className="rounded-2xl border border-[color:var(--line)] bg-[var(--surface)] p-4 shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Music className="h-4 w-4 text-[var(--text-muted)]" aria-hidden="true" />
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">Music</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              aria-label="Show help"
              aria-expanded={showHelp}
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowInput(false);
                setIsVisible(false);
                if (!currentEmbed) {
                  clearEmbed();
                }
              }}
              className="rounded-full p-1.5 text-[var(--text-muted)] hover:bg-[var(--surface-2)] hover:text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Help/Info UI */}
        {showHelp && (
          <div className="mb-4 rounded-xl border border-[color:var(--line)] bg-[var(--surface-2)] p-3 text-xs text-[var(--text-muted)] space-y-2">
            <p className="font-semibold text-[var(--text-body)]">About Spotify Music</p>
            <p>
              This player uses Spotify&apos;s official embed only. No SDK, no OAuth, no Premium required. 
              Paste any Spotify track, album, or playlist URL to play.
            </p>
            <p>
              <strong>Note:</strong> Playback may reset when you navigate between pages. This is expected behavior 
              with embedded players.
            </p>
            <p>
              This feature is compliant under monetisation and does not require Spotify Premium. 
              All playback is handled by Spotify&apos;s embed player.
            </p>
          </div>
        )}

        {/* URL Input Form */}
        {showInput && (
          <div className="mb-3 space-y-3">
            <form onSubmit={handleUrlSubmit} className="space-y-2">
              <label htmlFor="spotify-url" className="block text-xs font-medium text-[var(--text-body)]">
                Paste Spotify URL
              </label>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  id="spotify-url"
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  placeholder="https://open.spotify.com/track/..."
                  className="flex-1 rounded-lg border border-[color:var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text-body)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0"
                  aria-invalid={urlError ? "true" : "false"}
                  aria-describedby={urlError ? "url-error" : undefined}
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                >
                  Load
                </button>
              </div>
              {urlError && (
                <div id="url-error" className="flex items-start gap-2 text-xs text-red-600" role="alert">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <span>{urlError}</span>
                </div>
              )}
            </form>

            {/* Curated Playlists */}
            <div>
              <p className="mb-2 text-xs font-medium text-[var(--text-body)]">Or choose a curated playlist:</p>
              <div className="space-y-2">
                {CURATED_PLAYLISTS.map((playlist) => (
                  <button
                    key={playlist.id}
                    type="button"
                    onClick={() => handlePlaylistSelect(playlist)}
                    className="w-full rounded-lg border border-[color:var(--line)] bg-[var(--surface)] p-3 text-left hover:bg-[var(--surface-2)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-0 transition-colors"
                  >
                    <p className="text-sm font-medium text-[var(--text-body)]">{playlist.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{playlist.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Embed Display */}
        {currentEmbed && isVisible && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-[var(--accent-2)]" aria-hidden="true" />
                <p className="text-xs text-[var(--text-muted)]">
                  {currentEmbed.resourceType === "track" && "Track"}
                  {currentEmbed.resourceType === "album" && "Album"}
                  {currentEmbed.resourceType === "playlist" && "Playlist"} playing
                </p>
              </div>
              <button
                type="button"
                onClick={clearEmbed}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-body)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 rounded px-2 py-1"
              >
                Change
              </button>
            </div>
            <div className="rounded-xl overflow-hidden">
              <iframe
                title="Spotify player"
                src={currentEmbed.embedUrl}
                width="100%"
                height="152"
                style={{ border: "0", minHeight: "152px" }}
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Playback may reset on page navigation. This is expected with embedded players.
            </p>
          </div>
        )}

        {/* Toggle visibility when embed exists but is hidden */}
        {currentEmbed && !isVisible && (
          <button
            type="button"
            onClick={() => setIsVisible(true)}
            className="w-full rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
          >
            Show Player
          </button>
        )}
      </div>
    </div>
  );
}

