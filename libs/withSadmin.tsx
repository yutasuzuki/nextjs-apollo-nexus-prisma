import React from 'react'
import { Sadmin } from '@prisma/client'
import { gql, useQuery } from '@apollo/client'
import { graphql, DataProps } from '@apollo/client/react/hoc'

export interface SadminProps extends DataProps<{
  sadmin: Sadmin
}> {}

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
  return graphql<{}, { sadmin: Sadmin }>(SADMIN_QUERY)(Components)
}
