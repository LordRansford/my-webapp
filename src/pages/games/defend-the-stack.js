import Layout from "@/components/Layout";
import GameLayout from "@/components/games/GameLayout";
import DefendTheStack from "@/components/games/DefendTheStack";

export default function DefendPage() {
  return (
    <Layout
      title="Defend the Stack - Games"
      description="Place the right controls on each layer to block common threats."
    >
      <GameLayout
        title="Defend the Stack"
        subtitle="CIA triad meets OSI layers. Place controls and test your coverage."
      >
        <DefendTheStack />
      </GameLayout>
    </Layout>
  );
}
