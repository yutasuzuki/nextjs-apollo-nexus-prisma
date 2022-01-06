import React from 'react'
import styles from './index.module.css'
import { withMypage, MypageProps } from 'libs/withMypage'
import { LayoutMypage } from 'components/LayoutMypage/LayoutMypage'

interface Props extends MypageProps {}

const Page: React.FC<Props> = ({ data }) => {

  return (
      <LayoutMypage data={data} title="ダッシュボード">
        <div>
        ダッシュボード
        </div>
      </LayoutMypage>
  )
}

export default withMypage(Page)