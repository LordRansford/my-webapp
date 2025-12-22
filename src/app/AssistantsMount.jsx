"use client";

import dynamic from "next/dynamic";

const AssistantShell = dynamic(() => import("@/components/assistants/AssistantShell"), { ssr: false });

export default function AssistantsMount() {
  return <AssistantShell />;
}


