import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadminAuth } from 'components/LayoutSadminAuth/LayoutSadminAuth'
import commonStyles from 'styles/commonStyles.module.css'
import formStyles from 'styles/formStyles.module.css'
import utilStyles from 'styles/utilStyles.module.css'

const SIGNIN_SADMIN = gql`
  mutation SigninSadmin($token: String!) {
    signinSadmin(token: $token) { id uid email token }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [items, setItems] = useState({
    email: '',
    password: ''
  })

  const [signinSadmin] = useMutation(SIGNIN_SADMIN, {
    onCompleted({ signinSadmin }) {
      if (signinSadmin?.token) {
        localStorage.setItem('sadmin', signinSadmin.token)
        router.push('/sadmin')
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
      const res = await auth.signInWithEmailAndPassword(items.email, items.password)
      if (res) {
        const token = await res.user.getIdToken()
        signinSadmin({
          variables: { token }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [items])

  return (
    <LayoutSadminAuth data={data}>
      <div className={`${utilStyles.betweenCenter} ${utilStyles.mb16}`}>
        <div className={commonStyles.heading}>管理者 ログイン</div>
        <Link href="/sadmin/auth/signup"><a>新規登録</a></Link>
      </div>
      <form onSubmit={_handleOnSubmit}>
        <div className={formStyles.row}>
          <label className={formStyles.title}>メールアドレス</label>
          <div>
            <input className={formStyles.input} name="email" onChange={_handleOnChange} value={items.email} type="email" required />
          </div>
        </div>
        <div className={formStyles.row}>
          <label className={formStyles.title}>パスワード</label>
          <div>
            <input className={formStyles.input} name="password" onChange={_handleOnChange} value={items.password} type="password" autoComplete="on" required />
          </div>
        </div>
        <div className={formStyles.row}>
          <input className={formStyles.submit} type="submit" value="送信" />
        </div>
      </form>
    </LayoutSadminAuth>
  )
}

export default withSadmin(Page)