import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="dns-prefetch" href="https://api.openrouter.ai" />
        <link rel="dns-prefetch" href="https://openrouter.ai" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 