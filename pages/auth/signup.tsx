import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'

const SIGNUP_USER = gql`
  mutation signupUser($name: String!, $email: String!, $password: String!) {
    signupUser(name: $name, email: $email, password: $password) {
      name
    }
  }
`;

const UPDATE_USER = gql`
  mutation hoge($name: String!) {
    updateUser(name: $name) {
      text
      user {
        name
      }
    }
  }
`;

// const UPDATE_USER = gql`
// `

type Props = {}

const Page: React.FC<Props> = (props) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [signupUser, { data }] = useMutation(SIGNUP_USER, {
    onCompleted({ login }) {
      console.log(login)
      // localStorage.setItem('token', login);
    }
  });

  const [updateUser, { data: s }] = useMutation(UPDATE_USER, {
    onCompleted(d) {
      console.log(d)
    }
  });

  // console.log('data', data)
  console.log('s', s)

  const _handleOnSubmit = useCallback(async (e) => {
    // if (loading) return
    // setLoading(true)
    e.preventDefault()
    // signupUser({
    //   variables: { name: '42', email, password },
    // });
    updateUser({
      variables: { name: 'ee' }
    })
    // try {
    //   const res = await auth.createUserWithEmailAndPassword(email, password)
    //   if (res) {
    //     const token = await res.user.getIdToken()
    //     signupUser({ variables: { token } });
    //     if (token) {
    //       router.push('/')
    //     }
    //     setLoading(false)
    //   }
    // } catch (e) {
    //   setLoading(false)
    // }
  }, [email, password, loading])




  return (
    <div>
      <div>新規会員登録</div>
      <div>
        <label>メールアドレス</label>
        <div>
          <input onChange={(e) => setEmail(e.currentTarget.value)} value={email} type="email" />
        </div>
      </div>
      <div>
        <label>パスワード</label>
        <div>
          <input onChange={(e) => setPassword(e.currentTarget.value)} value={password} type="password" />
        </div>
      </div>
      <div>
        <button onClick={_handleOnSubmit}>送信</button>
      </div>
      <div>
        <Link href="/auth/signin"><a>ログイン</a></Link>
      </div>
    </div>
  )
}

export default Page