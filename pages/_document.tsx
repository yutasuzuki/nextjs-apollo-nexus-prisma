import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta name="robots" content="noindex" />
          {/* {process.env.SAUNATIME_PASS_ENV !== 'production' && <meta name="robots" content="noindex" />} */}
          <link rel="stylesheet" href="/css/reset.css" />
          <link rel="stylesheet" href="/css/default.css" />
          <script />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}