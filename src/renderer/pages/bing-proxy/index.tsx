import React from 'react'
import { Button, Input, Table } from 'antd'
import { useModel } from 'umi'
import { remote } from 'electron'
import { useSize } from 'ahooks'

import styles from './index.less'
import { pick } from '@/helpers'
import { IBingSearchStatus } from '@/IType'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    ellipsis: {
      showTitle: true,
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: {
      showTitle: true,
    },
  },
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
    width: 60,
    render: (val: string) => {
      return (
        <Button
          type="link"
          onClick={(e) => {
            remote.shell.openExternal(val)
          }}
        >
          Link
        </Button>
      )
    },
  },
]

export default function BingProxy() {
  const { height } = useSize(document.body)
  const { searchResult, searchStatus, text, setText, startSearch } = useModel('useBingProxyModel', (m) =>
    pick(m, 'searchResult', 'searchStatus', 'text', 'setText', 'startSearch')
  )

  return (
    <div className={styles.container}>
      <Table
        loading={searchStatus === IBingSearchStatus.SEARCHING}
        size="small"
        dataSource={searchResult}
        columns={columns}
        rowKey="link"
        pagination={false}
        scroll={{
          y: height,
        }}
        title={() => (
          <Input
            className={styles.searchBox}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
            }}
            onPressEnter={startSearch}
          />
        )}
      />
    </div>
  )
}
