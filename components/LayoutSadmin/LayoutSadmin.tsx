import React, { useEffect, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { signOut, getAuth } from 'firebase/auth'
import styles from './LayoutSadmin.module.css'
import { SadminProps } from 'libs/withSadmin'

interface Props {
  title?: string
  data: SadminProps['data']
}

export const LayoutSadmin: React.FC<Props> = ({ title = '', data, children }) => {
  const { sadmin, loading } = data

  useEffect(() => {
    if (!loading && !sadmin) {
      location.href = '/sadmin/auth/signin'
    }
  }, [loading, sadmin])

  const _handleOnSignout = useCallback(async () => {
    await signOut(getAuth())
    location.href = '/sadmin/auth/signin'
  }, [])

  if (loading || !sadmin) return null

  return (
    <div className={styles.container}>
      <Head>
        <title>{title} | 管理者ページ</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <style>{`html, body { background: #fafafc; }`}</style>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Link href="/sadmin">
            <a>管理者ページ</a>
          </Link>
        </h1>
        <div>
          <a className={styles.logout} onClick={_handleOnSignout}>ログアウト</a>
        </div>
      </header>
      <aside className={styles.aside}>
        <nav>
          <ul className={styles.menu}>
            <li>
              <Link href="/sadmin">
                <a>ダッシュボード</a>
              </Link>
            </li>
            <li>
              <Link href="/sadmin/company">
                <a>会社一覧</a>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}