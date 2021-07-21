import { useMemo, useCallback } from 'react'
import { useLocalStorageState, useSize } from 'ahooks'
import { history } from 'umi'
import { ITabs } from '@/IType'

const tabs = Object.keys(ITabs)

function getNextTab(currentTab: ITabs): ITabs {
  const index = tabs.findIndex((tab) => tab === currentTab)
  const nextIndex = tabs[index + 1] ? index + 1 : 0
  return tabs[nextIndex] as ITabs
}

function getPrevTab(currentTab: ITabs): ITabs {
  const index = tabs.findIndex((tab) => tab === currentTab)
  const prevIndex = tabs[index - 1] ? index - 1 : tabs.length - 1
  return tabs[prevIndex] as ITabs
}

function useAppModel() {
  const { width, height } = useSize(document.body)

  const [currentTab, setCurrentTab] = useLocalStorageState('micro-app', ITabs['bing-proxy'])

  const changeTab = useCallback(
    (tab: ITabs) => {
      setCurrentTab(tab)
      history.push(`/${tab}`)
    },
    [setCurrentTab]
  )

  const moveTab = useCallback(
    (toRight: boolean) => {
      const nextTab = toRight ? getNextTab(currentTab) : getPrevTab(currentTab)
      setCurrentTab(nextTab)
      history.push(`/${nextTab}`)
    },
    [setCurrentTab, currentTab]
  )

  const viewAreaSize = useMemo(
    () => ({
      width,
      height: height! - 66,
    }),
    [width, height]
  )

  return {
    viewAreaSize,
    currentTab,
    changeTab,
    moveTab,
  }
}

export default useAppModel
