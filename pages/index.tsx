import { gql, useQuery } from '@apollo/client'
import { User } from 'nexus-prisma'

export const USERS_QUERY = gql`
  query {
    users {
      id
      name
    }
  }
`;

const IndexPage = () => {
  const { loading, error, data } = useQuery<{ users: typeof User[]}>(USERS_QUERY)

  console.log('loading', loading)
  console.log('error', error)
  console.log('data', data?.users)

  return (
    <div>
      <h1>Hello Next.js 👋</h1>
    </div>
  )
}

export default IndexPage
