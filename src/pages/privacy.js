import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function PrivacyPage() {
  return (
    <StaticInfoTemplate
      title="Privacy"
      description="How we handle data across the platform."
      lastUpdated="3 January 2026"
    >
      <div className="prose prose-slate max-w-none">
        <p>
          This page is intentionally concise in the app. For the full policy and operational detail, see{" "}
          <a href="/docs/privacy/data-handling" className="underline">
            docs/privacy/data-handling.md
          </a>
          .
        </p>
        <h2>Summary</h2>
        <ul>
          <li>We aim to store the minimum data required to run the service.</li>
          <li>AI Studio projects are local-first by default (stored on your device).</li>
          <li>Compute runs may be metered; receipts show what happened and what it cost.</li>
        </ul>
      </div>
    </StaticInfoTemplate>
  );
}

