import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, ctx) => {
  const token = localStorage.getItem('token')
  const sadmin = localStorage.getItem('sadmin')

  return {
    headers: {
      ...ctx?.headers,
      authorization: token ? `Bearer ${token}` : "",
      sadmin
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
