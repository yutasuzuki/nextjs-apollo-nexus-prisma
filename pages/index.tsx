import React from 'react'
import Link from 'next/link'
import { withMypage } from 'libs/withMypage'

interface Props {}

const Page: React.FC<Props> = (props) => {

  return (
    <div>
      <div>
        <section>
          <h2>company</h2>
          <div>
            <Link href="/company/auth/signup"><a>新規登録</a></Link>
          </div>
        </section>
        <hr />
        <section>
          <h2>User</h2>
          <div>
            <Link href="/mypage/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/mypage/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
        <hr />
        <section>
          <h2>Sadmin</h2>
          <div>
            <Link href="/sadmin/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/sadmin/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
      </div>
    </div>
  )
}


export default withMypage(Page)