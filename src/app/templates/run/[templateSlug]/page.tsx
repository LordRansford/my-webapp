import React from "react";
import { TemplateRunner } from "@/components/templates/TemplateRunner";

export default async function TemplateRunnerPage({ params }: { params: Promise<{ templateSlug: string }> }) {
  const resolved = await Promise.resolve(params);
  return <TemplateRunner slug={resolved.templateSlug} />;
}
