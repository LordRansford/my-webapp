import NotesLayout from "@/components/NotesLayout";
import CourseHeroSection from "@/components/course/CourseHeroSection";
import CoursePathSection from "@/components/course/CoursePathSection";
import CourseResourcesSection from "@/components/course/CourseResourcesSection";
import CourseCapstonesSection from "@/components/course/CourseCapstonesSection";
import CourseCPDSection from "@/components/course/CourseCPDSection";
import CourseReferencesSection from "@/components/course/CourseReferencesSection";
import { Network } from "lucide-react";
import digitalisationCourse from "../../../content/courses/digitalisation.json";

const corePath = [
  {
    id: "foundations",
    label: "Foundations",
    title: "Digitalisation Foundations",
    summary: "Language, fundamentals, and the habits that keep delivery grounded in outcomes.",
    href: "/digitalisation/beginner",
    estimatedHours: digitalisationCourse.levels?.find((l) => l.id === "foundations")?.estimatedHours || 8,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    title: "Applied Digitalisation",
    summary: "Operating models, platforms, governance, and realistic roadmaps.",
    href: "/digitalisation/intermediate",
    estimatedHours: digitalisationCourse.levels?.find((l) => l.id === "applied")?.estimatedHours || 10,
  },
  {
    id: "advanced",
    label: "Advanced",
    title: "Digital Strategy and Enterprise Scale",
    summary: "Ecosystems, regulation, funding models, risk, and stewardship.",
    href: "/digitalisation/advanced",
    estimatedHours: digitalisationCourse.levels?.find((l) => l.id === "practice-strategy")?.estimatedHours || 12,
  },
  {
    id: "summary",
    label: "Summary",
    title: "Summary and games",
    summary: "Recap, games, and dashboards to test strategy thinking.",
    href: "/digitalisation/summary",
    estimatedHours: digitalisationCourse.summaryPage?.estimatedHours || 3,
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
  "Official guidance from government digital services and sector regulators",
  "Research and playbooks on digital operating models, platform thinking, and service design",
  "Standards and textbooks on data governance, architecture, and programme delivery",
];

export default function DigitalisationHub() {
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
        title: "Digitalisation Strategy Notes",
        description: "Digitalisation notes with a clear path. Foundations, intermediate, advanced, then a short summary with practice.",
        slug: "/digitalisation",
        section: "digitalisation",
        level: "Overview",
      }}
      headings={headings}
      activeLevelId="overview"
    >
      <div className="space-y-8">
        <section id="overview">
          <CourseHeroSection
            eyebrow="Digitalisation Strategy"
            title="Read, design, and deliver"
            description="Follow the core path in order. Foundations, intermediate, advanced, then a short summary with games and practice."
            highlights={[
              { chip: "Foundations", text: "Language, fundamentals, and habits for grounded delivery." },
              { chip: "Intermediate", text: "Operating models, platforms, and governance." },
              { chip: "Advanced", text: "Ecosystems, regulation, and enterprise scale." },
              { chip: "Summary", text: "Recap, games, and dashboards to test strategy thinking." },
            ]}
            primaryAction={{
              label: "Start with Foundations",
              href: "/digitalisation/beginner",
            }}
            secondaryActions={[
              { label: "Track CPD", href: "/my-cpd" },
              { label: "Export CPD evidence", href: "/my-cpd/evidence" },
              { label: "Open dashboards", href: "/dashboards/digitalisation" },
            ]}
            icon={<Network size={20} />}
            gradient="green"
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
            subtitle="Hands-on labs to make the strategy tangible before the summary."
            dashboardHref="/dashboards/digitalisation"
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

