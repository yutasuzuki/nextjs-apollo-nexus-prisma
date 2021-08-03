import React, { useState, useCallback, useMemo } from 'react'
import styles from './index.module.css'
import { withMypage, MypageProps } from 'libs/withMypage'
import { gql, useMutation, useQuery } from '@apollo/client'
import { LayoutMypage } from 'components/LayoutMypage/LayoutMypage'
import { UserSignupRequest } from '@prisma/client'
import { User } from 'interfaces'
import commonStyles from 'styles/commonStyles.module.css'
import formStyles from 'styles/formStyles.module.css'
import utilStyles from 'styles/utilStyles.module.css'

const QUERY = gql`
  query {
    signupRequestUsers {
      id
      email
      companyId
      hash
    }
    companyUsers {
      id
      name
      email
      admin
      createdAt
    }
  }
`;

const ADD_USER_SIGNUP_REQUEST = gql`
  mutation addUserSignupRequest($email: String!) {
    addUserSignupRequest(email: $email) {
      status
    }
  }
`;

interface Props extends MypageProps {}

const Page: React.FC<Props> = ({ data }) => {
  const [email, setEmail] = useState('')
  const { loading, error, data: res, refetch } = useQuery<{ signupRequestUsers: UserSignupRequest[], companyUsers: User[] }>(QUERY)

  const [addUserSignupRequest] = useMutation(ADD_USER_SIGNUP_REQUEST, {
    onCompleted({ addUserSignupRequest }) {
      if (addUserSignupRequest?.status) {
        refetch()
        setEmail('')
        alert('送信完了しました')
      }
    }
  })

  const _handleOnSubmit = useCallback((e) => {
    e.preventDefault()
    addUserSignupRequest({
      variables: { email }
    })
  }, [email])

  const companyUserlist = useMemo(() => {
    if (!res) return []
    return res?.companyUsers.map((user, index) => {
      return (
        <li key={index}>{user.name} / {user.email}</li>
      )
    })
  }, [res])

  const signupRequestUserlist = useMemo(() => {
    if (!res) return []
    return res?.signupRequestUsers.map((user, index) => {
      return (
        <li key={index}>{user.email}</li>
      )
    })
  }, [res])

  return (
    <LayoutMypage data={data} title="メンバー一覧">
      <div className={commonStyles.heading}>
        メンバー
      </div>
      <ul className={`${commonStyles.list} ${utilStyles.mb24}`}>
        {companyUserlist}
      </ul>
      <div className={`${utilStyles.betweenCenter} ${utilStyles.mb24}`}>
        <div className={commonStyles.heading}>
          新規登録メール送付済み
        </div>
        <form onSubmit={_handleOnSubmit} className={formStyles.inputBox}>
          <input name="email" onChange={(e) => setEmail(e.currentTarget.value)} value={email} type="email" required placeholder="追加するメールアドレスを入力" />
          <input type="submit" value="送信" />
        </form>
      </div>
      <ul className={commonStyles.list}>
        {signupRequestUserlist}
      </ul>
    </LayoutMypage>
  )
}

export default withMypage(Page)