import { gql } from '@apollo/client'

export const USER_QUERY = gql`
  query {
    user {
      id
      uid
      email
      name
      company {
        id
        name
      }
    }
  }
`;