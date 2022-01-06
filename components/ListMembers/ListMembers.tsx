import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import styles from './LayoutMypage.module.css'
import { MypageProps } from 'libs/withMypage'

interface Props {
  items?: string
  data: MypageProps['data']
}

export const ListMembers: React.FC<Props> = ({ data, children }) => {
  return (
    <div className={styles.container}>
    </div>
  )
}