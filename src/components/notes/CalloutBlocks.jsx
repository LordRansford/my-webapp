"use client";

import Callout from "@/components/Callout";

export function Definition({ title = "Definition", children }) {
  return (
    <Callout title={title} type="info">
      {children}
    </Callout>
  );
}

export function Example({ title = "Example", children }) {
  return (
    <Callout title={title} type="success">
      {children}
    </Callout>
  );
}

export function Warning({ title = "Warning", children }) {
  return (
    <Callout title={title} type="warning">
      {children}
    </Callout>
  );
}

export function CommonMistake({ title = "Common mistake", children }) {
  return (
    <Callout title={title} type="warning">
      {children}
    </Callout>
  );
}


