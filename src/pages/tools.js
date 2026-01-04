import Link from "next/link";
import { MarketingPageTemplate } from "@/components/templates/PageTemplates";
import dynamic from "next/dynamic";

const ToolsHubClient = dynamic(() => import("@/components/tools/ToolsHubClient"), { ssr: false });

export default function ToolsPage() {
  return (
    <MarketingPageTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }]}>
      <ToolsHubClient />
    </MarketingPageTemplate>
  );
}
