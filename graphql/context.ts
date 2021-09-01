import { prisma } from "./client";
import { PrismaClient } from "@prisma/client"
import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENTRY_POINT } from '../constants'

export interface Context {
  prisma: PrismaClient
  gqlClient: GraphQLClient
  sadmin: string
  user: string
}

export const context = ({ req }) => {
  const sadmin = req.headers.sadmin
  const user = req.headers.user
  const gqlClient = new GraphQLClient(GRAPHQL_ENTRY_POINT, { headers: { user, sadmin } })
  return {
    prisma,
    sadmin,
    user,
    gqlClient
  };
}