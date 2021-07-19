import { useState, useCallback, useEffect } from 'react'
import { message } from 'antd'
import { ipcRenderer } from 'electron'

import { IBingSearchStatus, IBing } from '@/IType'

function useBingProxyModel() {
  const [text, setText] = useState<string>('')
  const [searchStatus, setSearchStatus] = useState(IBingSearchStatus.INITIAL)
  const [searchResult, setSearchResult] = useState<IBing[]>([])

  const registerIpcListeners = useCallback(() => {
    ipcRenderer.on('BING_PROXY_FINISH', (e, result) => {
      setSearchStatus(IBingSearchStatus.SEARCH_DONE)
      setSearchResult(result)
    })

    ipcRenderer.on('BING_PROXY_ERROR', (e, err) => {
      setSearchStatus(IBingSearchStatus.INITIAL)
      message.error(`Failed to search => ${err.message}`)
    })
  }, [setSearchStatus])

  const unRegisterIpcListeners = useCallback(() => {
    ;['BING_PROXY_FINISH', 'BING_PROXY_ERROR'].forEach((e) => {
      ipcRenderer.removeAllListeners(e)
    })
  }, [])

  const startSearch = useCallback(() => {
    ipcRenderer.send('BING_PROXY_START_SEARCH', text)
    setSearchStatus(IBingSearchStatus.SEARCHING)
  }, [text, setSearchStatus])

  useEffect(() => {
    registerIpcListeners()
    return unRegisterIpcListeners
  }, [registerIpcListeners, unRegisterIpcListeners])

  return {
    text,
    setText,
    searchStatus,
    startSearch,
    searchResult,
  }
}

export default useBingProxyModel
