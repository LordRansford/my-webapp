import Layout from "@/components/Layout";
import GameLayout from "@/components/games/GameLayout";
import TinyModel from "@/components/games/TinyModel";

export default function TinyModelPage() {
  return (
    <Layout title="Train a Tiny Model - Games" description="Train a browser-only classifier with your own labels.">
      <GameLayout
        title="Train a Tiny Model"
        subtitle="Label points, train with TensorFlow.js, and see decision boundaries update live."
      >
        <TinyModel />
      </GameLayout>
    </Layout>
  );
}
