"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const dashboardLinks = [
  { href: "/dashboards", label: "All dashboards" },
  { href: "/dashboards/ai", label: "AI dashboards" },
  { href: "/dashboards/cybersecurity", label: "Cybersecurity dashboards" },
  { href: "/dashboards/digitalisation", label: "Digitalisation dashboards" },
];

export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div ref={navRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="nav-links__trigger"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Dashboard navigation"
      >
        Dashboards
        <span className="nav-links__chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>
      {isOpen && (
        <nav
          className="nav-links__dropdown"
          role="menu"
          aria-label="Dashboard submenu"
        >
          {dashboardLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-links__dropdown-item"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}

