import React from 'react'
import Link from 'next/link'

interface Props {}

const Page: React.FC<Props> = (props) => {

  return (
    <div>
      <div>
        <section>
          <h2>Admin</h2>
          <div>
            <Link href="/admin/auth/signup"><a>新規登録</a></Link>
          </div>
          <div>
            <Link href="/admin/auth/signin"><a>ログイン</a></Link>
          </div>
        </section>
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


export default Page