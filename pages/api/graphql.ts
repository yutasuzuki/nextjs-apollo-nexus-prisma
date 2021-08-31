import { ApolloServer } from 'apollo-server-micro'
import { context } from '../../graphql/context'
import { schema } from '../../graphql/schema'

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ schema, context })
const startServer = apolloServer.start()
export default async function handler(req, res) {
  await startServer
  const server = await apolloServer.createHandler({
    path: "/api/graphql",
  })
  server(req, res)
}