import NotesLayout from "@/components/NotesLayout";
import CourseHeroSection from "@/components/course/CourseHeroSection";
import CoursePathSection from "@/components/course/CoursePathSection";
import CourseResourcesSection from "@/components/course/CourseResourcesSection";
import CourseCapstonesSection from "@/components/course/CourseCapstonesSection";
import CourseCPDSection from "@/components/course/CourseCPDSection";
import CourseReferencesSection from "@/components/course/CourseReferencesSection";
import { Layers } from "lucide-react";
import softwareArchitectureCourse from "../../../content/courses/software-architecture.json";

const corePath = [
  {
    id: "foundations",
    label: "Foundations",
    title: "Architecture Foundations",
    summary: "Systems, boundaries, responsibilities, and diagrams you can explain with confidence.",
    href: "/software-architecture/beginner",
    estimatedHours: softwareArchitectureCourse.levels?.find((l) => l.id === "foundations")?.estimatedHours || 10,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Applied Architecture",
    summary: "Decomposition, styles, quality attributes, and decision making that stays practical.",
    href: "/software-architecture/intermediate",
    estimatedHours: softwareArchitectureCourse.levels?.find((l) => l.id === "applied")?.estimatedHours || 12,
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Digital and Cloud Scale Architecture",
    summary: "Event driven systems, CQRS, integration patterns, observability and digitalisation strategy across whole organisations.",
    href: "/software-architecture/advanced",
    estimatedHours: softwareArchitectureCourse.levels?.find((l) => l.id === "practice-strategy")?.estimatedHours || 14,
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    summary: "Recap, games, dashboards, and reflection to consolidate architecture thinking.",
    href: "/software-architecture/summary",
    estimatedHours: softwareArchitectureCourse.summaryPage?.estimatedHours || 3,
  },
];

const capstones = [
  {
    id: "capstone-booktrack",
    title: "BookTrack capstone journey",
    summary: "A full journey that connects architecture, cybersecurity, digitalisation and AI using the BookTrack example.",
    href: "/notes/capstone/booktrack",
  },
  {
    id: "capstone-gridlens",
    title: "GridLens capstone journey",
    summary: "A full journey that connects architecture, CIM based network data, cybersecurity, digitalisation and AI using GridLens.",
    href: "/notes/capstone/gridlens",
  },
];

const references = [
  "Architecture handbooks and open course materials from recognised universities and industry leaders",
  "Documentation and guidance on cloud architecture, reliability, and security from major vendors",
  "Standards and playbooks on software design, observability, and operational excellence",
];

export default function ArchitectureHub() {
  const headings = [
    { id: "overview", title: "Overview", depth: 2 },
    { id: "path", title: "Core path", depth: 2 },
    { id: "practice", title: "Further practice", depth: 2 },
    { id: "capstones", title: "Capstones", depth: 2 },
    { id: "cpd", title: "CPD", depth: 2 },
    { id: "references", title: "References", depth: 2 },
  ];

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes",
        description: "Follow the core path from foundations to summary, then use practice labs and capstones to test your thinking.",
        slug: "/software-architecture",
        section: "architecture",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview">
          <CourseHeroSection
            eyebrow="Software Architecture Notes"
            title="Read, design, and steward systems"
            description="Follow the core path in order. Foundations, intermediate, advanced, then a short summary with games and practice."
            highlights={[
              { chip: "Foundations", text: "Systems, boundaries, responsibilities, and diagrams." },
              { chip: "Intermediate", text: "Decomposition, styles, and quality attributes." },
              { chip: "Advanced", text: "Platforms, resilience, governance, and change." },
              { chip: "Summary", text: "Recap, games, dashboards, and reflection." },
            ]}
            primaryAction={{
              label: "Start with Foundations",
              href: "/software-architecture/beginner",
            }}
            secondaryActions={[
              { label: "Track CPD", href: "/my-cpd" },
              { label: "Export CPD evidence", href: "/my-cpd/evidence" },
              { label: "Open dashboards", href: "/dashboards/architecture" },
            ]}
            icon={<Layers size={20} />}
            gradient="purple"
          />
        </section>

        <section id="path">
          <CoursePathSection
            title="Core path"
            levels={corePath}
          />
        </section>

        <section id="practice">
          <CourseResourcesSection
            title="Further practice"
            subtitle="Dashboards and labs to make latency, availability, and trade-offs concrete."
            dashboardHref="/dashboards/architecture"
          />
        </section>

        <section id="capstones">
          <CourseCapstonesSection
            title="Capstones"
            capstones={capstones}
          />
        </section>

        <section id="cpd">
          <CourseCPDSection />
        </section>

        <section id="references">
          <CourseReferencesSection references={references} />
        </section>
      </div>
    </NotesLayout>
  );
}

