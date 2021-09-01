import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutSadminAuth.module.css'
import { SadminProps } from 'libs/withSadmin'

interface Props {
  title?: string
  data: SadminProps['data']
}

export const LayoutSadminAuth: React.FC<Props> = ({ title, data, children }) => {
  const { sadmin, loading } = data
  const router = useRouter()

  useEffect(() => {
    if (!loading && sadmin) {
      location.href = '/sadmin'
    }
  }, [loading, sadmin])

  if (loading || sadmin) return null

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