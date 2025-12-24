import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { Manrope, Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Providers } from "./providers";
import AssistantsMount from "./AssistantsMount";
import TestingModeBanner from "@/components/TestingModeBanner";
import AppEnvBanner from "@/components/AppEnvBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  themeColor: "#007aff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <AppEnvBanner />
          <TestingModeBanner />
          <div className="app-shell">
            <Header />
            <main className="page-shell" role="main">
              {children}
            </main>
            <Footer />
          </div>
          <AssistantsMount />
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
