import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENTRY_POINT } from '../constants'
export const gqlClient = new GraphQLClient(GRAPHQL_ENTRY_POINT)