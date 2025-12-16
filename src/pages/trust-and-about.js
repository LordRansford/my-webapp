import Layout from "@/components/Layout";

export default function TrustAndAbout() {
  return (
    <Layout
      title="Trust and About Ransford"
      description="Who I am, why I built Ransford's Notes, and how I try to keep it accurate, safe, and useful."
    >
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Trust and About Ransford</h1>
          <p className="lead">
            I built Ransford&apos;s Notes so that people who feel lost in data, cybersecurity, artificial
            intelligence, and digitalisation can have a place that explains things slowly and practically.
            This page explains who I am, how I work, and how I try to keep this site trustworthy.
          </p>
        </header>

        <section className="section">
          <h2>Who I am</h2>
          <p>
            My name is Ransford Chung Amponsah. I work in the United Kingdom energy sector in data and digitalisation.
            My background is in mechanical engineering and I moved into digital work after realising how central
            software, data, and security had become to real world systems like energy networks.
          </p>
          <p>
            A turning point for me was a visit to Octopus Energy in London where I saw how seriously they treated their
            digital platform and data. After that visit I moved into a data and digitalisation role and began a long
            journey of self study in cybersecurity, architecture, and artificial intelligence.
          </p>
          <p>
            I have taken a range of professional courses and exams in cybersecurity, cloud, and artificial
            intelligence and I keep studying. These notes are my way of sharing what I have learnt with people who are
            on a similar path, especially those who do not come from a computer science background.
          </p>
        </section>

        <section className="section">
          <h2>Why this site exists</h2>
          <p>
            When I started learning, I found that most resources assumed a strong technical background or moved too
            fast. I also noticed that many people in policy, regulation, and engineering are asked to make decisions
            about digital systems without ever getting a calm explanation of what is going on under the surface.
          </p>
          <p>
            Ransford&apos;s Notes is my attempt to fix a small part of that problem. I want this site to feel like you are
            sitting with me and we are working through the ideas step by step, from the ground up, with real examples
            and tools you can try in your browser.
          </p>
        </section>

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
      </main>
    </Layout>
  );
}
