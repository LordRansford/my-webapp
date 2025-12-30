"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  Rocket, 
  Layout,
  Settings,
  HelpCircle
} from "lucide-react";

interface NavLink {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StudioNavigationProps {
  studioType: "dev" | "cyber" | "data" | "ai" | "architecture";
  showHub?: boolean;
  additionalLinks?: NavLink[];
}

const studioConfigs = {
  dev: {
    hub: "/studios/hub",
    learn: "/dev-studios",
    build: "/dev-studio",
    settings: "/dev-studio/settings",
    color: "sky"
  },
  cyber: {
    hub: "/studios/hub",
    learn: "/cyber-studios",
    build: "/cyber-studio",
    settings: "/cyber-studio/settings",
    color: "rose"
  },
  data: {
    hub: "/studios/hub",
    learn: "/data-studios",
    build: "/data-studio",
    settings: "/data-studio/settings",
    color: "amber"
  },
  ai: {
    hub: "/studios/ai-hub",
    learn: "/ai-studios",
    build: "/ai-studio",
    settings: "/ai-studio/settings",
    color: "purple"
  },
  architecture: {
    hub: "/studios/hub",
    learn: "/studios/architecture-diagram-studio/learn",
    build: "/studios/architecture-diagram-studio",
    settings: "/studios/architecture-diagram-studio/settings",
    color: "indigo"
  }
};

const colorClasses = {
  sky: "bg-sky-600",
  rose: "bg-rose-600",
  amber: "bg-amber-600",
  purple: "bg-purple-600",
  indigo: "bg-indigo-600"
};

function StudioNavigation({ 
  studioType, 
  showHub = true,
  additionalLinks = []
}: StudioNavigationProps) {
  const pathname = usePathname();
  const config = studioConfigs[studioType];
  const activeColor = colorClasses[config.color as keyof typeof colorClasses];

  // Memoize links to prevent unnecessary re-renders
  const baseLinks: NavLink[] = useMemo(() => [
    ...(showHub ? [{ label: "Hub", href: config.hub, icon: Layout }] : []),
    { label: "Learn", href: config.learn, icon: BookOpen },
    { label: "Build", href: config.build, icon: Rocket },
    ...additionalLinks,
    { label: "Settings", href: config.settings, icon: Settings },
    { label: "Help", href: "/help", icon: HelpCircle },
  ], [showHub, config.hub, config.learn, config.build, config.settings, additionalLinks]);

  const isActive = (href: string) => {
    if (pathname === href) return true;
    if (href !== config.build && pathname?.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="flex items-center gap-1 p-2 bg-white rounded-full border border-slate-200 shadow-sm overflow-x-auto">
      {baseLinks.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              active
                ? `${activeColor} text-white`
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default memo(StudioNavigation);


