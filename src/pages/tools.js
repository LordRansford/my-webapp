import Link from "next/link";
import Layout from "@/components/Layout";
import Tools from "@/components/Tools";

export default function ToolsPage() {
  return (
    <Layout
      title="Labs - Ransford's Notes"
      description="Browser-based Python, RSA, and cryptography demos that never leave your device."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Labs</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Interactive labs</p>
        <h1>Ship ideas faster by testing them in your browser.</h1>
        <p className="lead">
          Lightweight sandboxes to validate ideas quickly: a Python playground compiled to WebAssembly, an
          RSA key generator powered by Web Crypto, and an entropy check for secure randomness. Everything
          runs locally on your device for speed and safety.
        </p>
      </header>

      <Tools />
    </Layout>
  );
}
