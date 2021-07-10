import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'

const SIGNUP_SADMIN = gql`
  mutation SignupSadmin($token: String!) {
    signupSadmin(token: $token) { id uid email token }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data: { sadmin } }) => {
  console.log('sadmin', sadmin)
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const [signupSadmin, { data }] = useMutation(SIGNUP_SADMIN, {
    onCompleted({ signupSadmin }) {
      if (signupSadmin?.token) {
        localStorage.setItem('sadmin', signupSadmin.token)
      }
    }
  })

  console.log('data', data)

  const _handleOnSubmit = useCallback(async (e) => {
    if (loading) return
    setLoading(true)
    e.preventDefault()
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      if (res) {
        const token = await res.user.getIdToken()
        console.log(token)
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
      <div>ログイン</div>
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
        <Link href="/sadmin/auth/signup"><a>新規登録</a></Link>
      </div>
    </div>
  )
}

export default withSadmin(Page)