import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { Manrope, Space_Grotesk, JetBrains_Mono, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { NotesProvider } from "@/components/notes/NotesProvider";
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { MusicProvider } from "@/components/spotify/MusicProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import dynamic from "next/dynamic";

const AssistantShell = dynamic(() => import("@/components/assistants/AssistantShell"), { ssr: false });

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
  weight: ["400", "500", "600", "700"],
});

export default function App({ Component, pageProps }) {
  const isVercel = process.env.VERCEL === "1";

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable} ${inter.variable}`}>
      <AuthSessionProvider>
        <NotesProvider>
          <MusicProvider>
            <AccessibilityProvider>
              <Component {...pageProps} />
              <AssistantShell />
            </AccessibilityProvider>
          </MusicProvider>
        </NotesProvider>
      </AuthSessionProvider>
      {isVercel && (
        <>
          <SpeedInsights />
          <Analytics />
        </>
      )}
    </div>
  );
}
