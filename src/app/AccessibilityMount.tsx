"use client";

import dynamic from "next/dynamic";

const AccessibilityControls = dynamic(() => import("@/components/accessibility/AccessibilityControls"), { ssr: false });

export default function AccessibilityMount() {
  return <AccessibilityControls />;
}

