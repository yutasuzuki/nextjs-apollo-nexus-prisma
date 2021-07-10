import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { Sadmin } from 'nexus-prisma'
import { graphql } from '@apollo/client/react/hoc'

export type SadminProps = {
  data: {
    sadmin: typeof Sadmin
  }
}


export const SADMIN_QUERY = gql`
  query {
    sadmin {
      id
      uid
      email
    }
  }
`;

export const withSadmin = (Components: React.FC) => {
  return graphql<{}, { sadmin: typeof Sadmin }>(SADMIN_QUERY)(Components)
}
