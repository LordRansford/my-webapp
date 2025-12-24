"use client";

import { ReactNode } from "react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

type WithBreadcrumbs = {
  breadcrumbs?: BreadcrumbItem[];
};

export function MarketingPageTemplate({ children, breadcrumbs }: { children: ReactNode } & WithBreadcrumbs) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {children}
    </div>
  );
}

export function StaticInfoTemplate({ children, breadcrumbs }: { children: ReactNode } & WithBreadcrumbs) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {children}
    </div>
  );
}

type CourseTemplateProps = {
  breadcrumbs?: BreadcrumbItem[];
  sidebar?: ReactNode;
  progress?: ReactNode;
  footerNav?: ReactNode;
  children: ReactNode;
};

export function CourseOverviewTemplate({ breadcrumbs, sidebar, progress, children, footerNav }: CourseTemplateProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {progress}
      <div className="mt-4 grid gap-6 lg:grid-cols-[260px,1fr]">
        {sidebar ? <aside className="space-y-4">{sidebar}</aside> : null}
        <section>{children}</section>
      </div>
      {footerNav ? <div className="mt-6">{footerNav}</div> : null}
    </div>
  );
}

export function CourseLessonTemplate({ breadcrumbs, sidebar, progress, children, footerNav }: CourseTemplateProps) {
  return (
    <CourseOverviewTemplate breadcrumbs={breadcrumbs} sidebar={sidebar} progress={progress} footerNav={footerNav}>
      {children}
    </CourseOverviewTemplate>
  );
}

export function CourseAssessmentTemplate({ breadcrumbs, sidebar, progress, children, footerNav }: CourseTemplateProps) {
  return (
    <CourseOverviewTemplate breadcrumbs={breadcrumbs} sidebar={sidebar} progress={progress} footerNav={footerNav}>
      {children}
    </CourseOverviewTemplate>
  );
}

type StudioTemplateProps = {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  backHref?: string;
};

function BackLink({ href }: { href: string }) {
  return (
    <div className="mb-3">
      <a href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 underline decoration-slate-300 underline-offset-4">
        ← Back
      </a>
    </div>
  );
}

export function StudioLandingTemplate({ children, breadcrumbs, backHref }: StudioTemplateProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {backHref ? <BackLink href={backHref} /> : null}
      {children}
    </div>
  );
}

export function StudioToolTemplate({ children, breadcrumbs, backHref }: StudioTemplateProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {backHref ? <BackLink href={backHref} /> : null}
      {children}
    </div>
  );
}

export function StudioResultsTemplate({ children, breadcrumbs, backHref }: StudioTemplateProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {backHref ? <BackLink href={backHref} /> : null}
      {children}
    </div>
  );
}

export function GameHubTemplate({ children, breadcrumbs }: { children: ReactNode } & WithBreadcrumbs) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {children}
    </div>
  );
}

export function GameLoadingTemplate({ children, breadcrumbs }: { children: ReactNode } & WithBreadcrumbs) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {children}
    </div>
  );
}

export function GameCanvasTemplate({ children, breadcrumbs }: { children: ReactNode } & WithBreadcrumbs) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 lg:px-8">
      {breadcrumbs ? <Breadcrumbs items={breadcrumbs} /> : null}
      {children}
    </div>
  );
}
