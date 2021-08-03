import React from 'react'
import { gql, useQuery, BaseQueryOptions } from '@apollo/client'
import { User } from 'nexus-prisma'
import { USER_QUERY } from 'graphql/queries'
import { graphql, DataProps } from '@apollo/client/react/hoc'

export interface MypageProps extends DataProps<{
  user: typeof User
}> {}

export const withMypage = (Components: React.FC, opt?: BaseQueryOptions) => {
  const options = Object.assign({},{ fetchPolicy: 'cache-first' }, opt)
  return graphql<{}, { user: typeof User }>(USER_QUERY, { options })(Components)
}
