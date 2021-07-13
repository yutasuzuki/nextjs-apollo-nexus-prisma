import React, { useCallback } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutSadminAuth.module.css'
import { SadminProps } from 'libs/withSadmin'
import { useEffect } from 'react'

interface Props {
  title?: string
  data: SadminProps['data']
}

export const LayoutSadminAuth: React.FC<Props> = ({ title, data, children }) => {
  const { sadmin, loading } = data
  const router = useRouter()

  useEffect(() => {
    if (!loading && sadmin) {
      router.push('/sadmin')
    }
  }, [loading, sadmin])

  if (loading || sadmin) return null

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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