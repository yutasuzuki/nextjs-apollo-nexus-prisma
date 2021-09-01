import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { parseCookies } from 'nookies'

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const authLink = setContext((_, ctx) => {
  const cookie = parseCookies()
  const headers: { sadmin?: string, user?: string } = {}

  if (cookie.sadmin) {
    headers.sadmin = cookie.sadmin
  }

  if (cookie.user) {
    headers.user = cookie.user
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
