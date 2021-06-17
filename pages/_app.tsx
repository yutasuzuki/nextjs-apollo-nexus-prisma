import { ApolloProvider } from '@apollo/client'
import { AppProps } from 'next/app'
import { client } from '../libs/apollo-client'


function App({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default App;