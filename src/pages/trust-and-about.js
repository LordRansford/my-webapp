import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";
import Link from "next/link";

export default function TrustAndAbout() {
  return (
    <Layout
      title="Trust and Methodology"
      description="How I try to keep this site accurate, safe, and useful."
    >
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Trust and Methodology" }]}>
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Trust and Methodology</h1>
          <p className="lead">
            This page explains how I maintain the notes, how the tools run safely, and the principles behind the content.
            For more about me, please see the <Link href="/about" className="text-blue-600 hover:underline">About page</Link>.
          </p>
        </header>

        <section className="section">
          <h2>Who this site is for</h2>
          <ul className="list">
            <li>People moving from non technical roles into data, cybersecurity, artificial intelligence, or architecture</li>
            <li>Engineers and regulators who need to understand digital concepts well enough to ask good questions</li>
            <li>Students who prefer patient explanations with lots of examples and tools rather than only slides or videos</li>
            <li>Neurodivergent learners who benefit from structured layouts and step by step build up of ideas</li>
          </ul>
        </section>

        <section className="section">
          <h2>How I build and maintain the notes</h2>
          <p>
            Every notes track on this site is built from my own study notes, course materials, textbooks, and official
            documentation from vendors and regulators. I only use sources that I consider reputable and authoritative for
            that topic.
          </p>
          <p>
            I also keep an eye on standards and regulatory changes. When there is a major change that affects one of the
            topics covered on the site, I update the relevant notes as soon as I reasonably can.
          </p>
        </section>

        <section className="section">
          <h2>How the tools work</h2>
          <p>
            The interactive tools on this site run directly in your browser. For programming exercises I use
            browser-based runtimes and sandboxes. For cryptography and security examples I use standard browser
            cryptography primitives or carefully isolated libraries. The aim is to let you experiment safely without
            installing heavy software on your own device.
          </p>
          <p>
            Where a tool represents a security mechanism, I treat it as an educational model rather than a production
            system. You should not paste real secrets, passwords, or confidential data into any of these tools. They are
            here to help you build understanding and intuition first.
          </p>
        </section>

        <section className="section">
          <h2>How I think about bias, fairness, and ethics</h2>
          <p>
            Any site about data and artificial intelligence has to acknowledge that technical choices have ethical
            consequences. Where it is relevant I highlight fairness and bias issues, especially around artificial
            intelligence and data governance. I try to present honest trade offs and to point to regulatory and ethical
            frameworks so that you can explore them further in your own context.
          </p>
        </section>

        <section className="section">
          <h2>Contact and feedback</h2>
          <p>
            If you spot errors, unclear explanations, or have ideas for improvements, I am always happy to hear from
            you. High quality corrections and challenges only make these notes better. Please use the contact details in
            the footer or the security contact if your concern relates to a potential vulnerability.
          </p>
        </section>
      </StaticInfoTemplate>
    </Layout>
  );
}
