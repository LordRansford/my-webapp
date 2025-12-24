"use client";

import Link from "next/link";
import DonateButton from "@/components/donations/DonateButton";
import BrandLogo from "@/components/BrandLogo";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PersistStore } from "@/games/engine/persist";
import { createGamesProgressStore } from "@/games/progress";

export default function Footer() {
  const router = useRouter();
  const storeRef = useRef<PersistStore | null>(null);
  const holdTimer = useRef<number | null>(null);
  const seq = useRef<string[]>([]);

  if (!storeRef.current) storeRef.current = new PersistStore({ prefix: "rn_games", version: "v1" });

  const tryEnterDevRoom = () => {
    const progress = createGamesProgressStore(storeRef.current!);
    if (!progress.tryUnlockDevRoom()) return;
    router.push("/games/dev-room");
  };

  useEffect(() => {
    // Konami-style sequence (documented in code comments only):
    // ArrowUp, ArrowUp, ArrowDown, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft, ArrowRight, b, a
    const target = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    const onKeyDown = (e: KeyboardEvent) => {
      seq.current.push(e.key);
      if (seq.current.length > target.length) seq.current.shift();
      const match = target.every((k, i) => seq.current[i] === k);
      if (match) tryEnterDevRoom();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const onHoldStart = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      tryEnterDevRoom();
    }, 1200);
  };
  const onHoldEnd = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = null;
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <button
            type="button"
            onPointerDown={onHoldStart}
            onPointerUp={onHoldEnd}
            onPointerCancel={onHoldEnd}
            onPointerLeave={onHoldEnd}
            className="inline-flex items-center rounded-md"
            style={{ marginBottom: "0.75rem" }}
            aria-label="Ransford’s Notes logo"
          >
            <BrandLogo className="h-12 w-auto text-slate-900" />
          </button>
          <p className="eyebrow">Ransford Chung Amponsah</p>
          <p className="muted">
            I build notes and browser labs for data, digitalisation, AI, cybersecurity, and engineering. I try to keep it clear,
            accurate, and practical.
          </p>
          <p className="muted">
            CPD: designed to support self-directed CPD with clear objectives, conservative hour estimates, and evidence-friendly outputs.
          </p>
        </div>
        <div className="footer-links" aria-label="Footer">
          <Link href="/courses">Start learning</Link>
          <Link href="/tools">Explore the platform</Link>
          <Link href="/tools">Tools</Link>
          <Link href="/templates">Templates</Link>
          <Link href="/studios">Studios</Link>
          <Link href="/dashboards">Dashboards</Link>
          <Link href="/cpd">CPD</Link>
          <Link href="/play">Play</Link>
          <Link href="/support">Support</Link>
          <Link href="/about">About</Link>
          <Link href="/trust-and-about">Trust and credibility</Link>
          <Link href="/accreditation-and-alignment">Accreditation</Link>
          <Link href="/subscribe">Subscribe</Link>
          <DonateButton />
          <Link href="/contact">Contact</Link>
          <a href="mailto:hello@ransfordsnotes.example">hello@ransfordsnotes.example</a>
          <Link href="/accessibility">Accessibility</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}


