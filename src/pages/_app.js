import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { NotesProvider } from "@/components/notes/NotesProvider";
import AuthSessionProvider from "@/components/auth/SessionProvider";
import { MusicProvider } from "@/components/spotify/MusicProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import dynamic from "next/dynamic";

const AssistantShell = dynamic(() => import("@/components/assistants/AssistantShell"), { ssr: false });

export default function App({ Component, pageProps }) {
  const isVercel = process.env.VERCEL === "1";

  return (
    <div>
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
