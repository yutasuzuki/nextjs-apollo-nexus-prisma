import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { parseCookies } from 'nookies'
import { getAuth } from 'firebase/auth'

const getAuthToken = () => {
		const auth = getAuth()
    return new Promise((resolve, reject) => {
      if (auth.currentUser !== null) {
        auth.currentUser.getIdToken()
          .then(data => resolve(data))
      } else {
        auth.onAuthStateChanged((user) => {
          if (user) {
            user.getIdToken().then(data => resolve(data));
          } else {
            reject(null);
          }
        });
      }
    });
  }

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
