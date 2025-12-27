"use client";

import dynamic from "next/dynamic";

const MusicControl = dynamic(() => import("@/components/spotify/MusicControl"), { ssr: false });

export default function MusicMount() {
  return <MusicControl />;
}

