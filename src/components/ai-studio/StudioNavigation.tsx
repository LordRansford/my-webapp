"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Rocket, 
  Home,
  Sparkles,
  Database,
  Layers,
  Bot,
  Play
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navLinks: NavLink[] = [
  { label: "Hub", href: "/studios/ai-hub", icon: Home },
  { label: "Learn", href: "/ai-studios", icon: BookOpen },
  { label: "Build", href: "/ai-studio", icon: Rocket },
  { label: "Datasets", href: "/ai-studio/datasets", icon: Database },
  { label: "Models", href: "/ai-studio", icon: Layers },
  { label: "Agents", href: "/ai-studio/agents", icon: Bot },
  { label: "Training", href: "/ai-studio", icon: Play },
];

export default function StudioNavigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/ai-studio" && pathname === "/ai-studio") return true;
    if (href !== "/ai-studio" && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="flex items-center gap-1 p-2 bg-white rounded-full border border-slate-200 shadow-sm">
      {navLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              active
                ? "bg-purple-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

