import NotesLayout from "@/components/NotesLayout";
import dynamic from "next/dynamic";

const DashboardsHubClient = dynamic(() => import("@/components/dashboards/DashboardsHubClient"), { ssr: false });

export const getServerSideProps = async () => {
  return { props: {} };
};

export default function DashboardsLanding() {
  return (
    <NotesLayout
      meta={{
        title: "Further practice",
        description: "Further practice resources linked from courses.",
        level: "Further practice",
        slug: "/dashboards",
      }}
    >
      <DashboardsHubClient />
    </NotesLayout>
  );
}
