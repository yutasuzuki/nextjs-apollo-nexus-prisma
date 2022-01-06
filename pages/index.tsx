import React from 'react'
import Link from 'next/link'
import { withMypage, MypageProps } from 'libs/withMypage'
import { gql, useMutation, useQuery } from '@apollo/client'

const QUERY = gql`
  query {
    companyUsers {
      id
    }
  }
`;


interface Props extends MypageProps {}

const Page: React.FC<Props> = ({ data }) => {
  const res = useQuery(QUERY)

  return (
    <div>
      <div>
        <section>
          <h2>company</h2>
          <div>
            <Link href="/company/auth/signup"><a>新規登録</a></Link>
          </div>
        </section>
        <hr />
        <section>
          <h2>User</h2>
          <div>
            <Link href="/mypage/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/mypage/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
        <hr />
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


export default withMypage(Page)