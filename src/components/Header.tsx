"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, type ReactNode } from "react";
import BrandLogo from "@/components/BrandLogo";
import { signIn, useSession } from "next-auth/react";
import CreditBalanceWidget from "@/components/studios/CreditBalanceWidget";

type NavItem = { 
  label: string; 
  href: string;
  submenu?: { label: string; href: string }[];
};

function NavHref({
  href,
  children,
  className,
  "aria-current": ariaCurrent,
  "aria-label": ariaLabel,
  "data-active": dataActive,
  forceAnchor = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  "aria-current"?: "page";
  "aria-label"?: string;
  "data-active"?: boolean;
  forceAnchor?: boolean;
}) {
  // In Playwright + Next dev, client-side navigation can wait for route compilation before the URL updates.
  // For the mobile drawer we prefer an immediate, robust navigation via a plain anchor.
  // (Desktop keeps next/link for smooth client-side routing.)
  if (forceAnchor) {
    return (
      <a href={href} className={className} aria-current={ariaCurrent} aria-label={ariaLabel} data-active={dataActive}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} aria-current={ariaCurrent} aria-label={ariaLabel} data-active={dataActive}>
      {children}
    </Link>
  );
}

const navItems: NavItem[] = [
  { label: "Courses", href: "/courses" },
  { 
    label: "Studios", 
    href: "/studios/hub",
    submenu: [
      { label: "Unified Hub", href: "/studios/hub" },
      { label: "AI Studio", href: "/studios/ai-hub" },
      { label: "Dev Studio", href: "/dev-studio" },
      { label: "Cyber Studio", href: "/cyber-studio" },
      { label: "Data Studio", href: "/data-studio" },
      { label: "Architecture Studio", href: "/studios/architecture-diagram-studio" },
    ]
  },
  { label: "Tools", href: "/tools" },
  { 
    label: "Games hub", 
    href: "/games/hub",
    submenu: [
      { label: "Games Hub", href: "/games/hub" },
      { label: "All Games", href: "/games" },
      { label: "Practice Games", href: "/practice" },
      { label: "Thinking Gym", href: "/thinking-gym" },
    ]
  },
  { label: "Updates", href: "/updates" },
  { label: "About", href: "/about" },
];

function NavItemWithDropdown({ 
  item, 
  active, 
  vertical, 
  onLinkClick 
}: { 
  item: NavItem; 
  active: boolean; 
  vertical: boolean; 
  onLinkClick: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  if (vertical) {
    // Mobile: render as nested list
    return (
      <div className="space-y-2">
        <NavHref
          href={item.href}
          aria-current={active ? "page" : undefined}
          data-active={active}
          forceAnchor
          className={`block w-full max-w-full break-words rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-base font-semibold transition ${
            active 
              ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
              : "text-slate-900 hover:bg-slate-100"
          } ${focusStyle}`}
        >
          {item.label}
        </NavHref>
        {item.submenu && (
          <ul className="ml-4 space-y-1 border-l border-slate-200 pl-4">
            {item.submenu.map((subItem) => (
              <li key={subItem.href}>
                <NavHref
                  href={subItem.href}
                  forceAnchor
                  className="block w-full max-w-full break-words rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  {subItem.label}
                </NavHref>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Desktop: render as dropdown (using existing nav-links styles for consistency)
  return (
    <div ref={navRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label={`${item.label} menu`}
        className={`nav-links__trigger ${focusStyle} ${
          active 
            ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
            : "text-slate-900 bg-transparent hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        {item.label}
        <span className="nav-links__chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && item.submenu && (
        <nav
          className="nav-links__dropdown"
          role="menu"
          aria-label={`${item.label} submenu`}
        >
          {item.submenu.map((subItem) => (
            <Link
              key={subItem.href}
              href={subItem.href}
              className="nav-links__dropdown-item"
              role="menuitem"
              onClick={() => {
                setIsOpen(false);
                onLinkClick();
              }}
            >
              {subItem.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

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
      className={vertical ? "flex w-full max-w-full flex-col gap-2" : "nav-links hidden items-center gap-2 lg:flex"}
    >
      {navItems.map((item) => {
        const active = isActive(item.href);
        if (item.submenu) {
          return (
            <NavItemWithDropdown
              key={item.href}
              item={item}
              active={active}
              vertical={vertical}
              onLinkClick={onLinkClick}
            />
          );
        }
        return (
          <NavHref
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            data-active={active}
            forceAnchor={vertical}
            className={`${vertical ? "block w-full max-w-full break-words rounded-2xl border border-slate-200 bg-white px-3 py-2 text-left text-base" : "rounded-full px-3 py-2 text-sm"} font-semibold transition ${
              active 
                ? "bg-slate-900 text-white shadow-sm hover:bg-slate-800" 
                : "text-slate-900 bg-transparent hover:bg-slate-100 hover:text-slate-900"
            } ${focusStyle}`}
          >
            {item.label}
          </NavHref>
        );
      })}
    </nav>
  );
}

function AccountAction({ variant, isSignedIn }: { variant: "desktop" | "mobile"; isSignedIn: boolean }) {
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";
  const base =
    variant === "mobile"
      ? "rounded-2xl border border-slate-200 bg-white px-3 py-2 text-base font-semibold text-slate-900 shadow-sm"
      : `rounded-full px-4 py-2 text-sm font-semibold shadow-sm ${focusStyle}`;

  if (isSignedIn) {
    if (variant === "mobile") {
      return (
        <a href="/account" className={base}>
          Account
        </a>
      );
    }
    return (
      <Link
        href="/account"
        className={`${base} ${variant === "desktop" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
      >
        Account
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <a href="/signin" className={base}>
        Sign in
      </a>
    );
  }
  return (
    <Link
      href="/signin"
      className={`${base} ${variant === "desktop" ? "bg-slate-900 text-white hover:bg-slate-800" : ""}`}
    >
      Sign in
    </Link>
  );
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();
  const isSignedIn = Boolean(session?.user);
  const focusStyle =
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600";

  // Close the mobile drawer after navigation completes.
  // Avoid closing synchronously in Link onClick: that can sometimes prevent client-side navigation.
  useEffect(() => {
    if (!mobileOpen) return;
    setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;

    const onScroll = () => {
      // Never hide while the mobile menu is open.
      if (mobileOpen) {
        setHidden(false);
        return;
      }

      const y = window.scrollY || 0;
      const delta = y - lastY;
      lastY = y;

      // Always show near the top so the header doesn't feel broken.
      if (y < 10) {
        setHidden(false);
        return;
      }

      // If user scrolls up, reveal. If scrolling down, hide.
      if (delta < -6) {
        setHidden(false);
        return;
      }
      if (delta > 10) {
        setHidden(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll as any);
    };
  }, [mobileOpen]);

  return (
    <header className={`site-header ${hidden ? "site-header--hidden" : ""}`} role="banner">
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
          <Link href="/" className="brand rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600">
            <span className="sr-only">Ransford&apos;s Notes home</span>
            <BrandLogo className="h-10 w-auto text-slate-900" />
          </Link>
        </div>

        <NavLinks pathname={pathname} onLinkClick={() => setMobileOpen(false)} />

        <div className="hidden items-center gap-3 lg:flex">
          {isSignedIn && <CreditBalanceWidget compact />}
          <AccountAction variant="desktop" isSignedIn={isSignedIn} />
        </div>
      </div>

      {mobileOpen ? (
        <div className="lg:hidden">
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 right-0 z-50 border-t border-[color:var(--line)] bg-[var(--surface)] px-4 py-4 overflow-y-auto" style={{ top: "var(--header-height, 64px)", maxHeight: "calc(100dvh - var(--header-height, 64px))" }}>
            <NavLinks vertical pathname={pathname} onLinkClick={() => setMobileOpen(false)} />
            <div className="mt-3 flex flex-col gap-2">
              <AccountAction variant="mobile" isSignedIn={isSignedIn} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
