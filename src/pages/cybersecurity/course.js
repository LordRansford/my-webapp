import Layout from "@/components/Layout";
import Link from "next/link";
import fs from "fs";
import path from "path";

function loadCyberCourse() {
  const filePath = path.join(process.cwd(), "content", "courses", "cybersecurity.json");
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

export async function getStaticProps() {
  return {
    props: {
      course: loadCyberCourse(),
    },
  };
}

export default function CybersecurityCoursePage({ course }) {
  const levels = course?.levels || [];

  return (
    <Layout title="Cybersecurity Course Overview" description="Foundations, Applied, Practice and Strategy with labs and tools for each level.">
      <nav className="breadcrumb">
        <Link href="/cybersecurity">Cybersecurity</Link>
        <span aria-hidden="true"> / </span>
        <span>Course overview</span>
      </nav>

      <header className="page-header">
        <p className="eyebrow">Course overview</p>
        <h1>Cybersecurity Course</h1>
        <p className="lead">
          Three levels aligned with CISSP domains, NIST CSF 2.0 and Cyber Essentials. Friendly, opinionated, and hands-on with browser-only labs.
        </p>
        <p>
          This is not an exam cram. It is a CPD-friendly structure that teaches judgement first, then tools. Use the levels in order or drop into the labs when you need a refresher.
        </p>
      </header>

      <section className="stack" style={{ gap: "1.5rem" }}>
        {levels.map((level) => (
          <div key={level.id} className="card stack" style={{ gap: "0.4rem" }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="eyebrow m-0">{level.title}</p>
                <h2 className="m-0 text-lg font-semibold text-slate-900">{level.title}</h2>
                <p className="text-sm text-slate-700">Estimated hours: {level.estimated_hours}</p>
              </div>
              <Link className="button primary" href={level.route}>
                Open level
              </Link>
            </div>
            <p className="text-sm text-slate-800">{course?.description}</p>
            <div>
              <p className="text-sm font-semibold text-slate-900">Learning outcomes</p>
              <ul className="text-sm text-slate-800 space-y-1">
                {level.learning_outcomes?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">How to use this course</h2>
        <ul className="text-sm text-slate-800 space-y-1">
          <li>Start with Foundations to get the shared language for data, networks, attackers, and controls.</li>
          <li>Apply the labs directly in your browser—no installs, no secrets, no telemetry.</li>
          <li>Use Applied to practise threat modelling and logging; use Practice &amp; Strategy to map work to CISSP domains and NIST CSF.</li>
          <li>Remember: this mirrors recognised frameworks but is not an official exam prep course.</li>
        </ul>
      </section>
    </Layout>
  );
}
