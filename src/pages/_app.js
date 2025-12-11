import "@/styles/globals.css";
import { Manrope, Space_Grotesk } from "next/font/google";

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
      <Component {...pageProps} />
    </div>
  );
}
