import Layout from "@/components/Layout";

export default function PrivacyPage() {
  return (
    <Layout title="Privacy" description="How Ransford's Notes handles your data and respects your privacy.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Privacy</h1>
          <p className="lead">
            This page explains in plain language how this site collects and uses information. I want you to feel
            comfortable using Ransford&apos;s Notes without surprises.
          </p>
        </header>

        <section className="section">
          <h2>What this site collects</h2>
          <p>
            The site collects the minimum information needed to deliver pages, run the interactive tools, and understand
            how the site is used. Typical information includes technical details provided by your browser such as device
            type and browser version, and any information you choose to provide if you sign up for an account or a
            newsletter.
          </p>
        </section>

        <section className="section">
          <h2>How information is used</h2>
          <p>
            Information is used to keep the site running, improve the notes and tools, and keep your account working if
            you choose to create one. I do not sell your data. If third party services are used for analytics or email,
            they are chosen carefully and configured to use only what is necessary.
          </p>
        </section>

        <section className="section">
          <h2>Cookies and similar technologies</h2>
          <p>
            Cookies and similar technologies may be used to remember your preferences, keep you signed in, and measure
            how the site is used. Where required, a simple cookie notice will be shown and you will have the option to
            manage non essential cookies.
          </p>
        </section>

        <section className="section">
          <h2>Your choices</h2>
          <p>
            You can use most of the site without creating an account. If you do create an account, you can ask for your
            account to be removed. If you sign up for a newsletter you can unsubscribe at any time using the link in the
            email.
          </p>
        </section>

        <section className="section">
          <h2>Contact</h2>
          <p>
            If you have questions about privacy or how your data is handled, please use the contact details in the
            footer to get in touch.
          </p>
        </section>
      </main>
    </Layout>
  );
}

