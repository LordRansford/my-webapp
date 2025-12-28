"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/BrandLogo";
import { signIn, useSession } from "next-auth/react";

type NavItem = { label: string; href: string };

const navItems: NavItem[] = [
  { label: "Site Map", href: "/sitemap" },
  { label: "Courses", href: "/courses" },
  { label: "Tools", href: "/tools" },
  { label: "Studios", href: "/studios" },
  { label: "Games", href: "/games" },
  { label: "About", href: "/about" },
];

function NavLinks({ vertical = false, pathname, onLinkClick }: { vertical?: boolean; pathname: string | null; onLinkClick: () => void }) {
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

  const isActive = (href: string) => {
    if (!pathname) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      aria-label={vertical ? "Primary navigation (mobile)" : "Primary navigation"}
      className={vertical ? "flex flex-col gap-2" : "nav-links hidden items-center gap-2 lg:flex"}
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-active={active}
            className={`${vertical ? "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base" : "rounded-full px-3 py-2 text-sm"} font-semibold transition ${
              active 
                ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
                : "text-slate-900 bg-transparent hover:bg-slate-100 hover:text-slate-900"
            } ${focusStyle}`}
            onClick={onLinkClick}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function AccountAction({ variant, isSignedIn, onActionClick }: { variant: "desktop" | "mobile"; isSignedIn: boolean; onActionClick: () => void }) {
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";
  const base =
    variant === "mobile"
      ? "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 shadow-sm"
      : `rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${focusStyle}`;

  if (isSignedIn) {
    return (
      <Link
        href="/account"
        className={`${base} ${variant === "desktop" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
        onClick={onActionClick}
      >
        Account
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        onActionClick();
        signIn();
      }}
      className={`${base} ${variant === "desktop" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
    >
      Sign in
    </button>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isSignedIn = Boolean(session?.user);
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

  return (
    <header className="site-header" role="banner">
      <div className="site-header__inner">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden ${focusStyle}`}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1">
              <span className="block h-0.5 w-6 bg-slate-900" />
              <span className="block h-0.5 w-6 bg-slate-900" />
              <span className="block h-0.5 w-6 bg-slate-900" />
            </div>
          </button>
          <Link href="/" className="brand rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600" onClick={() => setMobileOpen(false)}>
            <span className="sr-only">Ransford&apos;s Notes home</span>
            <BrandLogo className="h-10 w-auto text-slate-900" />
          </Link>
        </div>

        <NavLinks pathname={pathname} onLinkClick={() => setMobileOpen(false)} />

        <div className="hidden items-center gap-2 lg:flex">
          <AccountAction variant="desktop" isSignedIn={isSignedIn} onActionClick={() => setMobileOpen(false)} />
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[color:var(--line)] bg-[var(--surface)] px-4 py-4 lg:hidden">
          <NavLinks vertical pathname={pathname} onLinkClick={() => setMobileOpen(false)} />
          <div className="mt-3 flex flex-col gap-2">
            <AccountAction variant="mobile" isSignedIn={isSignedIn} onActionClick={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}
    </header>
  );
}
