import Layout from "@/components/Layout";
import { StaticInfoTemplate } from "@/components/templates/PageTemplates";

export default function PrivacyPage() {
  return (
    <Layout title="Privacy" description="How Ransford's Notes handles your data and respects your privacy.">
      <StaticInfoTemplate breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]}>
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
            The site collects the minimum information needed to deliver pages, run the interactive tools, and support
            learning progress if you choose to create an account.
          </p>
          <ul className="list">
            <li>If you create an account: your email address and basic account timestamps.</li>
            <li>If you turn on CPD tracking consent: coarse learning signals tied to your account.</li>
            <li>For site operation: standard server logs (route, status, timing) without storing magic link tokens.</li>
          </ul>
        </section>

        <section className="section">
          <h2>How information is used</h2>
          <p>
            Information is used to keep the site running, improve the notes and tools, and provide learning progress
            features for signed-in learners. I do not sell your data.
          </p>
        </section>

        <section className="section">
          <h2>Learning analytics (if you consent)</h2>
          <p>
            Learning analytics are designed to help you understand your progress and help me improve course quality.
            They are not used for behaviour manipulation.
          </p>
          <ul className="list">
            <li>Sections started and completed</li>
            <li>Coarse time tracking per section or level</li>
            <li>Quiz attempts and completion</li>
            <li>Tool usage count</li>
          </ul>
          <p>
            We do not track keystrokes, detailed scroll behaviour, or the content you type into tools.
          </p>
          <p>
            You can withdraw consent in your account settings. Collection stops immediately for future events.
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
          <p>
            <strong>Deletion:</strong> if you have an account, you can request deletion from the Account page. This removes your
            stored identity and progress records.
          </p>
        </section>

        <section className="section">
          <h2>Contact</h2>
          <p>
            If you have questions about privacy or how your data is handled, please use the contact details in the
            footer to get in touch.
          </p>
        </section>
      </StaticInfoTemplate>
    </Layout>
  );
}

