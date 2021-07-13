import React from 'react'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadmin } from 'components/LayoutSadmin/LayoutSadmin'

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  return (
    <LayoutSadmin data={data} title="ダッシュボード">
      <h1>Sadmin!!</h1>
    </LayoutSadmin>
  )
}

export default withSadmin(Page)