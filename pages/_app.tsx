import Head from 'next/head'
import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import firebase from 'libs/firebase'
import { client } from 'libs/apollo-client'
import 'public/css/reset.css'
import 'public/css/default.css'

firebase()

function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <meta name="robots" content="noindex" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App