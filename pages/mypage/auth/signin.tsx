import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { gql, useMutation } from '@apollo/client'
import { signInWithEmailAndPassword, getAuth, signOut } from 'firebase/auth'
import { withMypage, MypageProps } from 'libs/withMypage'
import { LayoutMypageAuth } from 'components/LayoutMypageAuth/LayoutMypageAuth'
import commonStyles from 'styles/commonStyles.module.css'
import formStyles from 'styles/formStyles.module.css'
import utilStyles from 'styles/utilStyles.module.css'

const SIGNIN_USER = gql`
  mutation SigninUser {
    signinUser { id uid email }
  }
`;

interface Props extends MypageProps {}

const Page: React.FC<Props> = ({ data }) => {
  const router = useRouter()
  const [items, setItems] = useState({
    email: '',
    password: ''
  })

  const [signinUser] = useMutation(SIGNIN_USER, {
    onCompleted({ signinUser }) {
      if (signinUser?.token) {
        localStorage.setItem('user', signinUser.token)
        router.push('/mypage', undefined, { shallow: true })
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
      const res = await signInWithEmailAndPassword(getAuth(), items.email, items.password)
      if (res) {
        const { data: { signinUser: u } } = await signinUser()
        if (u) {
          location.href = '/mypage'
        } else {
          await signOut(getAuth())
        }
      }
    } catch (error) {
      console.error(error)
    }
  }, [items, signinUser])

  return (
    <LayoutMypageAuth data={data}>
      <form onSubmit={_handleOnSubmit}>
        <div className={`${utilStyles.betweenCenter} ${utilStyles.mb16}`}>
          <div className={commonStyles.heading}>????????????????????????</div>
          <Link href="/mypage/auth/signup"><a>????????????</a></Link>
        </div>
        <div className={formStyles.row}>
          <label className={formStyles.title}>?????????????????????</label>
          <div>
            <input className={formStyles.input} name="email" onChange={_handleOnChange} value={items.email} type="email" required />
          </div>
        </div>
        <div className={formStyles.row}>
          <label className={formStyles.title}>???????????????</label>
          <div>
            <input className={formStyles.input} name="password" onChange={_handleOnChange} value={items.password} type="password" autoComplete="on" required />
          </div>
        </div>
        <div className={formStyles.row}>
          <input className={formStyles.submit} type="submit" value="??????" />
        </div>
      </form>
    </LayoutMypageAuth>
  )
}

export default withMypage(Page, { fetchPolicy: 'no-cache' })