import React, { useEffect } from 'react'
import { IRouteComponentProps, useModel } from 'umi'
import { Layout, Menu } from 'antd'
import { ipcRenderer } from 'electron'

import { destoryGlobalSpinner, pick } from '@/helpers'
import { ITabs } from '@/IType'
import { PreferencesButton } from '@/components'

import styles from './index.less'

const OPEN_PATHS = ['/terminal']

export default ({ children, location }: IRouteComponentProps) => {
  const { currentTab, changeTab, moveTab } = useModel('useAppModel', (m) =>
    pick(m, 'currentTab', 'changeTab', 'moveTab')
  )

  useEffect(() => {
    destoryGlobalSpinner()
  }, [])

  useEffect(() => {
    ipcRenderer.on('change-tab-to', (e, tab) => {
      // support URL Scheme
      if (tab.startsWith('electron-awesome://')) {
        const realTab: ITabs = tab.replace(/^electron-awesome:\/\//, '')
        if (Object.values(ITabs).includes(realTab)) {
          changeTab(realTab)
        }
      } else if (tab === 'next') {
        moveTab(true)
      } else if (tab === 'previous') {
        moveTab(false)
      } else {
        changeTab(tab as ITabs)
      }
    })

    return () => {
      ipcRenderer.removeAllListeners('change-tab-to')
    }
  }, [changeTab, moveTab])

  // go to open paths
  if (OPEN_PATHS.some((path) => location.pathname.includes(path))) {
    return children
  }

  return (
    <Layout className="layout">
      <Layout.Header className={styles.navigatorBar}>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[currentTab!]}
          onSelect={(e) => {
            const { key } = e
            if (key === currentTab) {
              return
            }
            changeTab(key as ITabs)
          }}
        >
          <Menu.Item key={ITabs['bing-proxy']}>Bing Search</Menu.Item>
        </Menu>
        <PreferencesButton />
      </Layout.Header>
      <Layout.Content style={{ padding: 0, borderTop: '2px solid #ecedf0' }}>{children}</Layout.Content>
    </Layout>
  )
}
