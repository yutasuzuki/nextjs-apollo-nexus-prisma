import React, { Suspense } from 'react'
import { gql, useQuery } from '@apollo/client'
import { User } from 'nexus-prisma'
import { graphql } from '@apollo/client/react/hoc';

export type ApolloProps = {
  data: {
    users: typeof User[]
  }
}

export const USERS_QUERY = gql`
  query {
    user(id: 1) {
      id
      name
    }
  }
`;

export const withApollo = (components: React.FC) => {
  return graphql<{}, { users: typeof User[] }>(USERS_QUERY)(components)
}

