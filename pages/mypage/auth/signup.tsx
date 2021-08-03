import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'
import { withMypage, MypageProps } from 'libs/withMypage'
import { LayoutMypageAuth } from 'components/LayoutMypageAuth/LayoutMypageAuth'
import { GetServerSideProps } from 'next'
import { GRAPHQL_ENTRY_POINT } from '../../../constants'
import { GraphQLClient } from 'graphql-request'
import { UserSignupRequest, Company } from '@prisma/client'

const SIGNUP_USER = gql`
  mutation SignupUser($name: String!, $token: String!, $companyId: Int!) {
    signupUser(name: $name, token: $token, companyId: $companyId) { id uid email token }
  }
`;

type UserState = (UserSignupRequest & { 
  company: Company
})

interface Props extends MypageProps {
  user: UserState
}

const Page: React.FC<Props> = ({ data, user }) => {
  const router = useRouter()
  const [items, setItems] = useState({
    name: '',
    email: '',
    password: ''
  })

  const [signupUser] = useMutation(SIGNUP_USER, {
    onCompleted({ signupUser }) {
      console.log(signupUser)
      if (signupUser?.token) {
        localStorage.setItem('user', signupUser.token)
        router.push('/mypage')
      } else {
        localStorage.removeItem('user')
      }
    }
  })

  const _handleOnChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault()
    const { name, value } = e.target
    setItems((item) => {
      return {
        ...item,
        [name]: value
      }
    })
  }, [])

  const _handleOnSubmit = useCallback(async (e) => {
    e.preventDefault()
    try {
      const res = await auth.createUserWithEmailAndPassword(user.email, items.password)
      if (res) {
        const token = await res.user.getIdToken()
        signupUser({
          variables: {
            name: items.name,
            companyId: user.company?.id,
            token
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [items])

  return (
    <LayoutMypageAuth data={data}>
      <h1>User</h1>
      <form onSubmit={_handleOnSubmit}>
        <div>新規登録 {user.company?.name}</div>
        <div>
          <label>メールアドレス</label>
          <div>
            <input name="email" value={user.email} disabled />
          </div>
        </div>
        <div>
          <label>お名前</label>
          <div>
            <input name="name" onChange={_handleOnChange} value={items.name} required />
          </div>
        </div>
        <div>
          <label>パスワード</label>
          <div>
            <input name="password" onChange={_handleOnChange} value={items.password} type="password" autoComplete="on" required />
          </div>
        </div>
        <div>
          <input type="submit" value="送信" />
        </div>
      </form>
      <div>
        <Link href="/auth/signin"><a>ログイン</a></Link>
      </div>
    </LayoutMypageAuth>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const redirect = {
    redirect: {
      permanent: false,
      destination: '/'
    }
  }
  try {
    if (!context.query.hash) return redirect
    const hash = context.query.hash as string
    const client = new GraphQLClient(GRAPHQL_ENTRY_POINT)
    const query = gql`
      query($hash: String!) {
        signupRequestUser(hash: $hash) {
          id
          email
          company {
            id
            name
          }
        }
      }
    `;
    const res = await client.request<{ signupRequestUser: UserState}>(query, { hash })
    if (!res.signupRequestUser) return redirect
    return {
      props: {
        user: res.signupRequestUser
      }
    }
  } catch (error) {
    console.error(error)
    return redirect
  }
}
export default withMypage(Page, { fetchPolicy: 'no-cache' })