import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import firebase from '../libs/firebase'
import { client } from '../libs/apollo-client'

firebase()

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name="robots" content="noindex" />
        {/* {process.env.SAUNATIME_PASS_ENV !== 'production' && <meta name="robots" content="noindex" />} */}
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="stylesheet" href="/css/reset.css" />
        <link rel="stylesheet" href="/css/default.css" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App