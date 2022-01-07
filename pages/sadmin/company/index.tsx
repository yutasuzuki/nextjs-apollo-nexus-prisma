import React, { useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import { Company } from '@prisma/client'
import { withSadmin, SadminProps } from 'libs/withSadmin'
import { LayoutSadmin } from 'components/LayoutSadmin/LayoutSadmin'
import commonStyles from 'styles/commonStyles.module.css'
import formStyles from 'styles/formStyles.module.css'
import utilStyles from 'styles/utilStyles.module.css'

const QUERY = gql`
  query {
    companies {
      id
      name
    }
  }
`;

interface Props extends SadminProps {}

const Page: React.FC<Props> = ({ data }) => {
  const { loading, error, data: res, refetch } = useQuery<{ companies: Company[] }>(QUERY)

  const companyList = useMemo(() => {
    return res?.companies.map((company, index) => {
      return (
        <li key={index}>
          {company.name}
        </li>
      )
    })
  }, [res?.companies])

  return (
    <LayoutSadmin data={data} title="会社一覧">
      <div className={commonStyles.heading}>会社一覧</div>
      <ul className={commonStyles.list}>{companyList}</ul>
    </LayoutSadmin>
  )
}

export default withSadmin(Page)