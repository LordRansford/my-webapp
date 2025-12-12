import Layout from "@/components/Layout";
import Link from "next/link";

export default function CybersecuritySummary() {
  return (
    <Layout
      title="Cybersecurity Notes — Summary and Game"
      description="Summary and interactive practice for cybersecurity notes will be published here."
    >
      <header className="page-header">
        <p className="eyebrow">Cybersecurity Notes</p>
        <h1>Summary and game</h1>
        <p className="lead">
          A concise recap plus an interactive game to test your understanding will be added here.
        </p>
        <Link href="/cybersecurity" className="text-link">
          Back to cybersecurity notes hub
        </Link>
      </header>
    </Layout>
  );
}
