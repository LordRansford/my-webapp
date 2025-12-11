import Layout from "@/components/Layout";
import GameLayout from "@/components/games/GameLayout";
import DesignTheSystem from "@/components/games/DesignTheSystem";

export default function DesignPage() {
  return (
    <Layout
      title="Design the System - Games"
      description="Reinforce layered design by placing components into the right zones."
    >
      <GameLayout title="Design the System" subtitle="Drag-free placement for quick architecture drills.">
        <DesignTheSystem />
      </GameLayout>
    </Layout>
  );
}
