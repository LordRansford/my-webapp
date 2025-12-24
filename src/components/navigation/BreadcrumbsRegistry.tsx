"use client";

import { createContext, useContext, useMemo, useState } from "react";

type BreadcrumbItem = { label: string; href?: string };

type RegistryValue = {
  hasBreadcrumbs: boolean;
  register: (items?: BreadcrumbItem[]) => void;
  items: BreadcrumbItem[] | null;
};

const BreadcrumbsContext = createContext<RegistryValue>({
  hasBreadcrumbs: false,
  register: () => {},
  items: null,
});

export function BreadcrumbsProvider({ children }: { children: React.ReactNode }) {
  const [hasBreadcrumbs, setHasBreadcrumbs] = useState(false);
  const [items, setItems] = useState<BreadcrumbItem[] | null>(null);

  const value = useMemo(
    () => ({
      hasBreadcrumbs,
      items,
      register: (next?: BreadcrumbItem[]) => {
        setHasBreadcrumbs(true);
        if (Array.isArray(next) && next.length) setItems(next);
      },
    }),
    [hasBreadcrumbs, items]
  );

  return <BreadcrumbsContext.Provider value={value}>{children}</BreadcrumbsContext.Provider>;
}

export function useBreadcrumbsRegistry() {
  return useContext(BreadcrumbsContext);
}

