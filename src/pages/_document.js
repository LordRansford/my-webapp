import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <Html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {plausibleDomain && (
          <script
            async
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.tagged-events.js"
          />
        )}
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
