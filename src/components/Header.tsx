"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { signIn, signOut, useSession } from "next-auth/react";

type Dropdown = {
  id: string;
  label: string;
  items: { label: string; href: string }[];
};

const dropdowns: Dropdown[] = [
  {
    id: "courses",
    label: "Courses",
    items: [
      { label: "AI", href: "/ai" },
      { label: "Data", href: "/data" },
      { label: "Cybersecurity", href: "/cybersecurity" },
      { label: "Software Architecture", href: "/software-architecture" },
      { label: "Digitalisation", href: "/digitalisation" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      { label: "Labs", href: "/studios" },
      { label: "Templates", href: "/templates" },
    ],
  },
  {
    id: "cpd",
    label: "CPD",
    items: [
      { label: "My CPD", href: "/my-cpd" },
      { label: "Certificates", href: "/my-cpd/evidence" },
      { label: "Accreditation", href: "/accreditation" },
    ],
  },
  {
    id: "studios",
    label: "Studios",
    items: [
      { label: "Ransford’s AI Studio", href: "/studios" },
      { label: "Software Development Studio", href: "/dev-studios" },
    ],
  },
];

const utilityLinks = [
  { label: "Trust", href: "/trust" },
  { label: "Accreditation", href: "/accreditation" },
  { label: "About", href: "/about" },
  { label: "Mentor", href: "/mentor" },
  { label: "Play", href: "/play" },
];

const utilityActions = [
  { label: "Support this work", href: "/support/donate" },
  { label: "Subscribe", href: "/subscribe" },
];

export default function Header() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [plan, setPlan] = useState<string | null>(null);

  const initials = (() => {
    const src = user?.name || user?.email || "";
    const parts = String(src).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "U";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  useEffect(() => {
    const close = () => setOpenDropdown(null);
    window.addEventListener("resize", close);
    return () => window.removeEventListener("resize", close);
  }, []);

  useEffect(() => {
    fetch("/api/billing/summary")
      .then((r) => r.json())
      .then((d) => setPlan(d?.plan || "free"))
      .catch(() => setPlan("free"));
  }, []);

  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

  const toggleDropdown = (id: string) => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const handleEsc = (event: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (event.key === "Escape") {
      setOpenDropdown(null);
      setMobileOpen(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      {/* Utility bar */}
      <div className="hidden items-center justify-between px-4 py-2 text-xs text-slate-700 sm:flex">
        <div className="flex items-center gap-4">
          {utilityLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`hover:text-slate-900 ${focusStyle}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          {utilityActions.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`hover:text-slate-900 ${focusStyle}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Primary nav */}
      <nav aria-label="Primary" className="border-t border-slate-100">
        <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden ${focusStyle}`}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((prev) => !prev)}
              onKeyDown={handleEsc}
            >
              <span className="sr-only">Toggle navigation</span>
              <div className="space-y-1">
                <span className="block h-0.5 w-6 bg-slate-900" />
                <span className="block h-0.5 w-6 bg-slate-900" />
                <span className="block h-0.5 w-6 bg-slate-900" />
              </div>
            </button>
            <Link href="/" className={`flex items-center gap-3 rounded-lg ${focusStyle}`}>
              <div className="rounded-xl bg-white/0">
                <BrandLogo className="h-10 w-auto text-slate-900" />
              </div>
            </Link>
          </div>

          <div className="hidden items-center gap-6 lg:flex">
            {dropdowns.map((menu) => (
              <div key={menu.id} className="relative">
                <button
                  type="button"
                  className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-800 hover:text-slate-900 ${focusStyle}`}
                  aria-haspopup="true"
                  aria-expanded={openDropdown === menu.id}
                  onClick={() => toggleDropdown(menu.id)}
                  onKeyDown={handleEsc}
                >
                  {menu.label}
                  <span aria-hidden="true">▾</span>
                </button>
                {openDropdown === menu.id && (
                  <div
                    role="menu"
                    className="absolute left-0 z-20 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                  >
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        role="menuitem"
                        className={`block rounded-xl px-3 py-2 text-sm text-slate-800 hover:bg-slate-50 ${focusStyle}`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/trust" className={`text-sm font-semibold text-slate-800 hover:text-slate-900 ${focusStyle}`}>
              Trust
            </Link>
            <Link href="/accreditation" className={`text-sm font-semibold text-slate-800 hover:text-slate-900 ${focusStyle}`}>
              Accreditation
            </Link>
            <Link href="/about" className={`text-sm font-semibold text-slate-800 hover:text-slate-900 ${focusStyle}`}>
              About
            </Link>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/support/donate"
              className={`rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${focusStyle}`}
            >
              Support this work
            </Link>
            <Link
              href="/studios"
              className={`rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
            >
              Open Labs
            </Link>
            {user?.id ? (
              <div className="flex items-center gap-2">
                {plan === "supporter" ? (
                  <span className="rounded-full bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">Supporter</span>
                ) : null}
                <Link
                  href="/account"
                  className={`rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                >
                  Account
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className={`rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                >
                  Sign out
                </button>
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-900"
                  aria-label={user?.name || user?.email || "Signed in user"}
                  title={user?.email || undefined}
                >
                  {initials}
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => signIn()}
                className={`rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
              >
                Sign in
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden" onKeyDown={handleEsc}>
            <div className="mb-3 flex flex-wrap gap-3 text-sm text-slate-700">
              {[...utilityLinks, ...utilityActions].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-lg px-2 py-1 hover:bg-slate-50 ${focusStyle}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="space-y-3">
              {dropdowns.map((menu) => (
                <details key={menu.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">{menu.label}</summary>
                  <div className="mt-2 space-y-1">
                    {menu.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className={`block rounded-lg px-2 py-1 text-sm text-slate-800 hover:bg-white ${focusStyle}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ))}
              <Link
                href="/trust"
                className={`block rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 ${focusStyle}`}
                onClick={() => setMobileOpen(false)}
              >
                Trust
              </Link>
              <Link
                href="/accreditation"
                className={`block rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 ${focusStyle}`}
                onClick={() => setMobileOpen(false)}
              >
                Accreditation
              </Link>
              <Link
                href="/about"
                className={`block rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-900 ${focusStyle}`}
                onClick={() => setMobileOpen(false)}
              >
                About
              </Link>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/support/donate"
                className={`rounded-full bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-slate-800 ${focusStyle}`}
                onClick={() => setMobileOpen(false)}
              >
                Support this work
              </Link>
              <Link
                href="/studios"
                className={`rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                onClick={() => setMobileOpen(false)}
              >
                Open Labs
              </Link>
              {user?.id ? (
                <>
                  <Link
                    href="/account"
                    className={`rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    Account
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      signOut();
                    }}
                    className={`rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    signIn();
                  }}
                  className={`rounded-full border border-slate-300 px-4 py-2 text-center text-sm font-semibold text-slate-900 hover:border-slate-400 ${focusStyle}`}
                >
                  Sign in
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
