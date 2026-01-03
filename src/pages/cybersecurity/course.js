import NotesLayout from "@/components/NotesLayout";
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

export async function getServerSideProps() {
  return {
    props: {
      course: loadCyberCourse(),
    },
  };
}

export default function CybersecurityCoursePage({ course }) {
  const levels = course?.levels || [];
  const headings = [
    { id: "overview", title: "Course overview", depth: 2 },
    { id: "levels", title: "Levels", depth: 2 },
    { id: "how-to-use", title: "How to use this course", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: "Cybersecurity Course Overview",
        description: "Foundations, Applied, Practice and Strategy with labs and tools for each level.",
        slug: "/cybersecurity/course",
        section: "cybersecurity",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview" className="space-y-3">
          <nav className="breadcrumb">
            <Link href="/cybersecurity">Cybersecurity</Link>
            <span aria-hidden="true"> / </span>
            <span>Course overview</span>
          </nav>
          <p className="eyebrow">Course overview</p>
          <h1>Cybersecurity Course</h1>
          <p className="lead">
            Three levels mapped against common security frameworks. Friendly, opinionated, and hands-on with browser-first labs.
          </p>
          <p>
            This is not an exam cram. It is a CPD oriented structure that teaches judgement first, then tools. Use the levels in order or drop into the labs when you need a refresher.
          </p>
        </section>

        <section id="levels" className="space-y-4">
          <h2>Levels</h2>
          <div className="course-grid">
            {levels.map((level) => (
              <Link key={level.id} href={level.route} className="course-card">
                <div className="course-card__meta">
                  <span className="chip chip--accent">{level.title}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900">{level.title}</h3>
                <p className="text-base text-slate-800">{course?.description}</p>
                <div className="mt-3 text-base font-semibold text-slate-900">Learning outcomes</div>
                <ul className="text-base text-slate-800 space-y-1">
                  {level.learning_outcomes?.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="course-card__footer">
                  <span className="text-sm text-slate-700">Open level</span>
                  <span aria-hidden="true">{">"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="how-to-use" className="space-y-3">
          <h2>How to use this course</h2>
          <ul className="list-disc space-y-2 pl-5 text-base text-slate-800">
            <li>Start with Foundations to get the shared language for data, networks, attackers, and controls.</li>
            <li>Use the labs directly in your browser where possible and only enter safe, non sensitive example data.</li>
            <li>Use Applied to practise threat modelling and logging. Use Practice and Strategy to join architecture, operations, and governance thinking.</li>
            <li>Remember: this is designed to be compatible with recognised frameworks, but it is not endorsed by any certification body.</li>
          </ul>
        </section>
      </div>
    </NotesLayout>
  );
}
