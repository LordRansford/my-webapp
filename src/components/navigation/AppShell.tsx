"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/navigation/Breadcrumbs";
import type { BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import { BreadcrumbsProvider, useBreadcrumbsRegistry } from "@/components/navigation/BreadcrumbsRegistry";
import { ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";

type AppShellProps = {
  children: ReactNode;
};

export function PageContainer({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="page-shell" role="main">
      {children}
    </main>
  );
}

function buildBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  let current = "";
  segments.forEach((seg, idx) => {
    current += `/${seg}`;
    const label = seg.replace(/-/g, " ");
    items.push({ label: label.charAt(0).toUpperCase() + label.slice(1), href: idx === segments.length - 1 ? undefined : current });
  });
  return items;
}

function BreadcrumbsFallback() {
  const { hasBreadcrumbs, items } = useBreadcrumbsRegistry();
  const pathname = usePathname() || "/";
  const auto = useMemo(() => buildBreadcrumbs(pathname), [pathname]);
  if (pathname === "/" || hasBreadcrumbs) return null;
  return <Breadcrumbs items={items && items.length ? items : auto} />;
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <BreadcrumbsProvider>
      <div className="app-shell">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Header />
        <div className="page-shell">
          <BreadcrumbsFallback />
          <PageContainer>{children}</PageContainer>
        </div>
        <Footer />
      </div>
    </BreadcrumbsProvider>
  );
}
