import Link from "next/link";
import Layout from "@/components/Layout";
import Tools from "@/components/Tools";

export default function ToolsPage() {
  return (
    <Layout
      title="Tools - Ransford's Notes"
      description="Browser-based sandboxes for Python, cryptography, and AI with guided prompts."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>Labs</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Interactive tools</p>
        <h1>Try the ideas in your browser</h1>
        <p className="lead">
          Reading is helpful. Trying it yourself makes it stick. Each tool pairs with notes so you can run
          small experiments without installing anything.
        </p>
      </header>

      <section className="section">
        <h2>How to use the tools</h2>
        <ol>
          <li>Open the sandbox linked from the note you are reading.</li>
          <li>Follow the prompt and observe the result before changing anything.</li>
          <li>Make one change at a time and predict the outcome.</li>
          <li>Note anything surprising and revisit the explanation.</li>
        </ol>
        <p>
          Everything runs locally in your browser. No code you type is sent to my servers. Data stays on your
          device.
        </p>
      </section>

      <Tools />
    </Layout>
  );
}
