"use client";

import { identityTools } from "./IdentityTools";
import { webTools } from "./WebTools";
import { networkTools } from "./NetworkTools";
import { cryptoTools } from "./CryptoTools";
import { governanceTools } from "./GovernanceTools";
import { aiToolComponents } from "../ai/AiTools";
import { dataToolComponents } from "../data/DataTools";
import { archToolComponents } from "../arch/ArchTools";
import { digToolComponents } from "../dig/DigTools";
import GenericMvpTool from "../GenericMvpTool";
import registry from "../../../../content/templates/registry.json";

const toolComponents = {
  ...identityTools,
  ...webTools,
  ...networkTools,
  ...cryptoTools,
  ...governanceTools,
  ...aiToolComponents,
  ...dataToolComponents,
  ...archToolComponents,
  ...digToolComponents,
};

export function getToolComponent(slug) {
  if (toolComponents[slug]) return toolComponents[slug];
  const entry = registry.find((item) => item.id === slug);
  if (!entry) return null;
  const Fallback = () => <GenericMvpTool entry={entry} />;
  return Fallback;
}

export function listToolSlugs() {
  return Object.keys(toolComponents);
}
