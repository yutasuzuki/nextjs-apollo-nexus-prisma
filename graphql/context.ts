import { prisma } from "./client";
import { PrismaClient } from "@prisma/client"
import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENTRY_POINT } from '../constants'

export interface Context {
  prisma: PrismaClient
  gqlClient: GraphQLClient
  token: string
}

export const context = ({ req }) => {
  const token = req.headers.token
  const gqlClient = new GraphQLClient(GRAPHQL_ENTRY_POINT, { headers: { token } })
  return {
    prisma,
    gqlClient,
    token
  };
}