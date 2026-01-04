import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import AssistantsMount from "./AssistantsMount";
import MusicMount from "./MusicMount";
import AccessibilityMount from "./AccessibilityMount";
import TestingModeBanner from "@/components/TestingModeBanner";
import AppEnvBanner from "@/components/AppEnvBanner";
import AppShell from "@/components/navigation/AppShell";

export const metadata = {
  title: "Ransford's Notes",
  description: "Demystifying data, digitalisation, AI, cybersecurity, and engineering with hands-on tools.",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  themeColor: "#007aff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppEnvBanner />
          <TestingModeBanner />
          <AppShell>{children}</AppShell>
          <AssistantsMount />
          <MusicMount />
          <AccessibilityMount />
        </Providers>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
