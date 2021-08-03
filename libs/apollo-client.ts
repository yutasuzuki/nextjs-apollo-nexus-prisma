import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, ctx) => {
  const headers: { sadmin?: string, user?: string } = {}

  if (localStorage.getItem('sadmin')) {
    headers.sadmin = localStorage.getItem('sadmin')
  }

  if (localStorage.getItem('user')) {
    headers.user = localStorage.getItem('user')
  }

  return {
    headers: {
      ...ctx?.headers,
      ...headers
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
