import Layout from "@/components/Layout";
import Link from "next/link";

export default function CybersecurityIntermediate() {
  return (
    <Layout
      title="Cybersecurity Notes — Intermediate"
      description="Intermediate cybersecurity notes will be published here."
    >
      <header className="page-header">
        <p className="eyebrow">Cybersecurity Notes</p>
        <h1>Intermediate level</h1>
        <p className="lead">
          The intermediate notes will expand on modern algorithms, protocols, and applied security patterns. They are
          being prepared and will be added soon.
        </p>
        <Link href="/cybersecurity" className="text-link">
          Back to cybersecurity notes hub
        </Link>
      </header>
    </Layout>
  );
}
