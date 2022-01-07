import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { gql, useMutation } from '@apollo/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadminAuth } from 'components/LayoutSadminAuth/LayoutSadminAuth'

const SIGNUP_COMPANY = gql`
  mutation SignupCompany($name: String!, $companyName: String!) {
    signupCompany(name: $name companyName: $companyName) {
      id email
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

  const [signupCompany] = useMutation(SIGNUP_COMPANY)

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
        const { data: { signupCompany: u } } = await signupCompany({
          variables: { 
            name: items.name,
            companyName: items.companyName
          }
        })
        if (u) {
          location.href = '/mypage'
        } else {
          await signOut(getAuth())
        }
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