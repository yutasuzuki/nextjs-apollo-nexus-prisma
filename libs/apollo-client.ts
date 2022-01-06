import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
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

const authLink = setContext(async (_, ctx) => {
  const token = await getAuthToken()

  return {
    headers: {
      ...ctx?.headers,
      token
    }
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
