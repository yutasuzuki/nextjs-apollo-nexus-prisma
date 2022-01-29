import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from "@apollo/client/link/error"
import { getAuth } from 'firebase/auth'

type GetAuthToken = () => Promise<string>
const getAuthToken: GetAuthToken = () => {
  return new Promise((resolve, reject) => {
    if (getAuth().currentUser !== null) {
      getAuth().currentUser.getIdToken()
        .then(data => resolve(data))
    } else {
      getAuth().onAuthStateChanged((user) => {
        if (user) {
          user.getIdToken().then(data => resolve(data))
        } else {
          reject(null);
        }
      })
    }
  })
}

const httpLink = createHttpLink({
  uri: '/api/graphql',
})

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(`[GraphQL エラー]: Message: ${message}, Location: ${locations}, Path: ${path}`)
    )
  }
  if (networkError) {
    console.log(`[ネットワークエラー]: ${networkError}`)
  }
})

let token: string = null
const authLink = setContext((_, ctx) => {
  if (token) return {
    headers: {
      ...ctx.headers,
      token
    }
  }
  return new Promise((resolve) => {
    getAuthToken().then((userToken) => {
      token = userToken
      resolve({
        headers: {
          ...ctx.headers,
          token
        }
      })
    }).catch(() => {
      token = null
      resolve({
        headers: {
          ...ctx.headers,
          token: null
        }
      })
    })
  })
})

export const client = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
})
