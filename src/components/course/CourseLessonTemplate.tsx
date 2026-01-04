"use client";

import { ReactNode } from "react";
import NotesLayout from "@/components/notes/Layout";
import CourseLessonActionBar from "@/components/course/CourseLessonActionBar";

type Meta = {
  title: string;
  description: string;
  level: string;
  slug: string;
  page?: number;
  totalPages?: number;
  section?: string;
};

type Heading = { id: string; title: string; depth: number };

export default function CourseLessonTemplate({
  meta,
  headings,
  activeLevelId,
  courseHref,
  courseLabel,
  dashboardHref,
  labsHref,
  studiosHref,
  children,
}: {
  meta: Meta;
  headings: Heading[];
  activeLevelId: string;
  courseHref: string;
  courseLabel: string;
  dashboardHref?: string;
  labsHref?: string;
  studiosHref?: string;
  children: ReactNode;
}) {
  return (
    <NotesLayout meta={meta} activeLevelId={activeLevelId} headings={headings}>
      <CourseLessonActionBar
        courseHref={courseHref}
        courseLabel={courseLabel}
        dashboardHref={dashboardHref}
        labsHref={labsHref}
        studiosHref={studiosHref}
      />
      {children}
    </NotesLayout>
  );
}

