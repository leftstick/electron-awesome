import React from 'react'
import { Button, Input, Table, Alert } from 'antd'
import { useModel } from 'umi'
import { remote } from 'electron'
import { useSize } from 'ahooks'

import styles from './index.less'
import { pick } from '@/helpers'
import { IBingSearchStatus, IBing } from '@/IType'

const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    ellipsis: true,
    render: (val: string, record: IBing) => {
      return (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={(e) => {
            remote.shell.openExternal(record.link)
          }}
        >
          {val}
        </Button>
      )
    },
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    ellipsis: true,
  },
]

export default function BingProxy() {
  const { height } = useSize(document.body)
  const { searchResult, searchStatus, text, setText, startSearch } = useModel('useBingProxyModel', (m) =>
    pick(m, 'searchResult', 'searchStatus', 'text', 'setText', 'startSearch')
  )

  return (
    <div className={styles.container}>
      <Alert
        message={
          <div>
            You will get the first 3 pages of result from&nbsp;
            <a
              href="https://bing.com"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                remote.shell.openExternal('https://bing.com')
              }}
            >
              bing.com
            </a>
            &nbsp;via puppeteer
          </div>
        }
        type="info"
      />
      <Table
        loading={searchStatus === IBingSearchStatus.SEARCHING}
        size="small"
        dataSource={searchResult}
        columns={columns}
        pagination={false}
        rowKey="id"
        scroll={{
          y: height! - 150,
        }}
        title={() => (
          <Input
            placeholder="Bing search text..."
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
