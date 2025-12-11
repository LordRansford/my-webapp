import Link from "next/link";
import Layout from "@/components/Layout";

export default function AboutPage() {
  return (
    <Layout
      title="About - Ransford's Notes"
      description="Learn more about the mission and story behind Ransford's Notes."
    >
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span aria-hidden="true"> / </span>
        <span>About</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">About</p>
        <h1>Sharing my journey from engineer to digital practitioner</h1>
        <p className="lead">
          Ransford&apos;s Notes exists to demystify software architecture, cybersecurity, AI, and data
          engineering. It started as my personal learning journal and grew into a resource for beginners and
          experts. I document what worked, what failed, and how I iterate quickly while keeping systems
          secure and performant.
        </p>
      </header>

      <section className="section">
        <h2>Who I am</h2>
        <p>
          I am Ransford, a senior manager focused on energy system digitalisation. After training as a
          mechanical engineer, I moved into software, building data pipelines and secure digital services.
          These notes capture the challenges and breakthroughs along the way.
        </p>
        <p>
          I enjoy teaching and mentoring. I believe anyone can learn to build robust, secure systems with the
          right guidance. Whether you are a student, an educator, a neurodivergent learner, or an experienced
          engineer, I hope you find insights here that spark your curiosity.
        </p>
      </section>

      <section className="section">
        <h2>Values</h2>
        <ul>
          <li>
            <strong>Clarity</strong>: break down complex topics without skipping the detail.
          </li>
          <li>
            <strong>Hands-on learning</strong>: pair theory with practical code and demos.
          </li>
          <li>
            <strong>Security and performance</strong>: treat both as first-class concerns.
          </li>
          <li>
            <strong>Inclusivity</strong>: design content that is accessible to all learners.
          </li>
        </ul>
      </section>

      <section className="section">
        <h2>Get involved</h2>
        <p>
          Have feedback or want to contribute? Reach out via the contact page. I am always looking for
          collaborators to grow this resource with new tutorials, demos, and case studies.
        </p>
      </section>
    </Layout>
  );
}
