import NotesLayout from "@/components/NotesLayout";
import ToolCard from "@/components/notes/ToolCard";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";
import ConceptMapExplorer from "@/components/ConceptMapExplorer";

export default function AISummary() {
  return (
    <NotesLayout
      meta={{
        title: "AI Notes - Summary",
        description: "A hands on recap that stress tests your intuition with mini tools and prompts.",
        level: "Summary",
        slug: "/ai/summary",
        section: "ai",
        page: 4,
        totalPages: 4,
      }}
    >
      <ProgressBar mode="static" value={100} label="Summary" />

      <h1>AI Notes, Summary</h1>
      <p className="text-base text-gray-800 leading-relaxed">
        At this point we have built a foundation, then tested it against reality, then looked at how modern AI systems
        scale and break. This page is where we make the ideas stick. Not through more reading, but through decisions and
        consequences.
      </p>
      <p className="text-base text-gray-800 leading-relaxed">
        If you feel slightly less confident than when you started, that is a good sign. Real understanding tends to begin
        when certainty fades.
      </p>

      <section data-note-block="true" className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">A quick reset</h2>
        <p>When a model answers, it is not telling you what is true. It is telling you what is statistically plausible given its training and your prompt.</p>
        <p>When a model performs well in testing, it is not proving it will behave well in the real world. It is proving it behaved well in that particular evaluation setup.</p>
        <p>When a system ships, it does not become safer. It becomes more complex.</p>
      </section>

      <hr />

      <h2 className="text-xl font-semibold text-gray-900 mt-8">Concept map</h2>
      <p className="text-sm text-gray-700 mb-2">
        Below is the shortest mental model I know that still feels honest. Tap any node. If one node feels fuzzy, it usually means your next confusion later will come from there.
      </p>
      <ToolCard title="AI mental model map">
        <ConceptMapExplorer
          storageKey="ai_summary_concept_map"
          nodes={[
            { id: "data", title: "Data", body: "Data is measurement. It is never neutral. It always carries the shape of how it was collected, what was missed, and what people assumed." },
            { id: "representation", title: "Representation", body: "Models do not understand meaning. They compress patterns into representations. The representation becomes the world the model lives inside." },
            { id: "prediction", title: "Prediction", body: "A prediction is a number or a distribution. It is not a decision and it is not an explanation." },
            { id: "decision", title: "Decision", body: "A decision is where thresholds, policies, and costs appear. This is where humans quietly choose which errors are acceptable." },
            { id: "consequence", title: "Consequence", body: "Consequences arrive in operations. People trust systems until they fail them. Then they ignore them even when they are right." },
            { id: "monitoring", title: "Monitoring", body: "If you cannot see failure, you cannot manage it. Monitoring is the price of deployment, not a nice extra." },
          ]}
        />
      </ToolCard>

      <PageNav prevHref="/ai/advanced" prevLabel="Advanced" nextHref="/cybersecurity/beginner" nextLabel="Cybersecurity Beginner" showTop showBottom />
    </NotesLayout>
  );
}
