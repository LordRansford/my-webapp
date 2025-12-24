"use client";

import Link from "next/link";
import DonateButton from "@/components/donations/DonateButton";
import BrandLogo from "@/components/BrandLogo";
import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PersistStore } from "@/games/engine/persist";
import { createGamesProgressStore } from "@/games/progress";

export default function Footer() {
  const router = useRouter();
  const storeRef = useRef<PersistStore | null>(null);
  const holdTimer = useRef<number | null>(null);
  const seq = useRef<string[]>([]);

  useEffect(() => {
    if (storeRef.current == null) {
      storeRef.current = new PersistStore({ prefix: "rn_games", version: "v1" });
    }
  }, []);

  const tryEnterDevRoom = useCallback(() => {
    if (!storeRef.current) return;
    const progress = createGamesProgressStore(storeRef.current);
    if (!progress.tryUnlockDevRoom()) return;
    router.push("/games/dev-room");
  }, [router]);

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
  }, [tryEnterDevRoom]);

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

  const footerNav = [
    {
      title: "Learn",
      links: [
        { label: "Courses", href: "/courses" },
        { label: "CPD", href: "/cpd" },
      ],
    },
    {
      title: "Tools",
      links: [
        { label: "Labs", href: "/tools" },
        { label: "Studios", href: "/studios" },
      ],
    },
    {
      title: "Play",
      links: [
        { label: "Games", href: "/games" },
        { label: "Offline", href: "/play" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "/about" },
        { label: "Contact", href: "/contact" },
      ],
    },
  ];

  const policyLinks = [
    { label: "Legal", href: "/trust-and-about" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ];

  return (
    <footer className="site-footer" aria-label="Footer">
      <div className="site-footer__inner flex flex-col gap-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <button
              type="button"
              onPointerDown={onHoldStart}
              onPointerUp={onHoldEnd}
              onPointerCancel={onHoldEnd}
              onPointerLeave={onHoldEnd}
              className="inline-flex items-center rounded-md"
              aria-label="Ransford’s Notes logo"
            >
              <BrandLogo className="h-12 w-auto text-slate-900" />
            </button>
            <p className="text-xl font-semibold text-slate-900">RansfordsNotes</p>
            <p className="muted text-sm">
              Browser-native courses, tools, labs, and games built to stay readable, calm, and offline-capable. Clear inputs, clear
              outputs, and no hidden mechanics.
            </p>
            <p className="muted text-sm">
              CPD: structured objectives with conservative hour estimates and evidence-friendly outputs.
            </p>
          </div>

          <div className="grid w-full max-w-3xl gap-6 sm:grid-cols-2 md:grid-cols-4" role="navigation" aria-label="Footer sitemap">
            {footerNav.map((section) => (
              <div key={section.title} className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">{section.title}</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link className="hover:underline" href={link.href}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--line)] pt-4 text-sm">
          <div className="flex flex-wrap items-center gap-4 font-semibold text-slate-800">
            <span>© {new Date().getFullYear()} RansfordsNotes</span>
            {policyLinks.map((item) => (
              <Link key={item.href} className="hover:underline" href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-700">
            <a className="hover:underline" href="https://github.com/LordRansford" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="hover:underline" href="mailto:hello@ransfordsnotes.example">
              Email
            </a>
            <DonateButton />
          </div>
        </div>
      </div>
    </footer>
  );
}


