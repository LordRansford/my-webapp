"use client";

import { createContext, useContext, useMemo, useState, useEffect, ReactNode } from "react";
import { parseSpotifyUrl, SpotifyEmbedInfo } from "@/lib/spotify/urlConverter";

interface MusicContextValue {
  currentEmbed: SpotifyEmbedInfo | null;
  setEmbedFromUrl: (url: string) => boolean;
  clearEmbed: () => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const MusicContext = createContext<MusicContextValue | null>(null);

const STORAGE_KEY_EMBED = "rn_music_embed_v1";
const STORAGE_KEY_VISIBLE = "rn_music_visible_v1";

export function MusicProvider({ children }: { children: ReactNode }) {
  const [currentEmbed, setCurrentEmbed] = useState<SpotifyEmbedInfo | null>(null);
  const [isVisible, setIsVisibleState] = useState(false);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const savedEmbed = window.localStorage.getItem(STORAGE_KEY_EMBED);
      if (savedEmbed) {
        const parsed = JSON.parse(savedEmbed);
        setCurrentEmbed(parsed);
      }

      const savedVisible = window.localStorage.getItem(STORAGE_KEY_VISIBLE);
      if (savedVisible === "1") {
        setIsVisibleState(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Persist embed when it changes
  useEffect(() => {
    try {
      if (currentEmbed) {
        window.localStorage.setItem(STORAGE_KEY_EMBED, JSON.stringify(currentEmbed));
      } else {
        window.localStorage.removeItem(STORAGE_KEY_EMBED);
      }
    } catch {
      // Ignore storage errors
    }
  }, [currentEmbed]);

  // Persist visibility when it changes
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY_VISIBLE, isVisible ? "1" : "0");
    } catch {
      // Ignore storage errors
    }
  }, [isVisible]);

  const setIsVisible = (visible: boolean) => {
    setIsVisibleState(visible);
  };

  const setEmbedFromUrl = (url: string): boolean => {
    const parsed = parseSpotifyUrl(url);
    if (parsed) {
      setCurrentEmbed(parsed);
      setIsVisible(true);
      return true;
    }
    return false;
  };

  const clearEmbed = () => {
    setCurrentEmbed(null);
    setIsVisible(false);
  };

  const value = useMemo(
    () => ({
      currentEmbed,
      setEmbedFromUrl,
      clearEmbed,
      isVisible,
      setIsVisible,
    }),
    [currentEmbed, isVisible]
  );

  return <MusicContext.Provider value={value}>{children}</MusicContext.Provider>;
}

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error("useMusic must be used within MusicProvider");
  }
  return context;
}

