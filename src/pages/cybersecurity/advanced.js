import Layout from "@/components/Layout";
import Link from "next/link";

export default function CybersecurityAdvanced() {
  return (
    <Layout
      title="Cybersecurity Notes — Advanced"
      description="Advanced cybersecurity notes will be published here."
    >
      <header className="page-header">
        <p className="eyebrow">Cybersecurity Notes</p>
        <h1>Advanced level</h1>
        <p className="lead">
          Advanced topics, including post-quantum cryptography, zero trust, and emerging practices, will be published
          here soon.
        </p>
        <Link href="/cybersecurity" className="text-link">
          Back to cybersecurity notes hub
        </Link>
      </header>
    </Layout>
  );
}
