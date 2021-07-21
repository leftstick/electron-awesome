import React from 'react'
import { Alert } from 'antd'
import { useModel } from 'umi'

import styles from './index.less'
import { pick } from '@/helpers'
import {} from '@/IType'

export default function BingProxy() {
  const { viewAreaSize } = useModel('useAppModel', (m) => pick(m, 'viewAreaSize'))

  return (
    <div className={styles.container} style={{ height: viewAreaSize.height }}>
      <Alert message="Here is preference page" type="info" />
    </div>
  )
}
