import React from 'react'
import { Breadcrumb } from 'antd';

type Props = {
  nav?: navObject[]
}

type navObject = {
  to?: string,
  name?: string
}

const BreadCrumb = ({ nav }: Props) => {
  return (
    <Breadcrumb style={{ marginBottom: 50 }} data-testid='breadcrumb'>
      {nav?.length && nav.map((item, i) =>
        <Breadcrumb.Item key={i}>
          <a href={item?.to}>{item?.name}</a>
        </Breadcrumb.Item>
      )}
    </Breadcrumb>
  )
}

export default BreadCrumb