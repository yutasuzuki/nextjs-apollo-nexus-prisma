import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutSadmin.module.css'
import { SadminProps } from 'libs/withSadmin'
import { useCallback } from 'react'

interface Props {
  title?: string
  data: SadminProps['data']
}

export const LayoutSadmin: React.FC<Props> = ({ title = '', data, children }) => {
  const { sadmin, loading } = data
  const router = useRouter()

  useEffect(() => {
    if (!loading && !sadmin) {
      router.push('/sadmin/auth/signin')
    }
  }, [loading, sadmin])

  const _handleOnSignout = useCallback(() => {
    localStorage.removeItem('sadmin')
    location.href = '/sadmin/auth/signin'
  }, [router])

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
          <a onClick={_handleOnSignout}>ログアウト</a>
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
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  )
}