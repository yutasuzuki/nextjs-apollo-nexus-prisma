import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth'
import { gql, useMutation } from '@apollo/client'
import { setCookie } from 'nookies'
import { NOOKIES_EXPIRES_IN } from '../../../constants'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadminAuth } from 'components/LayoutSadminAuth/LayoutSadminAuth'
import commonStyles from 'styles/commonStyles.module.css'
import formStyles from 'styles/formStyles.module.css'
import utilStyles from 'styles/utilStyles.module.css'

const SIGNUP_SADMIN = gql`
  mutation SignupSadmin($token: String!) {
    signupSadmin(token: $token) { id uid email token }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  const [items, setItems] = useState({
    email: '',
    password: ''
  })
  const [signupSadmin] = useMutation(SIGNUP_SADMIN)

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
      const res = await createUserWithEmailAndPassword(getAuth(), items.email, items.password)
      if (res) {
        const token = await res.user.getIdToken()
        const { data: { signupSadmin: sadmin } } = await signupSadmin({
          variables: { token }
        })
        setCookie(null, 'sadmin', sadmin.token, {
          maxAge: NOOKIES_EXPIRES_IN,
          path: '/',
        })
        location.href = '/sadmin'
      }
    } catch (error) {
      console.error(error)
    }
  }, [items])

  return (
    <LayoutSadminAuth data={data}>
      <div className={`${utilStyles.betweenCenter} ${utilStyles.mb16}`}>
        <div className={commonStyles.heading}>管理者 新規登録</div>
        <Link href="/sadmin/auth/signin"><a>ログイン</a></Link>
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