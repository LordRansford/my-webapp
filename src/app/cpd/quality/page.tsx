import Layout from "@/components/Layout";
import CPDDisclaimer from "@/components/cpd/CPDDisclaimer";

export default function QualityPage() {
  return (
    <Layout title="Quality Assurance" description="Course design principles, continuous improvement, and quality controls.">
      <main className="page">
        <header className="page-header">
          <p className="eyebrow">Ransford&apos;s Notes</p>
          <h1>Quality Assurance</h1>
          <p className="lead">
            This platform is designed to align with recognised CPD frameworks. Our quality processes ensure consistent,
            reliable learning experiences.
          </p>
        </header>

        <CPDDisclaimer className="mb-8" />

        <section className="section">
          <h2>Course Design Principles</h2>
          <ul className="list">
            <li>
              <strong>Clear learning outcomes:</strong> Each course and module defines specific, measurable outcomes
              aligned with professional competency domains.
            </li>
            <li>
              <strong>Progressive complexity:</strong> Content builds from foundations through intermediate to advanced
              levels, with clear prerequisites.
            </li>
            <li>
              <strong>Practical application:</strong> Learning is reinforced through hands-on tools, templates, and
              exercises that mirror real-world scenarios.
            </li>
            <li>
              <strong>Evidence-based:</strong> Content is grounded in established standards, frameworks, and best
              practices from recognised bodies.
            </li>
            <li>
              <strong>Accessibility:</strong> Materials are designed to be usable by learners with diverse needs,
              following WCAG guidelines.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Continuous Improvement Process</h2>
          <p>We maintain quality through:</p>
          <ul className="list">
            <li>
              <strong>Version control:</strong> All courses, templates, and assessments are versioned. Changes are
              tracked in an audit log.
            </li>
            <li>
              <strong>Learner feedback:</strong> We collect and review feedback to identify areas for improvement.
            </li>
            <li>
              <strong>Content review cycles:</strong> Regular reviews ensure content remains current and accurate.
            </li>
            <li>
              <strong>Assessment validation:</strong> Assessment methods and integrity controls are reviewed to ensure
              they measure intended learning outcomes.
            </li>
          </ul>
        </section>

        <section className="section">
          <h2>Versioning and Change Logs</h2>
          <p>
            All course materials, templates, and assessments include version numbers. Significant changes are documented
            in change logs accessible to learners and accreditors.
          </p>
          <p>
            Version history is maintained in our audit log system, providing full traceability of changes to learning
            outcomes, assessment methods, and content structure.
          </p>
        </section>

        <section className="section">
          <h2>Learner Feedback Loop</h2>
          <p>
            Learner feedback is actively collected and reviewed. This includes feedback on content clarity, practical
            utility, accessibility, and alignment with professional needs.
          </p>
          <p>
            Feedback informs updates to course materials, template improvements, and the introduction of new learning
            resources.
          </p>
        </section>

        <section className="section">
          <h2>Content Ownership Statement</h2>
          <p>
            All course content, templates, and learning materials are authored by Ransford Amponsah. Content draws on
            established frameworks, standards, and best practices, which are appropriately referenced.
          </p>
          <p>
            Templates and tools are provided under clear usage terms. Commercial use requires attribution or permission
            as specified in our template download policies.
          </p>
        </section>
      </main>
    </Layout>
  );
}
