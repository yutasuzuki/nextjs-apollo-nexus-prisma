import { prisma } from "./client";
import { PrismaClient } from "@prisma/client"
import { NextApiRequest, NextApiResponse } from "next"
import { gql, request, GraphQLClient } from 'graphql-request'
import { EXPIRES_IN, GRAPHQL_ENTRY_POINT } from '../constants'

export interface Context {
  prisma: PrismaClient
  sadmin: string
  user: string
  gqlClient: GraphQLClient
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