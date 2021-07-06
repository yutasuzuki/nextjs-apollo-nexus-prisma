import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { auth } from 'libs/firebase'

type Props = {}

const Page: React.FC<Props> = (props) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const _handleOnSubmit = useCallback(async (event) => {
    if (loading) return
    setLoading(true)
    event.preventDefault()
    try {
      const res = await auth.signInWithEmailAndPassword(email, password)
      if (res) {
        const token = await res.user.getIdToken()
        const result = await fetch('/api/users/auth/signin',{ headers: { authorization: token }}).then(res => res.json())
        if (result.error) {
          setLoading(false)
        }
        if (result.user) {
          router.push('/mypage')
        }
      }
    } catch(error) {
      setLoading(false)
    }
  }, [email, password, loading])

  return (
    <div>
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
        <Link href="/auth/signup"><a>新規会員登録</a></Link>
      </div>
    </div>
  )
}

export default Page