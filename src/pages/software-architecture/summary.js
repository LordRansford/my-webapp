import dynamic from "next/dynamic";
import { useMemo } from "react";
import NotesLayout from "@/components/notes/Layout";
import { MDXRenderer } from "@/components/notes/MDXRenderer";
import { loadNote } from "@/lib/content/loadNote";
import ToolCard from "@/components/learn/ToolCard";
import Callout from "@/components/notes/Callout";
import GlossaryTip from "@/components/notes/GlossaryTip";
import QuizBlock from "@/components/notes/QuizBlock";
import ProgressBar from "@/components/notes/ProgressBar";
import PageNav from "@/components/notes/PageNav";

const ArchitectureDashboard = dynamic(() => import("@/components/dashboards/ArchitectureDashboard"), { ssr: false });
const DecisionDashboard = dynamic(() => import("@/components/dashboards/DecisionDashboard"), { ssr: false });
const DigitalisationDashboard = dynamic(() => import("@/components/dashboards/DigitalisationDashboard"), { ssr: false });
const ArchConceptMatchGame = dynamic(() => import("@/components/games/softwareArchitecture/ArchConceptMatchGame"), { ssr: false });
const ArchStyleSorterGame = dynamic(() => import("@/components/games/softwareArchitecture/ArchStyleSorterGame"), { ssr: false });
const QualityTradeoffGame = dynamic(() => import("@/components/games/softwareArchitecture/QualityTradeoffGame"), { ssr: false });
const RequestFlowGame = dynamic(() => import("@/components/games/softwareArchitecture/RequestFlowGame"), { ssr: false });
const ArchQuickFireQuizGame = dynamic(() => import("@/components/games/softwareArchitecture/ArchQuickFireQuizGame"), { ssr: false });

export default function Page({ source, headings }) {
  const mdxComponents = useMemo(
    () => ({
      ToolCard,
      Callout,
      GlossaryTip,
      QuizBlock,
      ProgressBar,
      PageNav,
      ArchitectureDashboard,
      DecisionDashboard,
      DigitalisationDashboard,
      ArchConceptMatchGame,
      ArchStyleSorterGame,
      QualityTradeoffGame,
      RequestFlowGame,
      ArchQuickFireQuizGame,
    }),
    []
  );

  return (
    <NotesLayout
      meta={{
        title: "Software Architecture Notes - Summary",
        description: "Consolidation of architecture concepts with games, dashboards, and reflection.",
        level: "Summary",
        slug: "/software-architecture/summary",
        section: "architecture",
        page: 4,
        totalPages: 4,
      }}
      headings={headings}
    >
      <MDXRenderer source={source} components={mdxComponents} />
    </NotesLayout>
  );
}

export async function getStaticProps() {
  const { source, headings } = await loadNote("software-architecture/summary.mdx");
  return {
    props: {
      source,
      headings,
    },
  };
}
