import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutMypageAuth.module.css'
import { MypageProps } from 'libs/withMypage'
import { useEffect } from 'react'

interface Props {
  title?: string
  data: MypageProps['data']
}

export const LayoutMypageAuth: React.FC<Props> = ({ title, data, children }) => {
  const { user, loading } = data

  useEffect(() => {
    if (!loading && user) {
      location.href = '/mypage'
    }
  }, [loading, user])

  if (loading || user) return null

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
      </Head>
      <header className={styles.header}>
        <h1 className={styles.logo}>
          <Link href="/">
            <a>サイト名</a>
          </Link>
        </h1>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  )
}