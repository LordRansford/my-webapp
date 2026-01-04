import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function TermsPage() {
  return (
    <StaticInfoTemplate
      title="Terms"
      description="Basic terms for using the platform."
      lastUpdated="3 January 2026"
    >
      <div className="prose prose-slate max-w-none">
        <p>
          This page provides a short, in-app summary. Detailed legal terms can be expanded in the docs as needed.
        </p>
        <h2>Summary</h2>
        <ul>
          <li>Use the platform responsibly and lawfully.</li>
          <li>Do not submit sensitive personal data into demos and tools.</li>
          <li>Compute runs may be metered; you are responsible for runs you initiate.</li>
        </ul>
      </div>
    </StaticInfoTemplate>
  );
}

