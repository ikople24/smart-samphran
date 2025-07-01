import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" data-theme="light">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#0d47a1" />

        {/* Social Sharing Meta Tags */}
        <meta property="og:title" content="Smart-Namphare" />
        <meta property="og:description" content="ระบบร้องทุกข์-ร้องเรียน OpenDataCity" />
        <meta property="og:url" content="https://smart-namphare.app" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
