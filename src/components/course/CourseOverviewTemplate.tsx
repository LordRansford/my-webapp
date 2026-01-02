"use client";

import { ReactNode } from "react";
import NotesLayout from "@/components/NotesLayout";
import CourseHeroSection from "@/components/course/CourseHeroSection";

type Heading = { id: string; title: string; depth: number };

type Meta = {
  title: string;
  description: string;
  slug: string;
  section: string;
  level: string;
};

type Hero = {
  eyebrow: string;
  title: string;
  description: string;
  highlights?: Array<{ chip: string; text: string }>;
  primaryAction?: { label: string; href: string };
  secondaryActions?: Array<{ label: string; href: string }>;
  icon?: ReactNode;
  gradient?: "blue" | "green" | "purple" | "amber" | "indigo";
};

type JumpLink = { id: string; label: string };

function JumpNav({ links }: { links: JumpLink[] }) {
  if (!Array.isArray(links) || links.length === 0) return null;
  return (
    <nav className="not-prose mt-4 flex flex-wrap gap-2" aria-label="Jump to section">
      {links.map((link) => (
        <a
          key={link.id}
          href={`#${link.id}`}
          className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}

export default function CourseOverviewTemplate({
  meta,
  headings,
  hero,
  jumpLinks,
  topCards,
  children,
}: {
  meta: Meta;
  headings: Heading[];
  hero: Hero;
  jumpLinks?: JumpLink[];
  topCards?: ReactNode;
  children: ReactNode;
}) {
  return (
    <NotesLayout meta={meta} headings={headings} activeLevelId="overview">
      <div>
        <CourseHeroSection {...hero} />
        <JumpNav links={jumpLinks || []} />
        {topCards ? <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">{topCards}</div> : null}
      </div>
      <div className="mt-8 space-y-10">{children}</div>
    </NotesLayout>
  );
}

