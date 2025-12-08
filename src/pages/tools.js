import Head from "next/head";
import Link from "next/link";
import Tools from "@/components/Tools";

export default function ToolsPage() {
  return (
    <>
      <Head>
        <title>Tools · Ransford&apos;s Notes</title>
        <meta
          name="description"
          content="Browser-based Python and Web Crypto demos that never leave your device."
        />
      </Head>

      <main className="page-shell">
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true"> / </span>
          <span>Tools</span>
        </nav>

        <header className="page-header">
          <p className="eyebrow">Interactive tools</p>
          <h1>Ship ideas faster by testing them in your browser.</h1>
          <p>
            I keep lightweight sandboxes here so I can validate ideas quickly:
            a Python playground compiled to WebAssembly and a Web Crypto demo
            for producing secure randomness. Everything runs locally on your
            device for speed and safety.
          </p>
        </header>

        <Tools />
      </main>
    </>
  );
}
