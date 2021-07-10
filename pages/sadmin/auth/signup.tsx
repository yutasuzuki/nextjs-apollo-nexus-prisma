import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'

const SIGNUP_SADMIN = gql`
  mutation SignupSadmin($token: String!) {
    signupSadmin(token: $token) { id uid email token }
  }
`;

type Props = {}

const Page: React.FC<Props> = (props) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [signupSadmin, { data }] = useMutation(SIGNUP_SADMIN, {
    onCompleted({ signupSadmin }) {
      if (signupSadmin?.token) {
        console.log('onCompleted!!', signupSadmin)
        localStorage.setItem('sadmin', signupSadmin.token)
      }
    }
  });

  console.log('data', data)

  const _handleOnSubmit = useCallback(async (e) => {
    if (loading) return
    setLoading(true)
    e.preventDefault()
    try {
      const res = await auth.createUserWithEmailAndPassword(email, password)
      if (res) {
        const token = await res.user.getIdToken()
        signupSadmin({
          variables: { token }
        })
      }
      setLoading(false)
    } catch (error) {
      console.error(error)
      setLoading(false)
    }
  }, [email, password, loading])

  return (
    <div>
      <h1>Sadmin</h1>
      <div>新規登録</div>
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
        <Link href="/sadmin/auth/signin"><a>ログイン</a></Link>
      </div>
    </div>
  )
}

export default Page