import "@/styles/globals.css";
import "katex/dist/katex.min.css";
import { Manrope, Space_Grotesk } from "next/font/google";
import { NotesProvider } from "@/components/notes/NotesProvider";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${display.variable} ${body.variable}`}>
      <NotesProvider>
        <Component {...pageProps} />
      </NotesProvider>
    </div>
  );
}
