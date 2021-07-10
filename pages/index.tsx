import React, { useCallback } from 'react'
import Link from 'next/link'
import { withApollo, ApolloProps } from '../libs/withApollo'

interface Props extends ApolloProps {}

const Page: React.FC<Props> = (props) => {
  console.log(props)

  return (
    <div>
      {props.data.users?.map((user, index) => {
        return (
          <div key={index}>
            <p>{user.$name}</p>
            <p>{user.$description}</p>
            <p>{user.name}</p>
          </div>
        )
      })}
      <div>
        <section>
          <h2>Admin</h2>
          <div>
            <Link href="/admin/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/admin/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
        <section>
          <h2>Sadmin</h2>
          <div>
            <Link href="/sadmin/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/sadmin/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
      </div>
    </div>
  )
}


export default withApollo(Page)