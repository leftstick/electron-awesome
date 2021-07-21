import React from 'react'
import { useModel } from 'umi'
import { SettingOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import { pick } from '@/helpers'
import { ITabs } from '@/IType'

import styles from './index.less'

export function PreferencesButton() {
  const { currentTab, changeTab } = useModel('useAppModel', (m) => pick(m, 'changeTab', 'currentTab'))
  return (
    <div className={styles.container}>
      <SettingOutlined
        className={classnames(styles.btn, { [styles.active]: currentTab === ITabs.preference })}
        onClick={() => {
          if (currentTab === ITabs.preference) {
            return
          }
          changeTab(ITabs.preference)
        }}
      />
    </div>
  )
}
