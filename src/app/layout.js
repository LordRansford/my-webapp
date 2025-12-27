import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { Manrope, Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Providers } from "./providers";
import AssistantsMount from "./AssistantsMount";
import MusicMount from "./MusicMount";
import AccessibilityMount from "./AccessibilityMount";
import TestingModeBanner from "@/components/TestingModeBanner";
import AppEnvBanner from "@/components/AppEnvBanner";
import AppShell from "@/components/navigation/AppShell";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

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
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${inter.variable}`}>
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
