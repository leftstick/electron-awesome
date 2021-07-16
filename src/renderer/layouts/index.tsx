import { useEffect } from 'react'
import { IRouteComponentProps } from 'umi'

import { destoryGlobalSpinner } from '@/helpers'

export default ({ children, location }: IRouteComponentProps) => {
  useEffect(() => {
    destoryGlobalSpinner()
  }, [])

  return children
}
