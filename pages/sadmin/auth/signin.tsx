import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadminAuth } from 'components/LayoutSadminAuth/LayoutSadminAuth'

const SIGNIN_SADMIN = gql`
  mutation SigninSadmin($token: String!) {
    signinSadmin(token: $token) { id uid email token }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [signinSadmin] = useMutation(SIGNIN_SADMIN, {
    onCompleted({ signinSadmin }) {
      if (signinSadmin?.token) {
        localStorage.setItem('sadmin', signinSadmin.token)
        router.push('/sadmin')
      }
    }
  })

  const _handleOnSubmit = useCallback(async (e) => {
    e.preventDefault()
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      if (res) {
        const token = await res.user.getIdToken()
        signinSadmin({
          variables: { token }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [email, password])

  return (
    <LayoutSadminAuth data={data}>
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
    </LayoutSadminAuth>
  )
}

export default withSadmin(Page)