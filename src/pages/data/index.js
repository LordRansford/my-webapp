import NotesLayout from "@/components/NotesLayout";
import CourseHeroSection from "@/components/course/CourseHeroSection";
import CoursePathSection from "@/components/course/CoursePathSection";
import CourseResourcesSection from "@/components/course/CourseResourcesSection";
import CourseCPDSection from "@/components/course/CourseCPDSection";
import { Database } from "lucide-react";
import dataCourse from "../../../content/courses/data.json";

const corePath = [
  {
    id: "foundations",
    label: "Foundations",
    title: "Data Foundations",
    summary: "Start with the language, formats, and habits that make data useful across teams.",
    href: "/data/foundations",
    estimatedHours: dataCourse.levels?.find((l) => l.id === "foundations")?.estimatedHours || 8,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Applied Data",
    summary: "Models, pipelines, and analytics that keep data reliable and ready for use.",
    href: "/data/intermediate",
    estimatedHours: dataCourse.levels?.find((l) => l.id === "intermediate")?.estimatedHours || 10,
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Advanced Data Systems",
    summary: "Architecture, streaming, governance, and data products at scale.",
    href: "/data/advanced",
    estimatedHours: dataCourse.levels?.find((l) => l.id === "advanced")?.estimatedHours || 10,
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    summary: "Recap, scenarios, and playful practice for the data course.",
    href: "/data/summary",
    estimatedHours: dataCourse.summaryPage?.estimatedHours || 3,
  },
];

export default function DataHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "path", title: "Core path", depth: 2 },
    { id: "resources", title: "Further practice", depth: 2 },
    { id: "cpd", title: "CPD", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: dataCourse.title || "Data course",
        description:
          dataCourse.description ||
          "A practical course on data from formats and models to governance, architecture, and real-world use.",
        slug: "/data",
        section: "data",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview">
          <CourseHeroSection
            eyebrow="Data course"
            title="Data as a practice"
            description="Follow the core path in order. Foundations, intermediate, advanced, then a short summary with games and practice."
            highlights={[
              { chip: "Foundations", text: "Language, formats, and habits that make data useful." },
              { chip: "Intermediate", text: "Models, pipelines, and analytics for reliability." },
              { chip: "Advanced", text: "Architecture, streaming, and governance at scale." },
              { chip: "Summary", text: "Recap, scenarios, and playful practice." },
            ]}
            primaryAction={{
              label: "Start with Foundations",
              href: "/data/foundations",
            }}
            secondaryActions={[
              { label: "Track CPD", href: "/my-cpd" },
              { label: "Export CPD evidence", href: "/my-cpd/evidence" },
              { label: "Open the labs", href: "/tools" },
            ]}
            icon={<Database size={20} />}
            gradient="indigo"
          />
        </section>

        <section id="path">
          <CoursePathSection
            title="Core path"
            levels={corePath}
          />
        </section>

        <section id="resources">
          <CourseResourcesSection
            title="Further practice"
            subtitle="Hands-on labs and tools to make data concepts concrete."
            toolsHref="/tools"
          />
        </section>

        <CourseCPDSection id="cpd" />
      </div>
    </NotesLayout>
  );
}
