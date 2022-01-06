import React, { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutMypage.module.css'
import { MypageProps } from 'libs/withMypage'

interface Props {
  title?: string
  data: MypageProps['data']
}

export const LayoutMypage: React.FC<Props> = ({ title = '', data, children }) => {
  const router = useRouter()
  const { user, loading } = data

  useEffect(() => {
    if (!loading && !user) {
      location.href = '/mypage/auth/signin'
    }
  }, [loading, user])

  const _handleOnSignout = useCallback(() => {
    location.href = '/mypage/auth/signin'
  }, [])

  if (loading || !user) return null

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | マイページ</title>
        <style>{`html, body { background: #fafafc; }`}</style>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Link href="/mypage">
            <a>マイページ</a>
          </Link>
        </h1>
        <div>
          <a onClick={_handleOnSignout}>ログアウト</a>
        </div>
      </header>
      <aside className={styles.aside}>
        <nav>
          <ul className={styles.menu}>
            <li>
              <Link href="/mypage">
                <a>ダッシュボード</a>
              </Link>
            </li>
            <li>
              <Link href="/mypage/members">
                <a>メンバー</a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}