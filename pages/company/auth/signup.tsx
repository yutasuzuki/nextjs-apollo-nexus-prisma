import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { auth } from 'libs/firebase'
import { gql, useMutation } from '@apollo/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadminAuth } from 'components/LayoutSadminAuth/LayoutSadminAuth'

const SIGNUP_COMPANY = gql`
  mutation SignupCompany($token: String!, $name: String!, $companyName: String!) {
    signupCompany(token: $token, name: $name companyName: $companyName) {
      id email token
    }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [items, setItems] = useState({
    name: '',
    companyName: '',
    email: '',
    password: ''
  })

  const [signupSadmin, { data: d }] = useMutation(SIGNUP_COMPANY, {
    onCompleted({ signupCompany }) {
      console.log(signupCompany)
      if (signupCompany?.token) {
        localStorage.setItem('user', signupCompany.token)
        router.push('/mypage')
      } else {
        localStorage.removeItem('user')
      }
    }
  })

  console.log('d', d)

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
      const res = await auth.createUserWithEmailAndPassword(items.email, items.password)
      if (res) {
        const token = await res.user.getIdToken()
        signupSadmin({
          variables: { 
            name: items.name,
            companyName: items.companyName,
            token
          }
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [items])

  return (
    <div>
      <h1>Comapany</h1>
      <form onSubmit={_handleOnSubmit}>
        <div>新規登録</div>
        <div>
          <label>担当者名</label>
          <div>
            <input name="name" onChange={_handleOnChange} value={items.name} required />
          </div>
        </div>
        <div>
          <label>会社名</label>
          <div>
            <input name="companyName" onChange={_handleOnChange} value={items.companyName} required />
          </div>
        </div>
        <div>
          <label>メールアドレス</label>
          <div>
            <input name="email" onChange={_handleOnChange} value={items.email} type="email" required />
          </div>
        </div>
        <div>
          <label>パスワード</label>
          <div>
            <input name="password" onChange={_handleOnChange} value={items.password} type="password" required minLength={4} />
          </div>
        </div>
        <div>
          <input type="submit" value="送信" />
        </div>
      </form>
      <div>
        <Link href="/sadmin/auth/signin"><a>ログイン</a></Link>
      </div>
    </div>
  )
}

export default Page