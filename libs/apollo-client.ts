import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, ctx) => {
  console.log('ctx', ctx)
  const token = localStorage.getItem('token')

  console.log('token', token)

  return {
    headers: {
      ...ctx?.headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
